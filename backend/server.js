console.log("Server is starting...");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== AUTHENTICATION ENDPOINTS ====================

// Sign Up endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { role, name, phone, password, gender, address, aadhar } = req.body;

        // Validation
        if (!name || !phone || !role || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, role, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this phone number"
            });
        }

        // Create new user
        const newUser = new User({
            name,
            phone,
            role,
            password, // Plain text as requested for efficiency, though hashing is recommended
            gender: gender || '',
            address: address || '',
            aadhar: aadhar || ''
        });

        await newUser.save();

        // Log user registration details to terminal
        console.log("\n" + "=".repeat(60));
        console.log("✅ NEW USER REGISTERED");
        console.log("=".repeat(60));
        console.log(`👤 Name: ${newUser.name}`);
        console.log(`📞 Phone: ${newUser.phone}`);
        console.log(`👔 Role: ${newUser.role}`);
        if (newUser.gender) {
            console.log(`⚧️  Gender: ${newUser.gender}`);
        }
        if (newUser.address) {
            console.log(`📍 Address: ${newUser.address}`);
        }
        if (newUser.aadhar) {
            console.log(`🆔 Aadhar: ${newUser.aadhar}`);
        }
        console.log(`🆔 User ID: ${newUser._id}`);
        console.log(`📅 Registered At: ${newUser.createdAt}`);
        console.log("=".repeat(60) + "\n");

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: newUser.getPublicProfile()
        });

    } catch (error) {
        console.error("❌ Error during signup:", error);
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this phone number"
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// Sign In endpoint
app.post('/api/signin', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone number and password are required"
            });
        }

        // Find user by phone
        const user = await User.findOne({ phone, isActive: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first."
            });
        }

        // Verify password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Log sign in details to terminal
        console.log("\n" + "=".repeat(60));
        console.log("✅ USER SIGNED IN");
        console.log("=".repeat(60));
        console.log(`👤 Name: ${user.name}`);
        console.log(`📞 Phone: ${user.phone}`);
        console.log(`👔 Role: ${user.role}`);
        console.log(`🆔 User ID: ${user._id}`);
        console.log(`📅 Last Login: ${new Date().toISOString()}`);
        console.log("=".repeat(60) + "\n");

        res.status(200).json({
            success: true,
            message: "Sign in successful",
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error("❌ Error during signin:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// Get user profile endpoint
app.get('/api/user/:phone', async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.params.phone, isActive: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// Get all users (admin endpoint)
app.get('/api/users', async (req, res) => {
    try {
        const { role } = req.query;
        
        const filter = { isActive: true };
        if (role) {
            filter.role = role;
        }

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        const transformedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            gender: user.gender,
            address: user.address,
            email: user.email,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            count: transformedUsers.length,
            users: transformedUsers
        });

    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// ==================== PRODUCT ENDPOINTS ====================

// API endpoint to add farmer products with image
app.post('/api/products/add', upload.single('productImage'), async (req, res) => {
    try {
        const {
            farmerName,
            productName,
            category,
            quantity,
            unit,
            pricePerUnit,
            location,
            contactNumber,
            description,
            imageUrl
        } = req.body;

        // Validation
        if (!farmerName || !productName || !category || !quantity || !pricePerUnit || !location || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Determine image URL
        let finalImageUrl = imageUrl || '';
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        }

        // Create new product in MongoDB
        const newProduct = new Product({
            farmerName,
            productName,
            category,
            quantity: parseFloat(quantity),
            unit,
            pricePerUnit: parseFloat(pricePerUnit),
            location,
            contactNumber,
            description: description || "",
            imageUrl: finalImageUrl,
            status: "available"
        });

        // Save to database
        await newProduct.save();

        // Log product details to terminal
        console.log("\n" + "=".repeat(60));
        console.log("✅ NEW PRODUCT ADDED TO DATABASE");
        console.log("=".repeat(60));
        console.log(`📦 Product Name: ${newProduct.productName}`);
        console.log(`👨‍🌾 Farmer Name: ${newProduct.farmerName}`);
        console.log(`📂 Category: ${newProduct.category}`);
        console.log(`📊 Quantity: ${newProduct.quantity} ${newProduct.unit}`);
        console.log(`💰 Price: ₹${newProduct.pricePerUnit}/${newProduct.unit}`);
        console.log(`📍 Location: ${newProduct.location}`);
        console.log(`📞 Contact: ${newProduct.contactNumber}`);
        if (newProduct.description) {
            console.log(`📝 Description: ${newProduct.description}`);
        }
        if (newProduct.imageUrl) {
            console.log(`🖼️  Image: ${newProduct.imageUrl}`);
        }
        console.log(`🆔 Product ID: ${newProduct._id}`);
        console.log(`📅 Created At: ${newProduct.createdAt}`);
        console.log("=".repeat(60) + "\n");

        const productResponse = {
            id: newProduct._id,
            farmerName: newProduct.farmerName,
            productName: newProduct.productName,
            category: newProduct.category,
            quantity: newProduct.quantity,
            unit: newProduct.unit,
            pricePerUnit: newProduct.pricePerUnit,
            location: newProduct.location,
            contactNumber: newProduct.contactNumber,
            description: newProduct.description,
            imageUrl: newProduct.imageUrl,
            status: newProduct.status,
            createdAt: newProduct.createdAt
        };

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: productResponse
        });

    } catch (error) {
        console.error("❌ Error adding product:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// API endpoint to get all products
app.get('/api/products', async (req, res) => {
    try {
        // Get all products, sorted by newest first
        const products = await Product.find({ status: 'available' })
            .sort({ createdAt: -1 })
            .lean();

        // Transform _id to id for frontend compatibility
        const transformedProducts = products.map(product => ({
            id: product._id,
            farmerName: product.farmerName,
            productName: product.productName,
            category: product.category,
            quantity: product.quantity,
            unit: product.unit,
            pricePerUnit: product.pricePerUnit,
            location: product.location,
            contactNumber: product.contactNumber,
            description: product.description,
            imageUrl: product.imageUrl,
            status: product.status,
            createdAt: product.createdAt
        }));

        res.status(200).json({
            success: true,
            count: transformedProducts.length,
            products: transformedProducts
        });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// API endpoint to get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product: {
                id: product._id,
                farmerName: product.farmerName,
                productName: product.productName,
                category: product.category,
                quantity: product.quantity,
                unit: product.unit,
                pricePerUnit: product.pricePerUnit,
                location: product.location,
                contactNumber: product.contactNumber,
                description: product.description,
                imageUrl: product.imageUrl,
                status: product.status,
                createdAt: product.createdAt
            }
        });
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// API endpoint to update product status
app.patch('/api/products/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['available', 'sold', 'unavailable'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product status updated",
            product
        });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// API endpoint to update product
app.put('/api/products/:id', upload.single('productImage'), async (req, res) => {
    try {
        const {
            farmerName,
            productName,
            category,
            quantity,
            unit,
            pricePerUnit,
            location,
            contactNumber,
            description,
            imageUrl
        } = req.body;

        // Find existing product
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Determine image URL
        let finalImageUrl = imageUrl || existingProduct.imageUrl;
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
            
            // Delete old image if exists
            if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, existingProduct.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                farmerName: farmerName || existingProduct.farmerName,
                productName: productName || existingProduct.productName,
                category: category || existingProduct.category,
                quantity: quantity ? parseFloat(quantity) : existingProduct.quantity,
                unit: unit || existingProduct.unit,
                pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : existingProduct.pricePerUnit,
                location: location || existingProduct.location,
                contactNumber: contactNumber || existingProduct.contactNumber,
                description: description || existingProduct.description,
                imageUrl: finalImageUrl
            },
            { new: true, runValidators: true }
        );

        console.log("\n" + "=".repeat(60));
        console.log("✏️  PRODUCT UPDATED");
        console.log("=".repeat(60));
        console.log(`📦 Product Name: ${updatedProduct.productName}`);
        console.log(`👨‍🌾 Farmer Name: ${updatedProduct.farmerName}`);
        console.log(`💰 Price: ₹${updatedProduct.pricePerUnit}/${updatedProduct.unit}`);
        console.log(`🆔 Product ID: ${updatedProduct._id}`);
        console.log("=".repeat(60) + "\n");

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: {
                id: updatedProduct._id,
                farmerName: updatedProduct.farmerName,
                productName: updatedProduct.productName,
                category: updatedProduct.category,
                quantity: updatedProduct.quantity,
                unit: updatedProduct.unit,
                pricePerUnit: updatedProduct.pricePerUnit,
                location: updatedProduct.location,
                contactNumber: updatedProduct.contactNumber,
                description: updatedProduct.description,
                imageUrl: updatedProduct.imageUrl,
                status: updatedProduct.status,
                createdAt: updatedProduct.createdAt
            }
        });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// API endpoint to delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete associated image file if exists
        if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// ============================================================
// INVOICE PDF GENERATION (single page, QR code, clean layout)
// ============================================================
app.post('/api/generate-invoice', async (req, res) => {
    try {
        const PDFDocument = require('pdfkit');
        const QRCode = require('qrcode');
        const { cart, total, paymentMethod, orderId } = req.body;

        if (!cart || !cart.length) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const buyerName = req.body.buyerName || 'Valued Customer';
        const invoiceNumber = `MC-${orderId || Date.now().toString().slice(-8)}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const subtotal = cart.reduce((s, i) => s + (i.pricePerUnit || 0) * (i.qty || 1), 0);
        const cgst = subtotal * 0.025;
        const sgst = subtotal * 0.025;
        const grandTotal = subtotal + cgst + sgst;
        const payLabel = paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery';

        // ── QR Data: readable order info ──
        const qrText = [
            `INVOICE: ${invoiceNumber}`,
            `DATE: ${dateStr} ${timeStr}`,
            `BUYER: ${buyerName}`,
            `ITEMS: ${cart.map(i => `${i.productName} x${i.qty}`).join(', ')}`,
            `SUBTOTAL: Rs.${subtotal.toFixed(2)}`,
            `CGST 2.5%: Rs.${cgst.toFixed(2)}`,
            `SGST 2.5%: Rs.${sgst.toFixed(2)}`,
            `GRAND TOTAL: Rs.${grandTotal.toFixed(2)}`,
            `PAYMENT: ${payLabel}`,
            `COMPANY: MandiConnect Pvt. Ltd.`,
            `GSTIN: 07AABCU9603R1ZM`,
        ].join('\n');

        const qrPng = await QRCode.toDataURL(qrText, { width: 140, margin: 1, errorCorrectionLevel: 'L' });
        const qrBuf = Buffer.from(qrPng.split(',')[1], 'base64');

        // ── Create single-page PDF ──
        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        // BLOCK extra page creation — this is the definitive fix
        doc.addPage = () => doc;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice_${invoiceNumber}.pdf`);
        doc.pipe(res);

        const PW = 595.28; // A4 width
        const M = 40;
        const CW = PW - 2 * M; // content width
        const RX = PW - M;     // right edge
        let y = 0;

        // Helper: draw text at exact position, never break
        const t = (str, x, ty, opts = {}) => {
            doc.text(str, x, ty, { ...opts, lineBreak: false });
        };

        // ════════════════════════════════════════
        // GREEN HEADER
        // ════════════════════════════════════════
        doc.rect(0, 0, PW, 78).fill('#16a34a');
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#fff');
        t('MandiConnect', M, 16);
        doc.fontSize(9).font('Helvetica').fillColor('#bbf7d0');
        t('Farm-to-Retail Marketplace | www.mandiconnect.in', M, 42);

        doc.fontSize(18).font('Helvetica-Bold').fillColor('#fff');
        t('TAX INVOICE', M, 16, { width: CW, align: 'right' });
        doc.fontSize(9).font('Helvetica').fillColor('#bbf7d0');
        t(`#${invoiceNumber}  |  ${dateStr}  ${timeStr}`, M, 42, { width: CW, align: 'right' });

        y = 90;

        // ════════════════════════════════════════
        // FROM / BILL TO
        // ════════════════════════════════════════
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#94a3b8');
        t('FROM', M, y); t('BILL TO', M + 280, y);
        y += 11;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b');
        t('MandiConnect Pvt. Ltd.', M, y); t(buyerName, M + 280, y);
        y += 13;
        doc.fontSize(8).font('Helvetica').fillColor('#475569');
        t('123 Krishi Bhawan, Sector 12, New Delhi 110001', M, y); t(`Order: ${orderId || 'N/A'}`, M + 280, y);
        y += 11;
        t('+91 11-2345-6789 | billing@mandiconnect.in', M, y); t(`Payment: ${payLabel} | Status: PAID`, M + 280, y);
        y += 11;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#16a34a');
        t('GSTIN: 07AABCU9603R1ZM', M, y);
        y += 14;

        // ════════════════════════════════════════
        // ITEM TABLE
        // ════════════════════════════════════════
        doc.moveTo(M, y).lineTo(RX, y).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
        y += 4;

        // Column positions
        const c = { n: M+2, p: M+22, f: M+200, q: M+310, r: M+365, a: M+435 };
        const w = { n: 18,  p: 175,  f: 105,   q: 50,    r: 65,    a: CW-(435-2) };

        // Header row
        doc.rect(M, y, CW, 18).fill('#f1f5f9');
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#475569');
        t('#', c.n, y+5, {width:w.n}); t('Product', c.p, y+5, {width:w.p});
        t('Farmer', c.f, y+5, {width:w.f}); t('Qty', c.q, y+5, {width:w.q, align:'center'});
        t('Rate (₹)', c.r, y+5, {width:w.r, align:'right'}); t('Amount (₹)', c.a, y+5, {width:w.a, align:'right'});
        y += 20;

        // Data rows
        cart.forEach((item, i) => {
            const amt = (item.pricePerUnit || 0) * (item.qty || 1);
            if (i % 2 !== 0) doc.rect(M, y, CW, 17).fill('#fafafa');

            doc.fontSize(7.5).font('Helvetica').fillColor('#94a3b8');
            t(`${i+1}`, c.n, y+4, {width:w.n});
            doc.font('Helvetica-Bold').fillColor('#1e293b');
            t((item.productName||'Product').slice(0,30), c.p, y+4, {width:w.p});
            doc.font('Helvetica').fillColor('#64748b');
            t((item.farmerName||'Local Farmer').slice(0,20), c.f, y+4, {width:w.f});
            doc.fillColor('#1e293b');
            t(`${item.qty||1} ${item.unit||'kg'}`, c.q, y+4, {width:w.q, align:'center'});
            t((item.pricePerUnit||0).toFixed(2), c.r, y+4, {width:w.r, align:'right'});
            doc.font('Helvetica-Bold');
            t(amt.toFixed(2), c.a, y+4, {width:w.a, align:'right'});
            y += 17;
        });

        doc.moveTo(M, y+1).lineTo(RX, y+1).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
        y += 10;

        // ════════════════════════════════════════
        // TOTALS — clean right-aligned box
        // ════════════════════════════════════════
        const boxW = 200;
        const boxX = RX - boxW;

        // Subtotal
        doc.fontSize(8).font('Helvetica').fillColor('#64748b');
        t('Subtotal', boxX, y, { width: 110, align: 'right' });
        doc.font('Helvetica-Bold').fillColor('#1e293b');
        t(`₹ ${subtotal.toFixed(2)}`, boxX + 115, y, { width: 80, align: 'right' });
        y += 14;

        // CGST
        doc.font('Helvetica').fillColor('#64748b');
        t('CGST (2.5%)', boxX, y, { width: 110, align: 'right' });
        doc.fillColor('#1e293b');
        t(`₹ ${cgst.toFixed(2)}`, boxX + 115, y, { width: 80, align: 'right' });
        y += 14;

        // SGST
        doc.font('Helvetica').fillColor('#64748b');
        t('SGST (2.5%)', boxX, y, { width: 110, align: 'right' });
        doc.fillColor('#1e293b');
        t(`₹ ${sgst.toFixed(2)}`, boxX + 115, y, { width: 80, align: 'right' });
        y += 6;

        // Green separator line
        doc.moveTo(boxX, y).lineTo(RX, y).strokeColor('#16a34a').lineWidth(1.5).stroke();
        y += 10;

        // Grand Total — bigger, cleaner box
        const gtBoxH = 28;
        doc.rect(boxX - 4, y - 4, boxW + 8, gtBoxH).fill('#ecfdf5');
        doc.rect(boxX - 4, y - 4, boxW + 8, gtBoxH)
           .strokeColor('#16a34a').lineWidth(1).stroke();
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#16a34a');
        t('Grand Total', boxX + 2, y + 5, { width: 105, align: 'right' });
        t(`₹ ${grandTotal.toFixed(2)}`, boxX + 115, y + 5, { width: 80, align: 'right' });
        y += gtBoxH + 14;

        // ════════════════════════════════════════
        // QR CODE + TERMS
        // ════════════════════════════════════════
        doc.moveTo(M, y).lineTo(RX, y).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
        y += 8;

        // QR on left
        doc.image(qrBuf, M, y, { width: 80, height: 80 });
        doc.fontSize(6.5).font('Helvetica').fillColor('#94a3b8');
        t('Scan for order details', M - 2, y + 83, { width: 84, align: 'center' });

        // Terms on right
        const tx = M + 100;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#64748b');
        t('Terms & Conditions:', tx, y);
        doc.fontSize(7).font('Helvetica').fillColor('#94a3b8');
        t('1. All produce is farm-fresh and subject to natural variation.', tx, y + 13);
        t('2. Returns accepted within 24 hours for quality issues only.', tx, y + 24);
        t('3. Computer-generated invoice — no signature required.', tx, y + 35);
        t('4. Support: support@mandiconnect.in | +91 11-2345-6789', tx, y + 46);

        // ════════════════════════════════════════
        // FOOTER
        // ════════════════════════════════════════
        const fy = 810;
        doc.moveTo(M, fy - 6).lineTo(RX, fy - 6).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
        doc.fontSize(6.5).font('Helvetica').fillColor('#94a3b8');
        t('MandiConnect Pvt. Ltd. | CIN: U74999DL2026PTC123456 | GSTIN: 07AABCU9603R1ZM', M, fy, { width: CW, align: 'center' });
        t('Thank you for choosing MandiConnect — Empowering Roots.', M, fy + 9, { width: CW, align: 'center' });

        // No extra page deletion needed — addPage is blocked

        doc.end();
        console.log(`📄 Invoice ${invoiceNumber} — ${cart.length} items, ₹${grandTotal.toFixed(2)} via ${payLabel}`);
    } catch (err) {
        console.error("Invoice error:", err);
        if (!res.headersSent) res.status(500).json({ success: false, message: "Failed" });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        database: "MongoDB Atlas connected",
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 MANDICONNECT SERVER STARTED");
    console.log("=".repeat(60));
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    console.log(`👤 Auth API: http://localhost:${PORT}/api/signup & /api/signin`);
    console.log(`🖼️  Image uploads: http://localhost:${PORT}/uploads`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💾 Database: MongoDB Atlas (mandiconnect)`);
    console.log("=".repeat(60) + "\n");
});