import "./landing.css";
import { useNavigate, } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import ProfileModal from "../components/ProfileModal";

const TRANSLATIONS = {
    en: {
        features: "Features",
        products: "Our Products",
        howItWorks: "How it Works",
        about: "About",
        language: "Language",
        getStarted: "Get Started",
        heroBadge: "Empowering Farmers",
        heroTitle: "Direct Farm <span>to Retail</span> Marketplace",
        heroDesc: "Connect farmers directly with retailers. Sell harvests faster, eliminate middlemen, and grow profits with an easy-to-use platform.",
        startSelling: "Start Selling Now",
        exploreFeatures: "Explore Features",
        whyChoose: "Why Choose MandiConnect?",
        whyDesc: "Designed specifically to make trading simple and profitable.",
        offlineFirst: "Offline First",
        offlineDesc: "List your harvest even without internet. We will automatically sync when you're back online.",
        directOrders: "Direct Orders",
        directDesc: "Retailers place bulk orders directly from farmers, cutting out the unpredictable middlemen.",
        fastPayments: "Fast Payments",
        fastDesc: "Get paid quickly and securely directly to your bank account via UPI integration.",
        hiwTitle: "How It Works",
        hiwDesc: "From farm to table in four simple steps — no middlemen, no confusion.",
        readyGrow: "Ready to grow your profits?",
        joinThousands: "Join thousands of farmers tracking better prices and wider reach.",
        joinToday: "Join MandiConnect Today",
        aboutTitle: "About MandiConnect",
        aboutDesc: "A complete digital ecosystem built for Indian agriculture — connecting farmers, buyers, and fresh produce.",
        ourMission: "Our Mission",
        missionDesc: "To eliminate middlemen from India's agricultural supply chain and empower every farmer with direct access to retail buyers — enabling fair pricing, faster sales, and transparent trade through technology.",
        freshMarket: "Fresh Marketplace",
        freshMarketDesc: "A live marketplace where buyers browse farm-fresh produce — vegetables, fruits, grains, dairy, and spices — listed directly by farmers.",
        farmerDash: "Farmer Dashboard",
        farmerDashDesc: "Farmers get a dedicated dashboard to list harvests with photos, prices, and dates. Track listings, view stats, and manage products effortlessly.",
        smartCart: "Smart Cart & Checkout",
        smartCartDesc: "Buyers can add multiple products to a cart, adjust quantities, review orders, and seamlessly proceed to checkout — all from one page.",
        securePay: "Secure Payments",
        securePayDesc: "Three payment options — UPI, Net Banking, and Cash on Delivery — with animated processing feedback and instant order confirmation.",
        prodCatalog: "Product Catalog",
        prodCatalogDesc: "A curated catalog covering crop care, heavy machinery, irrigation systems, storage solutions, and livestock tools — everything a farmer needs.",
        realTime: "Real-Time Updates",
        realTimeDesc: "New products listed by farmers appear instantly on the marketplace — powered by real-time sync so buyers always see the freshest listings.",
        builtWith: "Built with",
        footerTag: "© 2026 MandiConnect. Empowering roots.",
        hiwSteps: [
            {
                title: "Create Your Account",
                desc: "Sign up as a Farmer or Buyer using your phone number or Google account. Farmers provide KYC details; buyers can start browsing right away.",
            },
            {
                title: "List Your Produce",
                desc: "Add your harvest — product name, price per kg, harvest date, and a photo. Your listing goes live on the marketplace for all buyers to see.",
            },
            {
                title: "Browse & Add to Cart",
                desc: "Search products, filter by category, and add items to your cart. Adjust quantities, review your order, and proceed to checkout seamlessly.",
            },
            {
                title: "Pay & Receive",
                desc: "Choose UPI, Net Banking, or Cash on Delivery. Complete the order, get instant confirmation, and receive farm-fresh produce directly.",
            },
        ]
    },
    hi: {
        features: "विशेषताएं",
        products: "हमारे उत्पाद",
        howItWorks: "यह कैसे काम करता है",
        about: "हमारे बारे में",
        language: "भाषा",
        getStarted: "शुरू करें",
        heroBadge: "किसानों को सशक्त बनाना",
        heroTitle: "सीधे खेत <span>से खुदरा</span> बाजार",
        heroDesc: "किसानों को सीधे खुदरा विक्रेताओं से जोड़ें। फसल तेजी से बेचें, बिचौलियों को खत्म करें और उपयोग में आसान प्लेटफॉर्म के साथ लाभ बढ़ाएं।",
        startSelling: "अभी बेचना शुरू करें",
        exploreFeatures: "विशेषताओं को जानें",
        whyChoose: "MandiConnect क्यों चुनें?",
        whyDesc: "व्यापार को सरल और लाभदायक बनाने के लिए विशेष रूप से डिज़ाइन किया गया है।",
        offlineFirst: "ऑफ़लाइन पहले",
        offlineDesc: "इंटरनेट के बिना भी अपनी फसल सूचीबद्ध करें। जब आप वापस ऑनलाइन होंगे तो हम अपने आप सिंक हो जाएंगे।",
        directOrders: "सीधे ऑर्डर",
        directDesc: "खुदरा विक्रेता सीधे किसानों से थोक ऑर्डर देते हैं, जिससे अनिश्चित बिचौलिये खत्म हो जाते हैं।",
        fastPayments: "तेजी से भुगतान",
        fastDesc: "UPI एकीकरण के माध्यम से सीधे अपने बैंक खाते में जल्दी और सुरक्षित रूप से भुगतान प्राप्त करें।",
        hiwTitle: "यह कैसे काम करता है",
        hiwDesc: "खेत से मेज तक चार सरल चरणों में — कोई बिचौलिया नहीं, कोई भ्रम नहीं।",
        readyGrow: "अपना लाभ बढ़ाने के लिए तैयार हैं?",
        joinThousands: "बेहतर कीमतों और व्यापक पहुंच की तलाश में हजारों किसानों के साथ जुड़ें।",
        joinToday: "आज ही MandiConnect से जुड़ें",
        aboutTitle: "MandiConnect के बारे में",
        aboutDesc: "भारतीय कृषि के लिए निर्मित एक संपूर्ण डिजिटल पारिस्थितिकी तंत्र — किसानों, खरीदारों और ताज़ा उपज को जोड़ता है।",
        ourMission: "हमारा लक्ष्य",
        missionDesc: "भारत की कृषि आपूर्ति श्रृंखला से बिचौलियों को खत्म करना और हर किसान को खुदरा खरीदारों तक सीधी पहुंच के साथ सशक्त बनाना — तकनीक के माध्यम से उचित मूल्य निर्धारण, त्वरित बिक्री और पारदर्शी व्यापार सुनिश्चित करना।",
        freshMarket: "ताज़ा बाज़ार",
        freshMarketDesc: "एक जीवंत बाज़ार जहाँ खरीदार किसानों द्वारा सीधे सूचीबद्ध ताज़ा कृषि उपज — सब्जियां, फल, अनाज, डेयरी और मसाले खोजते हैं।",
        farmerDash: "किसान डैशबोर्ड",
        farmerDashDesc: "किसानों को फोटो, कीमत और तारीख के साथ फसल सूचीबद्ध करने के लिए एक समर्पित डैशबोर्ड मिलता है। लिस्टिंग ट्रैक करें, आंकड़े देखें और उत्पादों को आसानी से प्रबंधित करें।",
        smartCart: "स्मार्ट कार्ट और चेकआउट",
        smartCartDesc: "खरीदार एक कार्ट में कई उत्पाद जोड़ सकते हैं, मात्रा समायोजित कर सकते हैं, ऑर्डर की समीक्षा कर सकते हैं और एक ही पेज से चेकआउट कर सकते हैं।",
        securePay: "सुरक्षित भुगतान",
        securePayDesc: "तीन भुगतान विकल्प — UPI, नेट बैंकिंग और कैश ऑन डिलीवरी — एनिमेटेड फीडबैक और तत्काल ऑर्डर पुष्टिकरण के साथ।",
        prodCatalog: "उत्पाद सूची",
        prodCatalogDesc: "फसल देखभाल, भारी मशीनरी, सिंचाई प्रणाली, भंडारण समाधान और पशुधन उपकरणों को कवर करने वाली एक क्यूरेटेड सूची — एक किसान की हर जरूरत।",
        realTime: "रियल-टाइम अपडेट",
        realTimeDesc: "किसानों द्वारा सूचीबद्ध नए उत्पाद बाज़ार में तुरंत दिखाई देते हैं — रियल-टाइम सिंक द्वारा संचालित ताकि खरीदार हमेशा ताज़ा लिस्टिंग देखें।",
        builtWith: "इनके साथ निर्मित",
        footerTag: "© 2026 MandiConnect. जड़ों को सशक्त बनाना।",
        hiwSteps: [
            {
                title: "अपना खाता बनाएं",
                desc: "अपने फोन नंबर या गूगल खाते का उपयोग करके किसान या खरीदार के रूप में साइन अप करें। किसान केवाईसी विवरण प्रदान करते हैं; खरीदार तुरंत ब्राउज़ करना शुरू कर सकते हैं।",
            },
            {
                title: "अपनी उपज सूचीबद्ध करें",
                desc: "अपनी फसल जोड़ें — उत्पाद का नाम, प्रति किलो कीमत, कटाई की तारीख और एक फोटो। आपकी लिस्टिंग खरीदारों के देखने के लिए तुरंत बाज़ार में लाइव हो जाती है।",
            },
            {
                title: "ब्राउज़ करें और कार्ट में जोड़ें",
                desc: "उत्पाद खोजें, श्रेणी के अनुसार फ़िल्टर करें और अपने कार्ट में आइटम जोड़ें। मात्रा समायोजित करें, अपने ऑर्डर की समीक्षा करें और आसानी से चेकआउट करें।",
            },
            {
                title: "भुगतान करें और प्राप्त करें",
                desc: "अपनी भुगतान विधि चुनें — UPI, नेट बैंकिंग, या कैश ऑन डिलीवरी। ऑर्डर पूरा करें, तत्काल पुष्टिकरण प्राप्त करें और ताज़ा उपज सीधे प्राप्त करें।",
            }
        ]
    },
    kn: {
        features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
        products: "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು",
        howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        about: "ನಮ್ಮ ಬಗ್ಗೆ",
        language: "ಭಾಷೆ",
        getStarted: "ಪ್ರಾರಂಭಿಸಿ",
        heroBadge: "ರೈತರ ಸಬಲೀಕರಣ",
        heroTitle: "ನೇರ ಫಾರ್ಮ್ <span>ಟು ರಿಟೇಲ್</span> ಮಾರುಕಟ್ಟೆ",
        heroDesc: "ರೈತರನ್ನು ನೇರವಾಗಿ ರಿಟೇಲರ್ ಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ. ಸುಲಭವಾಗಿ ಬಳಸಬಹುದಾದ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನೊಂದಿಗೆ ಬೆಳೆಗಳನ್ನು ವೇಗವಾಗಿ ಮಾರಾಟ ಮಾಡಿ, ಮಧ್ಯವರ್ತಿಗಳನ್ನು ದೂರಮಾಡಿ ಮತ್ತು ಲಾಭವನ್ನು ಹೆಚ್ಚಿಸಿ.",
        startSelling: "ಈಗಲೇ ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ",
        exploreFeatures: "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
        whyChoose: "MandiConnect ಅನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?",
        whyDesc: "ವ್ಯಾಪಾರವನ್ನು ಸರಳ ಮತ್ತು ಲಾಭದಾಯಕವಾಗಿಸಲು ವಿಶೇಷವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
        offlineFirst: "ಆಫ್‌ಲೈನ್ ಮೊದಲು",
        offlineDesc: "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದರೂ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿ. ನೀವು ಮತ್ತೆ ಆನ್‌ಲೈನ್‌ಗೆ ಬಂದಾಗ ನಾವು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿಂಕ್ ಮಾಡುತ್ತೇವೆ.",
        directOrders: "ನೇರ ಆದೇಶಗಳು",
        directDesc: "ರಿಟೇಲರ್ ಗಳು ರೈತರಿಂದ ನೇರವಾಗಿ ಸಗಟು ಆದೇಶಗಳನ್ನು ನೀಡುತ್ತಾರೆ, ಇದರಿಂದ ಮಧ್ಯವರ್ತಿಗಳ ತಲೆನೋವು ಇರುವುದಿಲ್ಲ.",
        fastPayments: "ವೇಗದ ಪಾವತಿಗಳು",
        fastDesc: "UPI ಏಕೀಕರಣದ ಮೂಲಕ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ತ್ವರಿತವಾಗಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಯನ್ನು ಪಡೆಯಿರಿ.",
        hiwTitle: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        hiwDesc: "ಫಾರ್ಮ್‌ನಿಂದ ಟೇಬಲ್‌ವರೆಗೆ ನಾಲ್ಕು ಸರಳ ಹಂತಗಳಲ್ಲಿ — ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ, ಯಾವುದೇ ಗೊಂದಲವಿಲ್ಲ.",
        readyGrow: "ನಿಮ್ಮ ಲಾಭವನ್ನು ಹೆಚ್ಚಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
        joinThousands: "ಉತ್ತಮ ಬೆಲೆ ಮತ್ತು ಹೆಚ್ಚಿನ ವ್ಯಾಪ್ತಿಯನ್ನು ಬಯಸುವ ಸಾವಿರಾರು ರೈತರೊಂದಿಗೆ ಸೇರಿ.",
        joinToday: "ಇಂದೇ MandiConnect ಗೆ ಸೇರಿ",
        aboutTitle: "MandiConnect ಬಗ್ಗೆ",
        aboutDesc: "ಭಾರತೀಯ ಕೃಷಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ಪರಿಸರ ವ್ಯವಸ್ಥೆ — ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
        ourMission: "ನಮ್ಮ ಮಿಷನ್",
        missionDesc: "ಭಾರತದ ಕೃಷಿ ಪೂರೈಕೆ ಸರಪಳಿಯಿಂದ ಮಧ್ಯವರ್ತಿಗಳನ್ನು ತೊಡೆದುಹಾಕುವುದು ಮತ್ತು ಪ್ರತಿ ರೈತನಿಗೆ ನೇರ ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶವನ್ನು ನೀಡುವ ಮೂಲಕ ಸಬಲೀಕರಣಗೊಳಿಸುವುದು — ಸಮಂಜಸ ಬೆಲೆ ಮತ್ತು ಪಾರದರ್ಶಕ ವ್ಯಾಪಾರವನ್ನು ಸಾಧ್ಯವಾಗಿಸುವುದು.",
        freshMarket: "ತಾಜಾ ಮಾರುಕಟ್ಟೆ",
        freshMarketDesc: "ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು — ತರಕಾರಿಗಳು, ಹಣ್ಣುಗಳು, ಧಾನ್ಯಗಳು, ಡೈರಿ ಮತ್ತು ಮಸಾಲೆಗಳನ್ನು — ರೈತರು ನೇರವಾಗಿ ಪಟ್ಟಿ ಮಾಡುವ ಲೈವ್ ಮಾರುಕಟ್ಟೆ.",
        farmerDash: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        farmerDashDesc: "ರೈತರು ತಮ್ಮ ಬೆಳೆಗಳನ್ನು ಫೋಟೋ, ಬೆಲೆ ಮತ್ತು ದಿನಾಂಕದೊಂದಿಗೆ ಪಟ್ಟಿ ಮಾಡಲು ಮೀಸಲಾದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪಡೆಯುತ್ತಾರೆ. ಮಾರಾಟವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಿ.",
        smartCart: "ಸ್ಮಾರ್ಟ್ ಕಾರ್ಟ್ ಮತ್ತು ಚೆಕ್ಔಟ್",
        smartCartDesc: "ಖರೀದಿದಾರರು ಒಂದು ಕಾರ್ಟ್‌ಗೆ ಹಲವಾರು ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಬಹುದು, ಪ್ರಮಾಣವನ್ನು ಸರಿಹೊಂದಿಸಬಹುದು ಮತ್ತು ಒಂದೇ ಪುಟದಿಂದ ಚೆಕ್ಔಟ್ ಮಾಡಬಹುದು.",
        securePay: "ಸುರಕ್ಷಿತ ಪಾವತಿಗಳು",
        securePayDesc: "ಮೂರು ಪಾವತಿ ಆಯ್ಕೆಗಳು — UPI, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ — ಅನಿಮೇಟೆಡ್ ಫೀಡ್‌ಬ್ಯಾಕ್ ಮತ್ತು ತ್ವರಿತ ಆದೇಶ ದೃಢೀಕರಣದೊಂದಿಗೆ.",
        prodCatalog: "ಉತ್ಪನ್ನಗಳ ಪಟ್ಟಿ",
        prodCatalogDesc: "ಬೆಳೆ ಆರೈಕೆ, ಯಂತ್ರೋಪಕರಣಗಳು, ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳು ಮತ್ತು ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಒಳಗೊಂಡಿರುವ ಕ್ಯುರೇಟೆಡ್ ಕ್ಯಾಟಲಾಗ್ — ಒಬ್ಬ ರೈತನಿಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ ಇಲ್ಲಿದೆ.",
        realTime: "ನೈಜ-ಸಮಯದ ನವೀಕರಣಗಳು",
        realTimeDesc: "ರೈತರು ಪಟ್ಟಿ ಮಾಡುವ ಹೊಸ ಉತ್ಪನ್ನಗಳು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ತಕ್ಷಣವೇ ಗೋಚರಿಸುತ್ತವೆ — ಖರೀದಿದಾರರು ಯಾವಾಗಲೂ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಲು ಇದು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        builtWith: "ಇದರಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ",
        footerTag: "© 2026 MandiConnect. ಬೇರುಗಳಿಗೆ ಶಕ್ತಿ.",
        hiwSteps: [
            {
                title: "ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
                desc: "ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಗೂಗಲ್ ಖಾತೆಯನ್ನು ಬಳಸಿ ರೈತ ಅಥವಾ ಖರೀದಿದಾರರಾಗಿ ಸೈನ್ ಅಪ್ ಮಾಡಿ. ರೈತರು ಕೆವೈಸಿ ವಿವರಗಳನ್ನು ನೀಡುತ್ತಾರೆ; ಖರೀದಿದಾರರು ತಕ್ಷಣವೇ ಹುಡುಕಾಟ ಆರಂಭಿಸಬಹುದು.",
            },
            {
                title: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಪಟ್ಟಿ ಮಾಡಿ",
                desc: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಸೇರಿಸಿ — ಉತ್ಪನ್ನದ ಹೆಸರು, ಬೆಲೆ, ಫೋಟೋ. ನಿಮ್ಮ ಪಟ್ಟಿ ತಕ್ಷಣವೇ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲೈವ್ ಆಗುತ್ತದೆ.",
            },
            {
                title: "ಹುಡುಕಿ ಮತ್ತು ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
                desc: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ, ವರ್ಗಗಳ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ ಮತ್ತು ಅವುಗಳನ್ನು ನಿಮ್ಮ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ. ಪ್ರಮಾಣವನ್ನು ಸರಿಹೊಂದಿಸಿ ಮತ್ತು ಚೆಕ್ಔಟ್ ಮಾಡಿ.",
            },
            {
                title: "ಪಾವತಿಸಿ ಮತ್ತು ಪಡೆಯಿರಿ",
                desc: "ನಿಮ್ಮ ಪಾವತಿ ವಿಧಾನವನ್ನು ಆರಿಸಿ — UPI, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ. ಆದೇಶವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಪಡೆಯಿರಿ.",
            }
        ]
    },
    mr: {
        features: "वैशिष्ट्ये",
        products: "आमची उत्पादने",
        howItWorks: "हे कसे कार्य करते",
        about: "आमच्याबद्दल",
        language: "भाषा",
        getStarted: "सुरू करा",
        heroBadge: "शेतकऱ्यांना सक्षम करणे",
        heroTitle: "थेट शेतातून <span>विक्रेत्याकडे</span> बाजारपेठ",
        heroDesc: "शेतकऱ्यांना थेट किरकोळ विक्रेत्यांशी जोडा. पीक जलद विका, मध्यस्थांना दूर करा आणि सुलभ प्लॅटफॉर्मसह नफा वाढवा.",
        startSelling: "आत्ताच विक्री सुरू करा",
        exploreFeatures: "वैशिष्ट्ये एक्सप्लोर करा",
        whyChoose: "MandiConnect का निवडावे?",
        whyDesc: "व्यापार सोपा आणि फायदेशीर करण्यासाठी खास डिझाइन केलेले.",
        offlineFirst: "ऑफलाइन पहिले",
        offlineDesc: "इंटरनेटशिवायही तुमची कापणी सूचीबद्ध करा. तुम्ही पुन्हा ऑनलाइन आल्यावर आम्ही स्वयंचलितपणे सिंक करू.",
        directOrders: "थेट ऑर्डर",
        directDesc: "किरकोळ विक्रेते थेट शेतकऱ्यांकडून घाऊक ऑर्डर देतात, ज्यामुळे अनिश्चित मध्यस्थ नाहीसे होतात.",
        fastPayments: "वेगवान पेमेंट",
        fastDesc: "UPI एकत्रीकरणाद्वारे थेट तुमच्या बँक खात्यात जलद आणि सुरक्षितपणे पेमेंट मिळवा.",
        hiwTitle: "हे कसे कार्य करते",
        hiwDesc: "शेतातून ताटापर्यंत चार सोप्या चरणांमध्ये — कोणताही मध्यस्थ नाही, कोणताही गोंधळ नाही.",
        readyGrow: "तुमचा नफा वाढवण्यासाठी तयार आहात का?",
        joinThousands: "उत्तम दर आणि व्यापक पोहोच शोधणाऱ्या हजारो शेतकऱ्यांशी जोडा.",
        joinToday: "आजच MandiConnect मध्ये सामील व्हा",
        aboutTitle: "MandiConnect बद्दल",
        aboutDesc: "भारतीय शेतीसाठी तयार केलेली संपूर्ण डिजिटल इकोसिस्टम — शेतकरी, खरेदीदार आणि ताजी उत्पादने जोडते.",
        ourMission: "आमचे ध्येय",
        missionDesc: "भारताच्या कृषी पुरवठा साखळीतून मध्यस्थांना काढून टाकणे आणि प्रत्येक शेतकऱ्याला किरकोळ खरेदीदारांपर्यंत थेट प्रवेश देऊन सक्षम करणे — तंत्रज्ञानाद्वारे वाजवी किंमत आणि पारदर्शक व्यापार सुनिश्चित करणे.",
        freshMarket: "ताजी बाजारपेठ",
        freshMarketDesc: "एक थेट बाजारपेठ जिथे खरेदीदार शेतकऱ्यांनी थेट सूचीबद्ध केलेली ताजी उत्पादने — भाज्या, फळे, धान्य, दुग्धजन्य पदार्थ आणि मसाले पाहतात.",
        farmerDash: "शेतकरी डॅशबोर्ड",
        farmerDashDesc: "शेतकऱ्यांना फोटो, किंमत आणि तारखेसह पीक सूचीबद्ध करण्यासाठी एक समर्पित डॅशबोर्ड मिळतो. लिस्टिंग ट्रॅक करा आणि उत्पादने सहज व्यवस्थापित करा.",
        smartCart: "स्मार्ट कार्ट आणि चेकआउट",
        smartCartDesc: "खरेदीदार एका कार्टमध्ये अनेक उत्पादने जोडू शकतात, प्रमाण बदलू शकतात आणि एकाच पेजवरून चेकआउट करू शकतात.",
        securePay: "सुरक्षित पेमेंट",
        securePayDesc: "तीन पेमेंट पर्याय — UPI, नेट बँकिंग आणि कॅश ऑन डिलिव्हरी — तत्काळ ऑर्डर पुष्टीकरणासह.",
        prodCatalog: "उत्पादन कॅटलॉग",
        prodCatalogDesc: "पीक काळजी, अवजड मशिनरी, सिंचन प्रणाली आणि कृषी उपकरणांचा समावेश असलेला क्युरेटेड कॅटलॉग — शेतकऱ्याची प्रत्येक गरज.",
        realTime: "रिअल-टाइम अपडेट्स",
        realTimeDesc: "शेतकऱ्यांनी सूचीबद्ध केलेली नवीन उत्पादने बाजारपेठेत त्वरित दिसतात — खरेदीदारांना नेहमी ताजी लिस्टिंग दिसण्यास मदत होते.",
        builtWith: "यांनी बनलेले",
        footerTag: "© 2026 MandiConnect. मुळांना सक्षम करणे।",
        hiwSteps: [
            {
                title: "तुमचे खाते तयार करा",
                desc: "तुमचा फोन नंबर किंवा Google खाते वापरून शेतकरी किंवा खरेदीदार म्हणून साइन अप करा. शेतकरी केवायसी तपशील देतात; खरेदीदार लगेच शोधू शकतात.",
            },
            {
                title: "तुमचे उत्पादन सूचीबद्ध करा",
                desc: "तुमची कापणी जोडा — उत्पादनाचे नाव, किंमत, फोटो. तुमची लिस्टिंग त्वरित बाजारपेठेत लाईव्ह होते.",
            },
            {
                title: "ब्राउझ करा आणि कार्टमध्ये जोडा",
                desc: "उत्पादने शोधा, श्रेणीनुसार फिल्टर करा आणि आपल्या कार्टमध्ये जोडा. प्रमाण बदला आणि चेकआउट करा.",
            },
            {
                title: "पेमेंट करा आणि प्राप्त करा",
                desc: "तुमची पेमेंट पद्धत निवडा — UPI, नेट बँकिंग किंवा कॅश ऑन डिलिव्हरी. ऑर्डर पूर्ण करा आणि ताजी उत्पादने थेट मिळवा.",
            }
        ]
    }
};

const HIW_ICONS = [
    <svg key="1" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>,
    <svg key="2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>,
    <svg key="3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>,
    <svg key="4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
];

const COLORS = ["#16a34a", "#d97706", "#3b82f6", "#8b5cf6"];

export default function LandingPage() {
    const navigate = useNavigate();
    const [lang, setLang] = useState(localStorage.getItem('mandiLang') || 'en');
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');

    const t = (key) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];

    const next = useCallback(() => {
        setActiveStep(prev => (prev + 1) % 4);
    }, []);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(next, 4000);
        return () => clearInterval(id);
    }, [paused, next]);

    const changeLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('mandiLang', newLang);
        setIsLangModalOpen(false);
    };

    const hiwSteps = t('hiwSteps');

    return (
        <div className="landing">
            {/* SIDE DOCKER / SIDEBAR */}
            <nav className="sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                        <span className="logo-text">MandiConnect</span>
                    </div>

                    <div className="sidebar-links">
                        <a href="#features" className="sidebar-link">
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            <span className="link-text">{t('features')}</span>
                        </a>
                        <button onClick={() => navigate("/products")} className="sidebar-link" style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            <span className="link-text">{t('products')}</span>
                        </button>
                        <a href="#how-it-works" className="sidebar-link">
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span className="link-text">{t('howItWorks')}</span>
                        </a>
                        <a href="#about" className="sidebar-link">
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            <span className="link-text">{t('about')}</span>
                        </a>
                        <button onClick={() => setIsLangModalOpen(true)} className="sidebar-link" style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span className="link-text">{t('language')}</span>
                        </button>
                    </div>
                </div>

                <div className="sidebar-bottom">
                    {isLoggedIn ? (
                        <>
                            {userRole === 'Farmer' && (
                                <button className="sidebar-btn" onClick={() => navigate("/farmer-dashboard")} style={{ marginBottom: '10px', background: '#16a34a' }}>
                                    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                    <span className="link-text">Farmer Dashboard</span>
                                </button>
                            )}
                            {userRole === 'Buyer' && (
                                <button className="sidebar-btn" onClick={() => navigate("/buyer-marketplace")} style={{ marginBottom: '10px', background: '#0284c7' }}>
                                    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    <span className="link-text">Buyer Marketplace</span>
                                </button>
                            )}
                            <button className="sidebar-btn" onClick={() => setIsProfileOpen(true)} style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1' }}>
                                <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span className="link-text">My Profile</span>
                            </button>
                        </>
                    ) : (
                        <button className="sidebar-btn pulse-glow-small" onClick={() => navigate("/auth")}>
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                            <span className="link-text">{t('getStarted')}</span>
                        </button>
                    )}
                </div>
            </nav>

            <main className="main-content">
                {/* HERO */}
                <section className="hero">
                    <div className="hero-content">
                        <div className="hero-badge">{t('heroBadge')}</div>
                        <h1 dangerouslySetInnerHTML={{ __html: t('heroTitle') }} />
                        <p>{t('heroDesc')}</p>
                        {!isLoggedIn && (
                            <div className="hero-buttons">
                                <button className="primary-btn pulse-glow" onClick={() => navigate("/auth")}>
                                    {t('startSelling')}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                                <button className="secondary-btn" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                                    {t('exploreFeatures')}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="features-section">
                    <div className="section-head">
                        <h2>{t('whyChoose')}</h2>
                        <p>{t('whyDesc')}</p>
                    </div>

                    <div className="features">
                        <div className="feature-card">
                            <div className="feature-icon bg-green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4M2 2l20 20" /></svg>
                            </div>
                            <h3>{t('offlineFirst')}</h3>
                            <p>{t('offlineDesc')}</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon bg-yellow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            </div>
                            <h3>{t('directOrders')}</h3>
                            <p>{t('directDesc')}</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon bg-blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                            </div>
                            <h3>{t('fastPayments')}</h3>
                            <p>{t('fastDesc')}</p>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS — Animated Stepper */}
                <section id="how-it-works" className="how-it-works-section"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}>
                    <div className="section-head">
                        <h2>{t('hiwTitle')}</h2>
                        <p>{t('hiwDesc')}</p>
                    </div>

                    {/* Stepper Track */}
                    <div className="stepper-track">
                        <div className="stepper-rail">
                            <div className="stepper-progress" style={{ width: `${(activeStep / 3) * 100}%` }} />
                        </div>
                        {hiwSteps.map((s, i) => (
                            <button
                                key={i}
                                className={`stepper-dot ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                                style={{ '--dot-color': COLORS[i] }}
                                onClick={() => setActiveStep(i)}
                                aria-label={`Step ${i + 1}: ${s.title}`}
                            >
                                <span className="stepper-dot-num">{i < activeStep ? '✓' : i + 1}</span>
                                <span className="stepper-dot-label">{s.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Active Step Content */}
                    <div className="stepper-panel" key={activeStep}>
                        <div className="stepper-icon-ring" style={{ '--ring-color': COLORS[activeStep] }}>
                            <div className="stepper-icon-inner" style={{ color: COLORS[activeStep] }}>
                                {HIW_ICONS[activeStep]}
                            </div>
                        </div>
                        <div className="stepper-info">
                            <div className="stepper-step-label" style={{ color: COLORS[activeStep] }}>{t('language') === 'Language' ? 'Step' : 'चरण'} {activeStep + 1} of 4</div>
                            <h3>{hiwSteps[activeStep].title}</h3>
                            <p>{hiwSteps[activeStep].desc}</p>
                        </div>
                    </div>

                    {/* Timer indicator */}
                    <div className="stepper-timer-track">
                        <div className={`stepper-timer-bar ${paused ? 'paused' : ''}`} key={`timer-${activeStep}`} style={{ '--bar-color': COLORS[activeStep] }} />
                    </div>
                </section>

                {/* CTA */}
                {!isLoggedIn && (
                    <section className="cta">
                        <div className="cta-container">
                            <h2>{t('readyGrow')}</h2>
                            <p>{t('joinThousands')}</p>
                            <button className="cta-btn" onClick={() => navigate("/auth")}>
                                {t('joinToday')}
                            </button>
                        </div>
                    </section>
                )}

                {/* ABOUT */}
                <section id="about" className="about-section">
                    <div className="section-head">
                        <h2>{t('aboutTitle')}</h2>
                        <p>{t('aboutDesc')}</p>
                    </div>

                    {/* Mission */}
                    <div className="about-mission">
                        <div className="about-mission-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                <path d="M2 12h20" />
                            </svg>
                        </div>
                        <div>
                            <h3>{t('ourMission')}</h3>
                            <p>{t('missionDesc')}</p>
                        </div>
                    </div>

                    {/* Platform Highlights */}
                    <div className="about-grid">
                        <div className="about-card">
                            <div className="about-card-icon bg-green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <h4>{t('freshMarket')}</h4>
                            <p>{t('freshMarketDesc')}</p>
                        </div>

                        <div className="about-card">
                            <div className="about-card-icon bg-yellow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                                </svg>
                            </div>
                            <h4>{t('farmerDash')}</h4>
                            <p>{t('farmerDashDesc')}</p>
                        </div>

                        <div className="about-card">
                            <div className="about-card-icon bg-blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                            </div>
                            <h4>{t('smartCart')}</h4>
                            <p>{t('smartCartDesc')}</p>
                        </div>

                        <div className="about-card">
                            <div className="about-card-icon bg-purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                            </div>
                            <h4>{t('securePay')}</h4>
                            <p>{t('securePayDesc')}</p>
                        </div>

                        <div className="about-card">
                            <div className="about-card-icon bg-orange">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </div>
                            <h4>{t('prodCatalog')}</h4>
                            <p>{t('prodCatalogDesc')}</p>
                        </div>

                        <div className="about-card">
                            <div className="about-card-icon bg-teal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h4>{t('realTime')}</h4>
                            <p>{t('realTimeDesc')}</p>
                        </div>
                    </div>

                    {/* Tech strip */}
                    <div className="about-tech">
                        <span className="about-tech-label">{t('builtWith')}</span>
                        <div className="about-tech-badges">
                            <span className="tech-badge">React</span>
                            <span className="tech-badge">Node.js</span>
                            <span className="tech-badge">Firebase</span>
                            <span className="tech-badge">MongoDB</span>
                            <span className="tech-badge">Express</span>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span>MandiConnect</span>
                        </div>
                        <div className="footer-links">
                            <a href="#features">{t('features')}</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Support</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>{t('footerTag')}</p>
                        <div className="footer-credits">
                            Built By Team : <span className="team-name">BeyondAI</span>
                            <div className="developers-list">
                                Developers: Rishabh K, Sammed K, Sammed B, Aditya H
                            </div>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Language Selection Modal */}
            {isLangModalOpen && (
                <div className="lang-modal-overlay" onClick={() => setIsLangModalOpen(false)}>
                    <div className="lang-modal" onClick={e => e.stopPropagation()}>
                        <div className="lang-modal-header">
                            <h3>Select Language / भाषा चुनें</h3>
                            <button className="close-btn" onClick={() => setIsLangModalOpen(false)}>×</button>
                        </div>
                        <div className="lang-grid">
                            <button className={`lang-option ${lang === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>
                                <span className="lang-name">English</span>
                                <span className="lang-native">English</span>
                            </button>
                            <button className={`lang-option ${lang === 'hi' ? 'active' : ''}`} onClick={() => changeLanguage('hi')}>
                                <span className="lang-name">Hindi</span>
                                <span className="lang-native">हिंदी</span>
                            </button>
                            <button className={`lang-option ${lang === 'kn' ? 'active' : ''}`} onClick={() => changeLanguage('kn')}>
                                <span className="lang-name">Kannada</span>
                                <span className="lang-native">ಕನ್ನಡ</span>
                            </button>
                            <button className={`lang-option ${lang === 'mr' ? 'active' : ''}`} onClick={() => changeLanguage('mr')}>
                                <span className="lang-name">Marathi</span>
                                <span className="lang-native">मराठी</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}