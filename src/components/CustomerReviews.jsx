import React, { useCallback, useEffect, useState } from 'react'
import { addComment, getCommentsByProductId } from '../firebase';
import { toast } from 'react-toastify';
import ReviewCard from './ReviewCard';
import { useSelector } from 'react-redux';
import ProductRating from './ProductRaiting';

export default function CustomerReviews({ getProduct = 'qI5vt8uQXKtDnWNXrcog' }) {
    const [reviewData, setReviewData] = useState([]);
    const [productId, setProductId] = useState('qI5vt8uQXKtDnWNXrcog');
    const [customerId, setCustomerId] = useState('TEST');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.auth.user)


    const handleSubmit = async (e) => {
        e.preventDefault();
        const date = new Date().toISOString(); // Yorumun yapıldığı tarih
        await addComment({ productId, customerId, rating, date, comment });

        // Formu temizle
        setProductId('');
        setCustomerId('');
        setRating(0);
        setComment('');
    };
    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCommentsByProductId(getProduct);
            setReviewData(data);
        } catch (e) {
            setError('Yorumlar yüklenirken bir hata oluştu!');
            toast.error('Yorumlar yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [getProduct]);

    useEffect(() => {
        if (getProduct) {
            fetchComments();
        }
    }, [fetchComments, getProduct]);

    const ratingsData = [
        { stars: 5, count: 75},
        { stars: 4, count: 15},
        { stars: 3, count: 55},
        { stars: 2, count: 3},
        { stars: 1, count: 23},

    ];

    const totalStars = ratingsData.reduce((total, rating) => total + rating.stars * rating.count, 0);
    const totalCount = ratingsData.reduce((total, rating) => total + rating.count, 0);
    const averageRating = totalStars / totalCount;
    const getPercentage = (count)=>{
        let percentage = (count*100)/totalCount
        return percentage;

    }

    // Ortalama puanı formatla
    const formattedAverageRating = averageRating.toFixed(1);


    return (
        <div className="container mx-auto p-4 h-screen overflow-y-auto">
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
            {reviewData.length === 0 && !loading && !error && (
                <div className="text-center text-gray-500">
                    Bu ürün için henüz yorum yapılmamış.
                </div>
            )}
            {reviewData.length > 0 && (
                <div className="space-y-4 review-rating bg-gray-100 p-4  rounded-lg">
                    <div className=' flex items-center justify-center bg-base-100 px-8 flex-col'>
                        <h2 className="text-2xl font-bold text-gray-800">Müşteri Yorumları ve Puanları</h2>
                        <div className='flex flex-col gap-y-8 lg:gap-y-0 lg:flex-row w-full items-center justify-between '>
                            <div className="rating-bars">
                                {ratingsData.map((rating, index) => (
                                    <div key={index} className="flex w-full gap-x-4 items-center justify-start rating-bar mb-2">
                                        <div className='flex items-center text-xl justify-center'>
                                            <span className="">{rating.stars}</span>
                                            <div className="rating rating-sm">
                                                <input type="radio" name={rating.stars} className="mask mask-star-2 bg-orange-400" />
                                            </div>
                                        </div>
                                        <progress className="progress progress-primary w-56" value={getPercentage(rating.count)} max="100"></progress>
                                        <span className="rating-count text-lg">{rating.count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rating-summary flex flex-col items-center justify-center ">
                                <strong> {formattedAverageRating}</strong>
                                <ProductRating gap={2} initialRating={5}></ProductRating>
                                <p className='text-sm'> {totalCount} Değerlendirme</p>
                            </div>
                            <div className="rating-actions flex items-center justify-center flex-col gap-y-4 ">
                                <button onClick={() => document.getElementById('handleComment').showModal()} className='btn btn-sm w-full rounded-md btn-primary'>Değerlendir</button>
                                <button className='btn btn-sm rounded-md btn-secondary'>Tüm Değerlendirmeler</button>
                            </div>
                        </div>
                    </div>
                    {reviewData.map((review) => (
                        <ReviewCard key={review.id} user={user} review={review}></ReviewCard>
                    ))}
                </div>
            )}
            <dialog id="handleComment" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-gray-100 shadow rounded">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product ID</label>
                            <input
                                type="text"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                            <input
                                type="text"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <input
                                type="number"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                min="0"
                                max="5"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                rows="4"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Yorum Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

        </div>
    )
}
