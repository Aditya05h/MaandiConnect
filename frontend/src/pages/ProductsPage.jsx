import React, { useState } from 'react';
import './products.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES_DATA = [
    {
        id: "cropCare",
        items: [
            { id: "fertilizers", image: "https://fl-i.thgim.com/public/incoming/5o3uzt/article68914150.ece/alternates/FREE_1200/Haryana%20farmer%20", price: "₹2,500/bag" },
            { id: "pesticides", image: "https://bestbeebrothers.com/cdn/shop/articles/bbb-pesticides.jpg?v=1524752687&width=2048", price: "₹850/L" },
            { id: "herbicides", image: "https://static.scientificamerican.com/sciam/cache/file/F6C02647-4B66-41FD-978DF41814785D05_source.jpg?w=600", price: "₹920/L" },
            { id: "fungicides", image: "https://tiimg.tistatic.com/fp/1/009/346/organic-fungicides-387.jpg", price: "₹740/L" }
        ]
    },
    {
        id: "seeds",
        items: [
            { id: "vegSeeds", image: "https://media.istockphoto.com/id/1372196138/photo/assorted-legumes-in-burlap-sacks-in-a-row-as-a-full-frame-background.jpg?s=612x612&w=0&k=20&c=QtR58CXs8vkEZuGj8h-xWEzDGy4cbw36R1wkRfxYQwE=", price: "₹150/pkt" },
            { id: "fruitSaplings", image: "https://media.istockphoto.com/id/1323138296/photo/strawberries-on-morning-sun-in-flowerpots-on-balcony-with-view-into-the-city-and-blue-sky.jpg?s=612x612&w=0&k=20&c=jbtzGaERuylP8UfJK_rrvbGmDx7sIMKODfvEwR9G-kQ=", price: "₹350/plant" },
            { id: "grainSeeds", image: "https://media.istockphoto.com/id/671580278/photo/varieties-of-grains-seeds-and-raw-quino.jpg?s=612x612&w=0&k=20&c=ATTVKd0ls6JoL4AvGZ-K6bs_q8rlkJDEyzOLu0d2vrA=", price: "₹4,200/quintal" },
            { id: "flowerSeeds", image: "https://media.istockphoto.com/id/1001676196/photo/flax-seeds-with-flower-isolated-on-white-background-flaxseed-or-linseed-cereals.jpg?s=612x612&w=0&k=20&c=o1DhnN4DF_G-HWLNdXaGsVd7B1EC7U3ZSLCvZPyVK5k=", price: "₹200/pkt" }
        ]
    },
    {
        id: "machinery",
        items: [
            { id: "tractors", image: "https://www.deere.co.in/assets/images/region-1/products/tractors/john-deere-e-series-cab.jpg", price: "Starting ₹6.5 Lakh" },
            { id: "ploughs", image: "https://www.patelagroindustries.com/public/images/blog/jt8wc33oxWhkXesZZkoblUlxItMlZmlnGKhQMe5b.webp", price: "₹45,000" },
            { id: "cultivators", image: "https://www.rataequipment.com/hubfs/Cultivation/812/812%20FT%20MaxitTill%20Working.jpg", price: "₹60,000" },
            { id: "harvesters", image: "https://www.deere.africa/assets/images/region-4/products/harvesting/tseries-combine-r2C001197-1024x576.jpg", price: "Starting ₹25 Lakh" }
        ]
    },
    {
        id: "irrigation",
        items: [
            { id: "pipes", image: "https://hesupipe.com/wp-content/uploads/2025/09/irrigation-pipes.jpg", price: "₹1,200/bundle" },
            { id: "drip", image: "https://www.aquahubkenya.co.ke/wp-content/uploads/2022/11/IMG_1290-scaled-e1708613513560.jpg", price: "₹15,000/acre" },
            { id: "sprinklers", image: "https://simmonslandscape.com/wp-content/uploads/2024/01/Automatic-Garden-Sprinkler.webp", price: "₹800/unit" },
            { id: "pumps", image: "https://tomahawk-power.com/cdn/shop/articles/wide_angle.jpg?v=1623716961", price: "₹12,500" }
        ]
    },
    {
        id: "storage",
        items: [
            { id: "bags", image: "https://i0.wp.com/sesitechnologies.com/wp-content/uploads/2020/08/zerofly4.jpg?fit=1280%2C640&ssl=1", price: "₹30/bag" },
            { id: "silos", image: "https://images.unsplash.com/photo-1556114846-f753bec8a9f5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhaW4lMjBzaWxvfGVufDB8fDB8fHww", price: "Contact for pricing" },
            { id: "nets", image: "https://sunsafenets.com/wp-content/uploads/2021/08/agro-shade-net-1588923291-5417547.jpeg", price: "₹45/sq.m" },
            { id: "crates", image: "https://media.istockphoto.com/id/1300328713/photo/apples-and-pears-in-crates-ready-for-shipping-cold-storage-interior.jpg?s=612x612&w=0&k=20&c=vArSK14fNjnS6CstNS01-KNGgd6cRnkSWHdi7lKxSx8=", price: "₹350/crate" }
        ]
    },
    {
        id: "livestock",
        items: [
            { id: "feed", image: "https://prodigyfoods.in/wp-content/uploads/2024/09/Top-10-Benefits-of-Balanced-Nutrition-in-Cattle-Feed.jpeg2_.jpg", price: "₹1,200/50kg" },
            { id: "dairy", image: "https://kimd.org/wp-content/uploads/2025/02/milk-eqp.jpg", price: "₹8,500" },
            { id: "milking", image: "https://media.istockphoto.com/id/1403648448/photo/milking-a-cow-with-milking-machine.jpg?s=612x612&w=0&k=20&c=QB6deZFx1ErhDrX00GO_IotdT0Wu7gAz4aIc5EN0tkg=", price: "₹45,000" },
            { id: "health", image: "https://media.istockphoto.com/id/1076104412/photo/automatic-garden-lawn-sprinkler.jpg?s=612x612&w=0&k=20&c=YaHSzB9Reg4oCGxkLsG8uVG6Utt5RISU5hZqk6Zuito=", price: "Various Options" }
        ]
    }
];

export default function ProductsPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const translatedCategories = t('products.categoriesArr');

    // Merge translated text with original image data
    const finalCategories = translatedCategories ? translatedCategories.map((cat, i) => ({
        ...cat,
        items: cat.items.map((item, j) => ({
            ...item,
            image: CATEGORIES_DATA[i]?.items[j]?.image || "",
            price: CATEGORIES_DATA[i]?.items[j]?.price || "Contact for pricing"
        }))
    })) : [];

    const closeModal = () => setSelectedProduct(null);

    return (
        <div className="products-page">
            <nav className="products-nav">
                <button className="back-btn" onClick={() => window.history.back()}>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>{t('common.back')}</span>
                </button>
                <div className="nav-title"></div>

            </nav>

            <header className="products-header">
                <h1>{t('products.growBetter')}</h1>
                <p>{t('products.growDesc')}</p>
            </header>

            <main className="products-container">
                {finalCategories.map((category, idx) => (
                    <section key={idx} className="product-category">
                        <h2>{category.title}</h2>
                        <div className="product-grid">
                            {category.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="product-card">
                                    <div className="product-icon-wrap">
                                        <img src={item.image} alt={item.name} className="product-image" />
                                    </div>
                                    <h3>{item.name}</h3>
                                    <button
                                        className="view-btn"
                                        onClick={() => setSelectedProduct({ ...item, category: category.title })}
                                    >
                                        {t('products.viewDetails')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Modal Overlay for View Details */}
            {selectedProduct && (
                <div className="product-modal-overlay" onClick={closeModal}>
                    <div className="product-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                        <div className="modal-image-wrap">
                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                        </div>
                        <div className="modal-info">
                            <h4 className="modal-category">{selectedProduct.category}</h4>
                            <h2 className="modal-title">{selectedProduct.name}</h2>
                            <p className="modal-price">{selectedProduct.price}</p>
                            <div className="modal-desc">
                                <p>This high-quality agricultural product is sourced directly for our farmers to ensure the best yield and longevity. Contact support or your nearest retailer to place a bulk order.</p>
                            </div>
                            <button className="modal-action-btn" onClick={closeModal}>Got it!</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="products-footer">
                <p>{t('products.footer')}</p>
            </footer>
        </div>
    );
}