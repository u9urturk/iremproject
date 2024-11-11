import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const sampleProduct = {
    name: "Özel Tasarım Havlu",
    basePrice: 249.99,
    fullPrice: 399.99,
    rating: 4,
    color: "Lacivert",
    fabric: "Premium Pamuk",
    pattern: "Özel Desen",
    explanation: "Yüksek kaliteli pamuktan üretilen, kişiselleştirilebilir tasarım havlu. İster kendi havlunuz üzerine tasarım yaptırın, isterseniz bizim premium havlularımızı tercih edin.",
    images: [
        "https://picsum.photos/id/1059/600/600",
        "https://picsum.photos/id/237/600/600",
        "https://picsum.photos/id/1060/600/600"
    ]



};

const images = [
    "https://picsum.photos/id/1059/600/600",
    "https://picsum.photos/id/237/600/600",
    "https://picsum.photos/id/1060/600/600"
]

const sampleReviews = Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    userName: `Kullanıcı ${index + 1}`,
    rating: Math.floor(Math.random() * 2) + 4,
    comment: "Ürün kalitesi çok iyi, tasarım tam istediğim gibi oldu. Kesinlikle tavsiye ediyorum!",
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('tr-TR')
}));

export default function ProductDetail({ product }) {
    const [includeProduct, setIncludeProduct] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(8);
    const [loading, setLoading] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(product.fullPrice);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });
    const [isAnimating, setIsAnimating] = useState(false);


    useEffect(() => {
        const targetPrice = includeProduct ? product.fullPrice : product.basePrice;
        setIsAnimating(true);

        const steps = 20; // Animasyon adımları
        const stepDuration = 1000 / steps; // Toplam süre 2000ms
        const priceStep = (targetPrice - currentPrice) / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < steps) {
                setCurrentPrice(prev => prev + priceStep);
                currentStep++;
            } else {
                setCurrentPrice(targetPrice);
                setIsAnimating(false);
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [includeProduct]);

    // Zoom kontrolü için ref
    const imageRef = useRef(null);

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1));
    };

    const handleImageClick = (index) => {
        setActiveImageIndex(index);
        setIsImageModalOpen(true);
        setZoomLevel(1);
    };


    const handleLoadMore = () => {
        setLoading(true);
        // Simüle edilmiş yükleme gecikmesi
        setTimeout(() => {
            setVisibleReviews(prev => Math.min(prev + 20, sampleReviews.length));
            setLoading(false);
        }, 1000);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Burada yorum gönderme işlemi simüle edilmiştir
        console.log('Yeni yorum:', newReview);
        setIsReviewModalOpen(false);
        setNewReview({ rating: 5, comment: '' });
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Ana Ürün Kartı */}
                <div className="card lg:card-side bg-base-100 shadow-xl">
                    {/* Sol Taraf - Ürün Görselleri */}
                    <div className="relative lg:w-1/2 p-6">
                        <img
                            src={images[activeImageIndex]}
                            alt={`${product.name} - Ana Görsel`}
                            className="w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(activeImageIndex)}
                        />
                        {/* Küçük Görsel Önizlemeleri */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer rounded-lg overflow-hidden border-2 
                        ${activeImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                    onClick={() => setActiveImageIndex(index)}
                                >
                                    <img
                                        src={img}
                                        alt={`Önizleme ${index + 1}`}
                                        className="w-full h-24 object-cover hover:opacity-80 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sağ Taraf - Ürün Bilgileri */}
                    <div className="card-body lg:w-1/2">
                        {/* title */}
                        <div className='flex items-center justify-between w-full'>
                            <h2 className="card-title text-3xl font-bold">{product.name}</h2>
                            <div>
                                <span className='text-xs opacity-60'>{sampleReviews.length} değerlendirme</span>
                                <div className="rating rating-sm flex items-center justify-center">
                                    {[...Array(5)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="radio"
                                            className={`mask mask-star-2 ${index < product.rating ? 'bg-primary' : 'bg-base-300'
                                                }`}
                                            disabled
                                        />
                                    ))}
                                    <span className='ml-2 text-primary font-semibold' >{product.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Ürün Seçenekleri */}
                        <div className="form-control w-full mt-4">
                            <label className="label cursor-pointer">
                                <span className="label-text text-lg">Havlu Tercihi</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={includeProduct}
                                    onChange={(e) => setIncludeProduct(e.target.checked)}
                                />
                            </label>
                            <p className="text-sm text-base-content/70 mt-2">
                                {includeProduct
                                    ? "Premium havlumuz ve özel tasarım"
                                    : "Sadece tasarım (Havlu müşteri tarafından temin edilecek)"}
                            </p>
                        </div>

                        {/* Fiyat, Adet ve Sepet Butonu */}
                        <div className="bg-base-200 rounded-xl p-6 mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-primary">
                                    {/* Animasyonlu Fiyat */}
                                    <motion.div
                                        className="text-4xl font-bold text-primary mb-6"
                                        animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {(currentPrice * quantity).toLocaleString('tr-TR')} ₺
                                    </motion.div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="join">
                                        <button
                                            className="btn join-item"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        >
                                            -
                                        </button>
                                        <div className="btn join-item no-animation">
                                            {quantity}
                                        </div>
                                        <button
                                            className="btn join-item"
                                            onClick={() => setQuantity(q => q + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button className="btn btn-primary">
                                        Sepete Ekle
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Ürün Açıklaması */}
                        <p className="mt-6 text-base-content/80">{product.explanation}</p>

                        {/* Ürün Özellikleri */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {Object.entries({
                                Renk: product.color,
                                Kumaş: product.fabric,
                                Desen: product.pattern
                            }).map(([key, value]) => (
                                <div key={key} className="stats shadow">
                                    <div className="stat place-items-center p-2">
                                        <div className="stat-title">{key}</div>
                                        <div className="stat-value text-lg">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Müşteri Yorumları */}
                <div className="card bg-base-100 shadow-xl mt-12">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="card-title text-2xl">Müşteri Yorumları</h3>
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsReviewModalOpen(true)}
                            >
                                Yorum Yaz
                            </button>
                        </div>

                        {/* Yorumlar Listesi */}
                        <div className="space-y-6">
                            {sampleReviews.slice(0, visibleReviews).map((review) => (
                                <div key={review.id} className="border-b border-base-300 pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="avatar placeholder">
                                            <div className="bg-base-300 text-base-content rounded-full w-12">
                                                <span>{review.userName.substring(0, 2)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{review.userName}</h4>
                                            <div className="rating rating-sm">
                                                {[...Array(5)].map((_, index) => (
                                                    <input
                                                        key={index}
                                                        type="radio"
                                                        className={`mask mask-star-2 ${index < review.rating ? 'bg-primary' : 'bg-base-300'
                                                            }`}
                                                        disabled
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-base-content/60">{review.date}</div>
                                        </div>
                                    </div>
                                    <p className="text-base-content/70">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Daha Fazla Yükle Butonu */}
                        {visibleReviews < sampleReviews.length && (
                            <button
                                className={`btn btn-outline w-full mt-6 ${loading ? 'loading' : ''}`}
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Yorum Ekleme Modalı */}
                {isReviewModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">Yorum Yaz</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Puanınız</span>
                                    </label>
                                    <div className="rating rating-lg gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <input
                                                key={star}
                                                type="radio"
                                                name="rating"
                                                className="mask mask-star-2 bg-primary"
                                                checked={newReview.rating === star}
                                                onChange={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">Yorumunuz</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Ürün hakkındaki düşüncelerinizi yazın..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                        required
                                    ></textarea>
                                </div>
                                <div className="modal-action">
                                    <button type="submit" className="btn btn-primary">Gönder</button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => setIsReviewModalOpen(false)}
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Görsel Modal */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="relative w-[90vw] h-[90vh] flex items-center justify-center"
                        >
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    className="btn cursor-pointer z-10 btn-circle btn-sm"
                                    onClick={ handleZoomOut }
                                    disabled={zoomLevel <= 1}
                                >
                                    -
                                </button>
                                <button
                                    className="btn cursor-pointer z-10 btn-circle btn-sm"
                                    onClick={handleZoomIn }
                                    disabled={zoomLevel >= 3}
                                >
                                    +
                                </button>
                                <button
                                    className="btn cursor-pointer z-10 btn-circle btn-sm"
                                    onClick={() => {
                                        setIsImageModalOpen(false);
                                        setZoomLevel(1);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div
                                className="overflow-auto w-full h-full"
                                style={{
                                    cursor: zoomLevel > 1 ? 'move' : 'default'
                                }}
                            >
                                <img
                                    ref={imageRef}
                                    src={images[activeImageIndex]}
                                    alt="Büyük Görsel"
                                    className="w-full h-full object-contain transition-transform duration-200"
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        transformOrigin: 'center center'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}