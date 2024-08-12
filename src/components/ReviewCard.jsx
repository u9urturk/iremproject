import React, { useState } from 'react'
import ProductRaiting from './ProductRaiting'

export default function ReviewCard({ review, onEdit, onDelete, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(review.text);


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Backend'e düzenleme isteği gönder
        setIsEditing(false);
    };

    const handleDelete = () => {
        // Backend'e silme isteği gönder
    };
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-lg">
                <ProductRaiting initialRating={review.rating} id={review.id}></ProductRaiting>
                <h2 className="card-title font-semibold"><p>{review.customerId}</p></h2>
                <p>{isEditing ? (
                    <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                ) : (
                    review.comment
                )}</p>
                <div className="card-footer">
                    <div>
                        <p>{new Date(review.date).toLocaleString()}</p>
                    </div>
                    {user.id === review.customerId && (
                        <div className="card-actions justify-end">
                            {isEditing ? (
                                <button className="btn btn-primary" onClick={handleSave}>Kaydet</button>
                            ) : (
                                <>
                                    <button className="btn btn-primary" onClick={handleEdit}>Düzenle</button>
                                    <button className="btn btn-error" onClick={handleDelete}>Sil</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
