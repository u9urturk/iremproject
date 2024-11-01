import React, { useState } from 'react'
import ProductRaiting from './ProductRaiting'

export default function ReviewCard({ review }) {


  
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="bg-white min-w-[190px] rounded-md  p-6">
                <div className="flex items-center mb-4">
                    <div>
                        <p className="text-lg font-semibold">{review.customerId}</p>
                        <div className="flex items-center">
                            <ProductRaiting initialRating={review.rating} id={review.id}></ProductRaiting>

                        </div>
                    </div>
                </div>
                <p className="text-gray-700 text-base">{review.comment}</p>
                <div className='text-xs  opacity-70 pt-2'>
                    <p>{new Date(review.date).toLocaleString()}</p>
                </div>
            </div>
        </div>

    )
}
