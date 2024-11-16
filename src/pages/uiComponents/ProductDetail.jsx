import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addComment, downloadImages } from '../../firebase';

export default function ProductDetail({ product, user,addCart,quantityFB,productId, reviews, updateReviewState }) {
    const [includeProduct, setIncludeProduct] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(8);
    const [loading, setLoading] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(product.fullPrice);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [images, setImages] = useState([]);
    const [productReview, setProductReview] = useState(1);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);


    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });

    const [isAnimating, setIsAnimating] = useState(false);



    const listenImages = useCallback(
        () => {
            downloadImages("productImages", productId).then((res) => {
                setImages(res);
                setPageLoading(false);
            })
        },
        [productId],
    )

    useEffect(() => {
      quantityFB(quantity);
    }, [quantity])
    


    useEffect(() => {
        listenImages()
        getProductReview();
        sortReviews();
    }, [productId, listenImages])


    useEffect(() => {
        let targetPrice = ""
        if (product.fullPrice === null) { targetPrice = product.basePrice } else { targetPrice = includeProduct ? product.fullPrice : product.basePrice; }
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
            setVisibleReviews(prev => Math.min(prev + 20, reviews.length));
            setLoading(false);
        }, 1000);
    };

    const getProductReview = async () => {
        let totalReview = 0
        await reviews.forEach(e => {
            totalReview = totalReview + e.rating
            setProductReview(totalReview / reviews.length)
        });
    }


    const changeDateFormat = (date) => {
        let [day, month, year] = date.split(".");
        return new Date(`${year}-${month}-${day}`);

    }

    // Sıralama işlemini gerçekleştiren fonksiyon
    const sortReviews = (option = 'date_desc') => {
        let sortedData = [...reviews];


        if (option === 'date_desc') {
            sortedData.sort((a, b) => changeDateFormat(b.date) - changeDateFormat(a.date)); // Tarihe göre azalan
        } else if (option === 'rating_desc') {
            sortedData.sort((a, b) => b.rating - a.rating); // Puana göre azalan
        } else if (option === 'date_asc') {
            sortedData.sort((a, b) => changeDateFormat(a.date) - changeDateFormat(b.date)); // Tarihe göre artan
        } else if (option === 'rating_asc') {
            sortedData.sort((a, b) => a.rating - b.rating); // Puana göre artan
        }


        setSortedReviews(sortedData); // Sıralanan veriyi state'e kaydet
    };

    // Sıralama seçeneğini değiştiren handler
    const handleSortChange = (e) => {
        console.log(e.target.value)
        sortReviews(e.target.value); // Seçilen sıralama opsiyonuna göre veriyi sırala
    };


    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Burada yorum gönderme işlemi simüle edilmiştir
        setIsReviewModalOpen(false);
        const data = {
            customerId: user.uid,
            productId: productId,
            customerName: user.displayName,
            date: new Date().toISOString(),
            rating: newReview.rating,
            comment: newReview.comment
        }
        addComment(data).then(res => {
            updateReviewState(res)
        })
    };


    return (
        <div className="min-h-screen bg-base-200">
            {pageLoading ? <div className="container mx-auto px-4 py-8">
                {/* Ana Ürün Kartı Skeleton */}
                <div className="card lg:card-side bg-base-100 shadow-xl animate-pulse">
                    {/* Sol Taraf - Ürün Görselleri Skeleton */}
                    <div className="relative h-1/2 lg:w-1/2 p-6">
                        {/* Ana Görsel Skeleton */}
                        <div className="w-full h-96 bg-base-300 rounded-xl" />

                        {/* Küçük Görsel Önizlemeleri Skeleton */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="w-full h-24 bg-base-300 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Sağ Taraf - Ürün Bilgileri Skeleton */}
                    <div className="card-body lg:w-1/2">
                        {/* Title ve Rating Skeleton */}
                        <div className='flex flex-col md:flex-row justify-between items-center w-full gap-4'>
                            <div className="h-8 bg-base-300 rounded w-2/3" />
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-4 bg-base-300 rounded w-24" />
                                <div className="h-4 bg-base-300 rounded w-32" />
                            </div>
                        </div>

                        {/* Ürün Seçenekleri Skeleton */}
                        <div className="form-control w-full mt-4">
                            <div className="flex justify-between items-center">
                                <div className="h-6 bg-base-300 rounded w-32" />
                                <div className="h-6 bg-base-300 rounded w-12" />
                            </div>
                            <div className="h-4 bg-base-300 rounded w-3/4 mt-2" />
                        </div>

                        {/* Fiyat ve Adet Skeleton */}
                        <div className="bg-base-200 rounded-xl p-6 mt-6">
                            <div className="flex flex-wrap items-center justify-between">
                                <div className="h-10 bg-base-300 rounded w-32" />
                                <div className="flex items-center gap-4">
                                    <div className="h-10 bg-base-300 rounded w-32" />
                                    <div className="h-10 bg-base-300 rounded w-32" />
                                </div>
                            </div>
                        </div>

                        {/* Açıklama Skeleton */}
                        <div className="space-y-2 mt-6">
                            <div className="h-4 bg-base-300 rounded w-full" />
                            <div className="h-4 bg-base-300 rounded w-5/6" />
                            <div className="h-4 bg-base-300 rounded w-4/6" />
                        </div>

                        {/* Ürün Özellikleri Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="stats shadow">
                                    <div className="stat place-items-center p-2">
                                        <div className="h-4 bg-base-300 rounded w-16 mb-2" />
                                        <div className="h-6 bg-base-300 rounded w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Müşteri Yorumları Skeleton */}
                <div className="card bg-base-100 shadow-xl mt-12">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div className="h-8 bg-base-300 rounded w-48" />
                            <div className="flex gap-x-2">
                                <div className="h-10 bg-base-300 rounded w-40" />
                                <div className="h-10 bg-base-300 rounded w-32" />
                            </div>
                        </div>

                        {/* Yorumlar Listesi Skeleton */}
                        <div className="space-y-6">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="border-b border-base-300 pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 bg-base-300 rounded-full" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-base-300 rounded w-32" />
                                            <div className="h-4 bg-base-300 rounded w-24" />
                                            <div className="h-4 bg-base-300 rounded w-20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-4 bg-base-300 rounded w-full" />
                                        <div className="h-4 bg-base-300 rounded w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button Skeleton */}
                        <div className="w-full h-12 bg-base-300 rounded mt-6" />
                    </div>
                </div>
            </div> : <div className="container animate-fade mx-auto px-4 py-8">
                {/* Ana Ürün Kartı */}
                <div className="card lg:card-side bg-base-100 shadow-xl">
                    {/* Sol Taraf - Ürün Görselleri */}
                    <div className="relative h-1/2 lg:w-1/2 p-6">
                        <img
                            src={images[activeImageIndex]}
                            alt={`${product.name} - Ana Görsel`}
                            className="w-full h-96 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
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
                        <div className='flex flex-col md:flex-row justify-center items-center md:justify-between w-full'>
                            <h2 className="card-title text-3xl font-bold">{product.name}</h2>
                            <div>
                                <span className='text-xs opacity-60'>{reviews.length} değerlendirme</span>
                                <div className="rating rating-sm rating-half flex items-center justify-center">
                                    {[...Array(5)].map((_, index) => (
                                        <>
                                            <input
                                                key={index}
                                                type="radio"
                                                className={`mask mask-star-2 mask-half-1 ${index.toFixed(1) < productReview.toFixed(1) ? 'bg-primary' : 'bg-base-300'
                                                    }`}
                                                disabled
                                            />
                                            <input
                                                key={index}
                                                type="radio"
                                                className={`mask mask-star-2  mask-half-2 ${(index + 0.5).toFixed(1) < productReview.toFixed(1) ? 'bg-primary' : 'bg-base-300'
                                                    }`}
                                                disabled
                                            />
                                        </>
                                    ))}
                                    <span className='ml-2 text-primary font-semibold' >{productReview.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Ürün Seçenekleri */}
                        <div className={`${!product.fullPrice ? "hidden" : ""} form-control w-full mt-4`}>
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
                            <div className="flex flex-wrap items-center justify-center md:justify-between">
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
                                    <button onClick={addCart} className="btn btn-primary">
                                        Sepete Ekle
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Ürün Açıklaması */}
                        <p className="mt-6 text-base-content/80">{product.explanation}</p>

                        {/* Ürün Özellikleri */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
                        <div className="flex flex-col md:flex-row gap-y-8 justify-between items-center mb-6">
                            <h3 className="card-title text-2xl">Müşteri Yorumları</h3>
                            <div className='flex flex-row gap-x-2 items-center justify-center'>
                                <select className="select select-bordered w-full max-w-xs" onChange={handleSortChange}>
                                    <option disabled selected>Sırala</option>
                                    <option value="date_desc">Tarihe göre azalan</option>
                                    <option value="rating_desc">Puana göre azalan</option>
                                    <option value="date_asc">Tarihe göre artan</option>
                                    <option value="rating_asc">Puana göre artan</option>
                                </select>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsReviewModalOpen(true)}
                                >
                                    Yorum Yaz
                                </button>
                            </div>
                        </div>

                        {/* Yorumlar Listesi */}
                        <div className="space-y-6">
                            {sortedReviews?.slice(0, visibleReviews).map((review) => (
                                <div key={review.id} className="border-b border-base-300 pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="avatar placeholder">
                                            <div className="bg-base-300 text-base-content rounded-full w-12">
                                                <span>{review.customerName.substring(0, 2)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{review.customerName}</h4>
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
                        {visibleReviews < reviews.length && (
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
            </div>}

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
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 1}
                                >
                                    -
                                </button>
                                <button
                                    className="btn cursor-pointer z-10 btn-circle btn-sm"
                                    onClick={handleZoomIn}
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