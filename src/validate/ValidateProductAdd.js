import { toast } from "react-toastify";

const validateFormData = (formData) => {
    const { productData, photos } = formData;

    const changeKey = (key) => {
        console.log(key)
        switch (key) {
            case 'categoryId':
                return "Kategori"

            case 'colorId':
                return "Renk"


            case 'explanition':
                return "Ürün Açıklaması"

            case 'fabricId':
                return "Kumaş"

            case 'patternId':
                return "Desen"

            case 'basePrice':
                return "Taban Fiyat"

            case 'fullPrice':
                return "Premium Fiyat"

            case 'productName':
                return "Ürün İsmi"

            default:
                console.log('Bilinmeyen bir anahtar girildi.');
                break;
        }
    };



    for (const [key, value] of Object.entries(productData)) {
        if (!value && productData.premiumProduct === true) {

            toast.error(`Lütfen "${changeKey(key)}" alanını doldurun!`);
            return false;
        }
        if (!value && productData.premiumProduct === false && key !== "fullPrice" && key !== "premiumProduct") {

            toast.error(`Lütfen "${changeKey(key)}" alanını doldurun!`);
            return false;
        }
       
    }

    if (productData.basePrice > productData.fullPrice && productData.premiumProduct === true) {
        toast.error("Taban Fiyat Premium Fiyattan Yüksek Olamaz");
        return false;
    }


    if (photos.filter((qq)=>(qq===null)).length > 3) {
        toast.error("Görseller en az 3, en fazla 6 adet olmalıdır!");
        return false;
    }




    return true;
};

export default validateFormData;
