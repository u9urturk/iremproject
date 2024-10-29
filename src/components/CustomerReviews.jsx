import React, { useCallback, useEffect, useState } from 'react'
import { addComment, getCommentsByProductId } from '../firebase';
import { toast } from 'react-toastify';
import ReviewCard from './ReviewCard';
import { useSelector } from 'react-redux';
import ProductRating from './ProductRaiting';

export default function CustomerReviews({getProductId} ) {
    const user = useSelector(state => state.auth.user)
    const [reviewData, setReviewData] = useState([]);
    const [productId, setProductId] = useState(getProductId);
    const [customerId, setCustomerId] = useState(user.uid);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


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
            const data = await getCommentsByProductId(productId);
            setReviewData(data);
        } catch (e) {
            setError('Yorumlar yüklenirken bir hata oluştu!');
            toast.error('Yorumlar yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [getProductId]);

    useEffect(() => {
        if (getProductId) {
            fetchComments();
        }
    }, [fetchComments, getProductId]);

    const ratingsData = [
        { stars: 5, count: 75 },
        { stars: 4, count: 15 },
        { stars: 3, count: 55 },
        { stars: 2, count: 3 },
        { stars: 1, count: 23 },

    ];

    const totalStars = ratingsData.reduce((total, rating) => total + rating.stars * rating.count, 0);
    const totalCount = ratingsData.reduce((total, rating) => total + rating.count, 0);
    const averageRating = totalStars / totalCount;
    const getPercentage = (count) => {
        let percentage = (count * 100) / totalCount
        return percentage;

    }

    // Ortalama puanı formatla
    const formattedAverageRating = averageRating.toFixed(1);


    return (
        <div className="md:container w-full md:mx-auto md:p-4 h-full">
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {(
                <div className="space-y-4 w-full review-rating p-4 h-auto rounded-lg">
                    <div className=' flex items-center justify-center bg-base-100 px-8 flex-col'>
                        <h2 className="text-2xl text-center  font-bold text-gray-800">Müşteri Yorumları ve Puanları</h2>
                        <div className='flex flex-col gap-y-4 py-2   md:gap-y-8 lg:gap-y-0 lg:flex-row w-full items-center justify-between '>
                            <div className="rating-bars flex flex-col ">
                                {ratingsData.map((rating, index) => (
                                    <div key={index} className="flex w-full gap-x-4 items-center justify-start rating-bar">
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
                                <ProductRating gap={2} initialRating={formattedAverageRating}></ProductRating>
                                <p className='text-sm'> {totalCount} Değerlendirme</p>
                            </div>
                            <div className="rating-actions  dropdown  dropdown-bottom dropdown-end flex items-center justify-center flex-col gap-y-2 md:gap-y-4 ">
                                <button onClick={() => document.getElementById('handleComment').showModal()} className='btn btn-sm w-full rounded-md btn-primary'>Değerlendir</button>
                                <button className='btn btn-sm  rounded-md btn-secondary'>Tüm Değerlendirmeler</button>
                                <div className='flex items-center justify-center w-full'>
                                    <div tabIndex={0} role="button" className="btn rounded-lg w-full  font-semibold  btn-outline">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="h-4 w-4"
                                        >
                                            <path d="m21 16-4 4-4-4"></path>
                                            <path d="M17 20V4"></path>
                                            <path d="m3 8 4-4 4 4"></path>
                                            <path d="M7 4v16"></path>
                                        </svg>Sırala</div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                                        <li><div>Değerlendirme</div></li>
                                        <li><div>Tarih</div></li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 overflow-y-auto overflow-scroll max-h-[560px]  gap-8">
                        {reviewData.length === 0 && !loading && !error && (
                            <div className="text-center text-gray-500">
                                Bu ürün için henüz yorum yapılmamış.
                            </div>
                        )}
                        {reviewData.map((review) => (
                            <ReviewCard key={review.id} user={user} review={review}></ReviewCard>
                        ))}
                    </div>
                </div>
            )}
            <dialog id="handleComment" className="modal">
                <div className="modal-box max-w-5xl">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 bg-base-100 bg-transparent p-6  rounded-md">

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Rating</span>
                            </label>
                            <input
                                type="number"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                min="0"
                                max="5"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Comment</span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Yorum Gönder
                            </button>
                            <button
                                onClick={() => document.getElementById('handleComment').close()}
                                type="button"
                                className="btn btn-secondary w-full mt-2"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>


        </div>
    )
}
