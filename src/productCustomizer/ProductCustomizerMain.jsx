import React, { useEffect, useState } from "react";
import CategorySelector from "./CategorySelector";
import FeaturePicker from "./FeaturePicker";
import OrderSummary from "./OrderSummary";
import ImageGallary from "./ImageGallary";
import axios from 'axios';

const ProductCustomizerMain = () => {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchImages = async () => {
        try {
          // Lorem Picsum API, belirli boyutlarda resimler döndürür
          const requests = Array.from({ length: 16 }).map(() =>
            axios.get('https://picsum.photos/200/300?random')
          );
  
          // 50 rastgele görselin URL'lerini almak için paralel istek yapalım
          const responses = await Promise.all(requests);
          const imageUrls = responses.map((response) => response.request.responseURL);
          setImages(imageUrls);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
          setLoading(false);
        }
      };
  
      fetchImages();
    }, []);

    console.log(images[0])
    const categories = [
        { id: 1, name: "T-shirt", image: "/images/tshirt.jpg" },
        { id: 2, name: "Kupa", image: "/images/mug.jpg" },
    ];

    const featuresMap = {
        1: [
            { key: "color", label: "Renk", options: [{ value: "red", label: "Kırmızı" }, { value: "blue", label: "Mavi" }] },
            { key: "size", label: "Boyut", options: [{ value: "small", label: "Küçük" }, { value: "large", label: "Büyük" }] },
        ],
        2: [
            { key: "material", label: "Materyal", options: [{ value: "ceramic", label: "Seramik" }, { value: "plastic", label: "Plastik" }] },
        ],
    };

    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState({});

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2);
    };

    const handleFeaturesSelect = (features) => {
        setSelectedFeatures(features);
    };

    const handleEdit = () => {
        setStep(2);
    };

    const handleConfirm = () => {
        alert("Sipariş Tamamlandı!");
    };

    if(loading){
        return <div>Yükleniyor .... </div>
    }

    return (
        <div className="p-6 animate-fade min-h-screen">
            <ImageGallary images={images}></ImageGallary>
        </div>
    );
};

export default ProductCustomizerMain;
