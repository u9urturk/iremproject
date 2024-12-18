import React, { useEffect, useState } from 'react';
import { Save, ArrowRight, ArrowLeft, Eye, EyeOff, Plus } from 'lucide-react';
import { useCategory } from '../context/CategoryContext';
import validateFormData from '../validate/ValidateProductAdd';
import { toast } from 'react-toastify';
import ModelUi from './ModelUi';
import { addProduct } from '../firebase/productService';
import ColorUi from './ColorUi';
import FabricUi from './FabricUi';
import LoadingUi from './LoadingUi';

export default function ProductAdd() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { patterns, fabrics, colors, categories, } = useCategory();
    const [currentProperty, setCurrentProperty] = useState({
        colors: [],
        fabrics: [],
        patterns: []
    })
    const [formData, setFormData] = useState({
        status: {
            onView: true,
        },
        productData: {
            productName: '',
            categoryId: '',
            explanation: '',
            basePrice: "",
            fullPrice: "",
            premiumProduct: true
        },
        varyants: []

    });


    const handleInputProperty = (section, value) => {
        setCurrentProperty((prev) => ({
            ...prev,
            [section]:value
        }));
    };



    const getPropertyNameById = (id, property) => {

        switch (property) {
            case "color":
                return colors?.find((c) => c.id === id)?.name || null;
            case "fabric":
                return fabrics?.find((f) => f.id === id)?.name || null;
            case "pattern":
                return patterns?.find((p) => p.id === id)?.imgsUrl?.[0] || null;
            default:
                return null;
        }
    }

    function generateCombinations(colors, fabrics, patterns) {
        const newVariants = [];

        patterns.forEach((pattern) => {
            fabrics.forEach((fabric) => {
                colors.forEach((color) => {
                    newVariants.push({
                        color:  color ,
                        fabric: { name: getPropertyNameById(fabric, "fabric"), id: fabric },
                        pattern: { img: getPropertyNameById(pattern, "pattern"), id: pattern },
                        imgs: Array(3).fill(null),
                    });
                });
            });
        });

        setFormData((prev) => ({
            ...prev,
            varyants: newVariants,
        }));
    }




    useEffect(() => {
        if (currentProperty.colors.length && currentProperty.fabrics.length && currentProperty.patterns.length) {
            generateCombinations(currentProperty.colors, currentProperty.fabrics, currentProperty.patterns);
        }
    }, [currentProperty.colors, currentProperty.fabrics, currentProperty.patterns])


    const handlePhotoChange = (e, key) => {
        const files = Array.from(e.target.files);
        const currentPhotos = formData.varyants[key].imgs.filter((photo) => photo !== null);
        const remainingSlots = 3 - currentPhotos.length;

        if (files.length > remainingSlots) {
            toast.warning(`Maksimum ${remainingSlots} fotoğraf daha yükleyebilirsiniz.`);
            return;
        }

        const newPhotos = files.slice(0, remainingSlots).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setFormData((prevFormData) => {
            const updatedVaryant = [...prevFormData.varyants];
            const updatedPhotos = updatedVaryant[key].imgs;
            let i = 0;
            for (let j = 0; j < updatedPhotos.length; j++) {
                if (updatedPhotos[j] === null && i < newPhotos.length) {
                    updatedPhotos[j] = newPhotos[i];
                    i++;
                }
            }
            updatedVaryant[key].imgs = updatedPhotos;
            return {
                ...prevFormData,
                varyants: updatedVaryant
            };
        });
    };

    const handlePhotoDelete = (index,key) => {
        setFormData((prevFormData) => {
            const updatedPhotos = [...prevFormData.varyants[key]];
            updatedPhotos.imgs[index] = null; // Fotoğrafı kaldır
            return {
                ...prevFormData,
                photos: updatedPhotos
            };
        });
    };



    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };


    const handleSave = () => {
        const isValid = validateFormData(formData);
        if (isValid) {
            setLoading(true);
            addProduct(formData).then(() => {
                setLoading(false);
                document.getElementById("modal_product_add").close()
            })
        }
    }

    const steps = [
        { number: 1, title: "Temel Bilgiler" },
        { number: 2, title: "Detay Bilgileri" },
        { number: 3, title: "Fotoğraflar" }
    ];



    return (
        <div className="container mx-auto   p-6 max-w-4xl">
            <button className="btn btn-sm rounded hover:btn-primary" onClick={() => document.getElementById('modal_product_add').showModal()}><Plus></Plus>Yeni Ürün Ekle</button>
            <dialog id="modal_product_add" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box ">
                    <div className="card ">
                        <div className="card-body ">
                            {/* Stepper */}
                            <ul className="steps steps-horizontal w-full mb-8">
                                {steps.map((step) => (
                                    <li
                                        key={step.number}
                                        className={`step ${currentStep >= step.number ? 'step-primary' : ''}`}
                                        data-content={step.number}
                                    >
                                        {step.title}
                                    </li>
                                ))}
                            </ul>

                            {/* Form Content */}
                            <div className="space-y-6">
                                {currentStep === 1 && (
                                    <div className="space-y-4 animate-fade-right">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Temel Bilgiler</h2>
                                            <div className='flex items-center justify-center gap-x-3'>
                                                <label className=" flex items-center justify-center gap-x-2 label cursor-pointer">
                                                    <span className="label-text">Premium Ürün</span>
                                                    <input
                                                        className='toggle toggle-sm toggle-primary'
                                                        type="checkbox"
                                                        checked={formData.productData.premiumProduct}
                                                        onChange={(e) => handleInputChange('productData', 'premiumProduct', e.target.checked)}
                                                    />

                                                </label>

                                                <label className="swap swap-rotate">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.status.onView}
                                                        onChange={(e) => handleInputChange('status', 'onView', e.target.checked)}
                                                    />
                                                    <Eye className="swap-on w-6 h-6" />
                                                    <EyeOff className="swap-off w-6 h-6" />
                                                </label>
                                            </div>

                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Ürün Adı</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ürün adını giriniz"
                                                className="input input-bordered"
                                                value={formData.productData.productName}
                                                onChange={(e) => handleInputChange('productData', 'productName', e.target.value)}
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Kategori</span>
                                            </label>
                                            <select
                                                className="select select-bordered"
                                                value={formData.productData.categoryId}
                                                onChange={(e) => handleInputChange('productData', 'categoryId', e.target.value)}
                                            >
                                                <option value="" disabled>Kategori seçiniz</option>
                                                {
                                                    categories.map((category, key) => (
                                                        <option key={key} value={category.id}>{category.name}</option>

                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Açıklama</span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered h-24"
                                                placeholder="Ürün açıklamasını giriniz"
                                                value={formData.productData.explanation}
                                                onChange={(e) => handleInputChange('productData', 'explanation', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4 animate-fade-right">
                                        <h2 className="text-2xl font-bold">Detay Bilgileri</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Kumaş</span>
                                                </label>
                                                <FabricUi fabrics={fabrics} handleInput={handleInputProperty}></FabricUi>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Renk</span>
                                                </label>
                                                <ColorUi colors={colors} handleInput={handleInputProperty}></ColorUi>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Model</span>
                                                </label>
                                                <ModelUi patterns={patterns} currentModel={handleInputProperty} ></ModelUi>

                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Fiyat Bilgileri</span>
                                                </label>
                                                <div className="join">
                                                    <input
                                                        type="number"
                                                        placeholder="Taban Fiyat"
                                                        className="input input-bordered join-item w-1/2"
                                                        value={formData.productData.basePrice}
                                                        onChange={(e) => handleInputChange('productData', 'basePrice', e.target.value)}
                                                    />
                                                    <input
                                                        disabled={formData.productData.premiumProduct === false}
                                                        type="number"
                                                        placeholder="Tam Fiyat"
                                                        className="input input-bordered join-item w-1/2"
                                                        value={formData.productData.fullPrice}
                                                        onChange={(e) => handleInputChange('productData', 'fullPrice', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-4 animate-fade-right">
                                        <h2 className="text-2xl font-bold pb-8">Fotoğraflar</h2>

                                        <div className="flex flex-col items-center justify-center">
                                            {/* {formData.photos.map((photo, index) => (
                                                <div
                                                    key={index}
                                                    className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-base-200 transition-colors"
                                                >
                                                    {photo ? (
                                                        <>
                                                            <img
                                                                src={photo.url}
                                                                alt={`Fotoğraf ${index + 1}`}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <button
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition"
                                                                onClick={() => handlePhotoDelete(index)}
                                                            >
                                                                ✕
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <label htmlFor="photo-input" className="text-center p-4">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                className="w-8 h-8 mx-auto mb-2 opacity-50"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 4v16m8-8H4"
                                                                    className="stroke-current text-gray-500"
                                                                />
                                                            </svg>
                                                            <p className="text-sm text-gray-500">Fotoğraf {index + 1}</p>
                                                        </label>
                                                    )}
                                                </div>
                                            ))} */}

                                            {
                                                formData.varyants.map((combination, key) => (
                                                    <div key={key} className='relative flex py-16 flex-wrap gap-x-2 items-center justify-center'>
                                                        <p className='text-md absolute top-0 left-0 flex items-start justify-center  font-bold  '>{combination.color.name + "/" + combination.fabric.name + "/"}
                                                            <img src={combination.pattern.img} className='w-16 h-16 -translate-y-1/3' />

                                                        </p>
                                                        {combination.imgs.map((photo, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-base-200 transition-colors"
                                                            >
                                                                {photo ? (
                                                                    <>
                                                                        <img
                                                                            src={photo.url}
                                                                            alt={`Fotoğraf ${index + 1}`}
                                                                            className="w-24 h-24 object-cover rounded-lg"
                                                                        />
                                                                        <button
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition"
                                                                            onClick={() => handlePhotoDelete(index,key)}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <label htmlFor={`photo-input${key}`} className="text-center p-4">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            className="w-8 h-8 mx-auto mb-2 opacity-50"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                d="M12 4v16m8-8H4"
                                                                                className="stroke-current text-gray-500"
                                                                            />
                                                                        </svg>
                                                                        <p className="text-sm text-gray-500">Fotoğraf {index + 1}</p>
                                                                    </label>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <input
                                                            type="file"
                                                            id={`photo-input${key}`}
                                                            multiple
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => { handlePhotoChange(e, key) }}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>



                                        <div className="alert alert-info">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                className="stroke-current shrink-0 w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>Maksimum 3 adet fotoğraf yükleyebilirsiniz.</span>
                                        </div>
                                        <LoadingUi isOpen={loading} message={"Ürün ve çeşitleri sisteme yükleniyor lütfen bekleyiniz."}></LoadingUi>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                {currentStep == 1 && (
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => { document.getElementById("modal_product_add").close() }}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Vazgeç
                                    </button>
                                )}
                                {currentStep > 1 && (
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Geri
                                    </button>
                                )}

                                {currentStep < steps.length ? (
                                    <button
                                        className="btn btn-primary ml-auto"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                    >
                                        İleri <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                ) : (
                                    <button onClick={handleSave} type='submit' className="btn btn-success ml-auto">
                                        <Save className="w-4 h-4 mr-2" /> Kaydet
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );






}