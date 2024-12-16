import React, { useEffect, useState } from "react";

const ImageGallery = ({ images }) => {
    // Filtreleme işlemi: Seçilen özelliklere uyan görselleri filtreler
    const [getImages, setGetImages] = useState(null)
    useEffect(() => {
        setGetImages(images)
    }, [images])

    


    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images?.length > 0 ? (
                images.map((image, index) => (
                    <div key={index} className="border hover:scale-125 transition-all  rounded overflow-hidden shadow">
                        <img
                            src={image}
                            alt={image.alt || "Görsel"}
                            className="w-full h-48 object-cover"
                        />
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center text-gray-500">
                    Seçilen özelliklere uygun görsel bulunamadı.
                </div>
            )}
        </div>
    );
};

export default ImageGallery