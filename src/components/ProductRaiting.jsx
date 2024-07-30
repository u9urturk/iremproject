import React, { useEffect, useState } from 'react'

const ProductRating = ({ initialRating,size,id}) => {
    const [rating, setRating] = useState(initialRating);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    return (
        <div className={`rating  rating-${size}`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <input
                    key={value}
                    type="radio"
                    name={`rating-${id}`}
                    className="mask mask-star-2 bg-orange-400"
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    disabled
                />
            ))}
        </div>
    );
};

export default ProductRating;