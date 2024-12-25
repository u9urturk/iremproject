import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addComment } from '../../firebase/commentService';
import { downloadImages } from '../../firebase/imageService';

export default function ProductDetail({ product, user, addCart, quantityFB, productId, reviews, updateReviewState }) {
    const [includeProduct, setIncludeProduct] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(8);
    const [loading, setLoading] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(product.basePrice);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [productReview, setProductReview] = useState(1);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(product.varyants[0])
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Sırala");
    const [currentProperty, setCurrentProperty] = useState({
        color: product.varyants[0].color.id,
        pattern: product.varyants[0].pattern.id,
        fabric: product.varyants[0].fabric.id
    })



    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });

    const getSelectProduct = () => {
        setPageLoading(true)
        const currentIndex = product.varyants.findIndex(varyant => {
   
            return (
                varyant.color.id === currentProperty.color &&
                varyant.fabric.id === currentProperty.fabric &&
                varyant.pattern.id === currentProperty.pattern
            );
        });
        setCurrentProduct(product.varyants[currentIndex]);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setTimeout(() => {
            setPageLoading(false)
        }, 700);


    }

    useEffect(() => {
        getSelectProduct()
    }, [currentProperty])



    useEffect(() => {
        includeProduct ? setCurrentPrice(product.fullPrice) : setCurrentPrice(product.basePrice)
    }, [includeProduct])



    useEffect(() => {
        quantityFB(quantity);
    }, [quantity])



    useEffect(() => {
        getProductReview();
        sortReviews();
    }, [productId,reviews])


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
        const value = e.target.value
        setSelectedValue(value)
        sortReviews(value); // Seçilen sıralama opsiyonuna göre veriyi sırala
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
                                <div key={`miniPhoto${index}`} className="w-full h-24 bg-base-300 rounded-lg" />
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
                                <div key={`pskeleton${index}`} className="stats shadow">
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
                                <div key={`cskeleton${index}`} className="border-b border-base-300 pb-4">
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
            </div> : <div className="container animate-fade relative mx-auto px-4 py-8">
                {/* Ana Ürün Kartı */}

                <div className="card lg:card-side bg-base-100 shadow-xl">
                    {/* Sol Taraf - Ürün Görselleri */}
                    <div className="relative h-1/2 lg:w-1/2 p-6">
                        <img
                            src={currentProduct && currentProduct.imgs[activeImageIndex]}
                            alt={`${product.name} - Ana Görsel`}
                            className="w-full h-96 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(activeImageIndex)}
                        />
                        {/* Küçük Görsel Önizlemeleri */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {currentProduct && currentProduct.imgs.map((img, index) => (
                                <div
                                    key={`${productId}${index}`}
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
                        <div className={`tooltip absolute  top-1 right-4 tooltip-primary tooltip-left`} data-tip="Ürün özelliklerini değiştirerek diğer alternatifleri görüntüleyebilirsiniz">
                            <button className="text-primary font-bold text-xl">?</button>
                        </div>
                        {/* title */}
                        <div className='flex flex-col md:flex-row justify-center items-center md:justify-between w-full'>
                            <h2 className="card-title text-3xl font-bold">{product.name}</h2>
                            <div>
                                <span className='text-xs opacity-60'>{reviews.length} değerlendirme</span>
                                <div className="rating rating-sm rating-half flex items-center justify-center">
                                    {[...Array(5)].map((_, index) => (
                                        <React.Fragment key={index}>
                                            <input
                                                type="radio"
                                                className={`mask mask-star-2 mask-half-1 ${index.toFixed(1) < productReview.toFixed(1) ? 'bg-primary' : 'bg-base-300'
                                                    }`}
                                                disabled
                                            />
                                            <input
                                                type="radio"
                                                className={`mask mask-star-2  mask-half-2 ${(index + 0.5).toFixed(1) < productReview.toFixed(1) ? 'bg-primary' : 'bg-base-300'
                                                    }`}
                                                disabled
                                            />
                                        </React.Fragment>
                                    ))}
                                    <span className='ml-2 text-primary font-semibold' >{productReview.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Ürün Seçenekleri */}
                        <div className={`${!product.fullPrice ? "hidden" : ""} form-control w-full mt-4`}>
                            <label className="label cursor-pointer">
                                <span className="label-text text-lg">Hizmet Tercihi</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={includeProduct}
                                    onChange={(e) => setIncludeProduct(e.target.checked)}
                                />
                            </label>
                            <p className="text-sm text-base-content/70 mt-2">
                                {includeProduct
                                    ? "Kaliteli ürün ve özel tasarım"
                                    : "Sadece tasarım (İşlenilecek ürün müşteri tarafından temin edilecek)"}
                            </p>
                        </div>

                        {/* Fiyat, Adet ve Sepet Butonu */}
                        <div className="bg-base-200 rounded-xl p-6 mt-6 space-y-4">
                            <div className="flex flex-wrap items-center justify-center md:justify-between">
                                <div className="text-3xl font-bold text-primary">
                                    {/* Animasyonlu Fiyat */}
                                    <motion.div
                                        className="text-4xl font-bold text-primary mb-6"

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
                                    <button onClick={() => { addCart(currentProduct, includeProduct) }} className="btn btn-primary">
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
                                Renk: { value: currentProduct?.color.name, values: product.colors },
                                Kumaş: { value: currentProduct?.fabric.name, values: product.fabrics },
                                Model: { value: currentProduct?.pattern.img, values: product.patterns },
                            }).map(([key, obj]) => (
                                <div
                                    key={key}
                                    className="stats relative overflow-visible  group cursor-pointer hover:scale-95 transition-transform hover:shadow-xl shadow"
                                >
                                    <div className="stat bg-base-200 rounded-lg place-items-center p-2">
                                        <div className="stat-title text-primary">{key}</div>
                                        {key === "Model" ? <img className='w-16 h-16' src={obj.value}></img> : <div className="stat-value text-lg">{obj.value}</div>}
                                    </div>
                                    {/* Hover */}
                                    <div onClick={() => { document.getElementById(`modal_${key}`).showModal() }} className='absolute items-center justify-center rounded-lg   hidden group-hover:flex group-hover:animate-fade-up bg-base-200 w-full h-full'>
                                        <p  className='font-bold pl-4 '>{key} Seçenekleri</p>
                                    </div>

                                    <dialog id={`modal_${key}`} className="modal">
                                        <div className="modal-box">
                                            <h3 className="font-bold text-lg">{key}</h3>
                                            <div className='flex items-center justify-center gap-4'>
                                                {obj.values?.map((value, index) => {
                                                    if (key === "Model") {
                                                        return <div key={index} onClick={() => {
                                                            setCurrentProperty((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    pattern: value.id
                                                                }
                                                            });
                                                            document.getElementById(`modal_${key}`).close();

                                                        }} className='w-auto flex items-center hover:scale-105 transition-all rounded-xl justify-center p-2 h-auto bg-base-300'>
                                                            <img src={value.img} className='h-20 w-20' />
                                                        </div>
                                                    } else if (key === "Kumaş") {
                                                        return <div key={index}
                                                            onClick={() => {
                                                                setCurrentProperty((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        fabric: value.id
                                                                    }
                                                                });
                                                                document.getElementById(`modal_${key}`).close();

                                                            }}
                                                            className='w-auto min-w-20 min-h-20 flex items-center hover:scale-105 transition-all rounded-xl justify-center p-2 h-auto bg-base-300'>
                                                            <p className='font-bold text-center w-full'>{value.name}</p>
                                                        </div>
                                                    } else {
                                                        return <div key={index}
                                                            onClick={() => {
                                                                setCurrentProperty((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        color: value.id
                                                                    }
                                                                });
                                                                document.getElementById(`modal_${key}`).close();

                                                            }}
                                                            className='w-auto min-w-20 min-h-20 flex items-center hover:scale-105 transition-all rounded-xl justify-center p-2 h-auto bg-base-300'>
                                                            <div
                                                                style={{ backgroundColor: value.colorCode ? value.colorCode : "#ce463e" }}
                                                                className={`w-10 h-10 rounded-tl-full rounded-br-full`}></div>
                                                        </div>
                                                    }
                                                })}
                                            </div>
                                        </div>
                                        <form method="dialog" className="modal-backdrop">
                                            <button>close</button>
                                        </form>
                                    </dialog>
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
                                <select value={selectedValue} className="select select-bordered w-full max-w-xs" onChange={handleSortChange}>
                                    <option disabled >Sırala</option>
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
                                                <span>{review.customerName && review.customerName.substring(0, 2)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{review.customerName}</h4>
                                            <div className="rating rating-sm">
                                                {[...Array(5)].map((_, index) => (
                                                    <input
                                                        key={`rating${index}`}
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
                                                key={`star${star}`}
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
                                    src={currentProduct.imgs[activeImageIndex]}
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