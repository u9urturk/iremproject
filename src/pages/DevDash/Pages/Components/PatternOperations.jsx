
import { React, useEffect, useState } from 'react'
import '../../../../Modal.css'
import "../../../../ScrollStyle.css"
import { Form, Formik } from 'formik';
import Input from '../../../../components/Input.jsx';
import classNames from 'classnames';
import { addPattern, deletePatternByPatternId, getImgUrl, getPatterns, updatePattern } from '../../../../firebase.js';
import { useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { Timestamp } from 'firebase/firestore';
import VerificationModal from '../../../../components/VerificationModal.jsx';
import { toast } from 'react-toastify';


export default function PatternOperations() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)
    const [patterns, setPatterns] = useState([
    ]);
    const [formData, setFormData] = useState(() => Array(3).fill(null));
    const [selectedPattern, setSelectedPattern] = useState()
    const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)


    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const currentPhotos = formData.filter((photo) => photo !== null);
        const remainingSlots = 3 - currentPhotos.length;

        if (files.length > remainingSlots) {
            toast.warning(`Maksimum ${remainingSlots} fotoğraf daha yükleyebilirsiniz.`);
            return;
        }

        const newPhotos = files.slice(0, remainingSlots).map((file) => ({
            file,
            url: URL.createObjectURL(file), // Önizleme için URL oluştur
        }));

        setFormData((prevFormData) => {
            const updatedPhotos = [...prevFormData];
            let i = 0;
            for (let j = 0; j < updatedPhotos.length; j++) {
                if (updatedPhotos[j] === null && i < newPhotos.length) {
                    updatedPhotos[j] = newPhotos[i];
                    i++;
                }
            }
            return updatedPhotos;
        });
    };

    const handleUpdatePhotoChange = (e, index, id) => {
        const file = e.target.files[0];
        const selectedPattern = patterns.find(tg => (tg.id === id))

        const updatedState = (url) => {

            const updatedUrls = [...selectedPattern.urls]; // Eski URL'lerin bir kopyasını al
            updatedUrls[index] = url; // Belirtilen index'i güncelle
            return updatedUrls;
        }

        getImgUrl(id, file)
            .then((url) => {
                const updatedUrls = updatedState(url);
                updatePattern(id, updatedUrls).then(() => {
                    setPatterns((prevPatterns) => {
                        const updatedPatterns = [...prevPatterns]
                        const updatedIndex = prevPatterns.findIndex(tg => (tg.id === id))
                        updatedPatterns[updatedIndex].urls = updatedState(url);
                        return updatedPatterns;

                    })
                })
            })



    };



    const getUrls = () => {
        return new Promise((resolve, reject) => {
            try {
                const urls = Array(3).fill(null);
                let i = 0;
                formData.forEach((form) => {
                    if (form?.url) {
                        urls[i] = form.url
                        i++
                        return;
                    }
                    i++
                });
                resolve(urls);
            } catch (error) {
                reject(error);
            }
        });
    };

    const handleSubmit = async (values, actions) => {
        getUrls()
            .then((urls) => {
                addPattern({ patternName: values.patternName, files: formData }).then(res => {
                    if (res) {
                        setPatterns(prevState => [...prevState, { id: res, patternName: values.patternName, urls, creationTime: new Date().toLocaleString() }]);
                        setisActive(false);
                    }
                })
            })
            .catch((error) => {
                console.error("Hata oluştu:", error);
            });


    }





    const deleteSelectedPattern = () => {
        deletePatternByPatternId(selectedPattern).then(res => {
            setPatterns(patterns.filter(pattern => pattern.id !== selectedPattern.id))
        })
    }

    const verificationModalClose = () => {
        setisVerificationModalOpen(false);
        resetSelectedPattern();
    }

    const resetSelectedPattern = () => {
        setSelectedPattern(null);
    }

    const handlePhotoDelete = (index, type, key, patternId) => {
        switch (type) {
            case "input":
                setFormData((prevFormData) => {
                    const updatedPhotos = [...prevFormData];
                    updatedPhotos[index] = null; // Fotoğrafı kaldır
                    return updatedPhotos
                });
                break;
            case "list":
                const updatedUrls = patterns[key].urls;
                updatedUrls[index] = null;
                updatePattern(patternId, updatedUrls)
                    .then(() => {
                        setPatterns((prevPatterns) => {
                            const updatedPhotos = [...prevPatterns];
                            updatedPhotos[key].urls[index] = null; // Fotoğrafı kaldır
                            toast.success("Görsel başarıyla silindi.")
                            return updatedPhotos

                        });
                    })

                break;

            default:
                break;
        }
    }

    const getAllPatternReaction = () => {
        getPatterns().then(res => {
            res.forEach(async (doc) => {
                //FireBase zaman dönüşümü !! 
                const fbts = new Timestamp(doc.data().creationTime.seconds, doc.data().creationTime.nanoseconds)
                const fbtsUpdate = new Timestamp(doc.data().updateTime.seconds, doc.data().updateTime.nanoseconds)

                const date = fbts.toDate();
                const dateUpdate = fbtsUpdate.toDate();
                const readableDate = date.toLocaleString();
                const readableDateUpdate = dateUpdate.toLocaleString();




                setPatterns(prevState => [...prevState, {
                    id: doc.id, patternName: doc.data().name,
                    urls: doc.data().imgsUrl === undefined ? Array(3).fill(null) : doc.data().imgsUrl,
                    creationTime: readableDate,
                    updateTime: readableDateUpdate
                }])
            })
        })
    }

    useEffect(() => {
        getAllPatternReaction()
    }, [])
    return (
        <div className='flex  animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards w-full h-full flex-col items-center justify-center'>
            <div className='flex flex-col w-full h-1/2 gap-y-8 items-center justify-center'>
                <div className='flex w-full  items-start justify-between '>
                    <h1 className='text-2xl font-semibold'>
                        Nakış İşlemleri
                    </h1>
                    {user && <div className='flex items-center justify-center gap-x-2'>
                        <button type='button' onClick={() => { setisActive(true) }}
                            className='bg-brandGray active:scale-90 transition-all text-brandWhite hover:bg-brandGreen
                          py-2 px-6 rounded-md'>Nakış Ekle</button>
                    </div>}

                    {
                        isActive === true && <div className='fixed top-0 animate-fade left-0 h-screen w-full z-10  backdrop-blur-sm'>
                            <div className='h-full w-full flex items-center justify-center '>
                                <div className=' flex flex-col items-center pb-8  bg-gradient-to-b from-neutral to-base-100 shadow-2xl rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                                    <div className='flex items-center justify-center gap-x-3'>
                                        <div className='space-x-1'>
                                            <strong className='text-2xl font-medium font-serif tracking-widest'>Nakış bilgileri</strong>


                                        </div>
                                    </div>
                                    <Formik
                                        initialValues={{
                                            patternName: '',
                                        }}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values }) => (
                                            <Form>
                                                <div className="flex flex-col items-center justify-center gap-y-3">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Input
                                                            type="text"
                                                            name="patternName"
                                                            className="p-2 focus:outline-brand-color w-48 text-base rounded-md transition-all h-10 outline-none hover:text-sm"
                                                            label="Nakış Adı"
                                                        />
                                                        <div className="flex items-center justify-center pt-8 px-4 gap-x-2">
                                                            {formData?.map((photo, index) => (
                                                                <div
                                                                    key={`photo-${index}`} // Benzersiz key ataması
                                                                    className="relative aspect-square w-28 h-28 cursor-crosshair rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-base-200 transition-colors"
                                                                >
                                                                    {photo ? (
                                                                        <>
                                                                            <img
                                                                                src={photo.url}
                                                                                alt={`Fotoğraf ${index + 1}`}
                                                                                className="w-full h-full object-cover rounded-lg"
                                                                            />
                                                                            <div
                                                                                className="absolute top-1 right-1 cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition"
                                                                                onClick={() => handlePhotoDelete(index, 'input')}
                                                                            >
                                                                                ✕
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <label
                                                                            htmlFor="files_input"
                                                                            className="text-center cursor-crosshair p-4"
                                                                        >
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
                                                                            <p className="text-sm text-gray-500">
                                                                                Fotoğraf {index + 1}
                                                                            </p>
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <input
                                                            multiple
                                                            onChange={handlePhotoChange}
                                                            type="file"
                                                            id="files_input"
                                                            name="file"
                                                            className="hidden"
                                                        />
                                                    </div>

                                                    <div className="flex pt-10 items-center justify-center gap-x-4">
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                values.patternName.length === 0 || !formData.some((photo) => photo !== null)
                                                            }
                                                            className={classNames({
                                                                'px-6 py-1 md:bg-brandGray rounded-md transition-all active:scale-90': true,
                                                                'md:hover:bg-green-600': values.patternName.length !== 0 && formData.some((photo) => photo !== null),
                                                                'opacity-25': values.patternName.length === 0 || !formData.some((photo) => photo !== null),
                                                            })}
                                                        >
                                                            Nakış Ekle
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setisActive(false);
                                                            }}
                                                            className="px-6 py-1 bg-red-600 bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-red-600 transition-all active:scale-90"
                                                        >
                                                            Vazgeç
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    }

                </div>
                <div className='w-full'>
                    <div className="stats shadow flex flex-col gap-y-8 md:gap-y-0 md:flex-row">

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title">Nakış Tipi Sayısı</div>
                            <div className="stat-value">{patterns.length}</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div className="stat-title">En Çok Tercih Edilen Nakış Tipi</div>
                            <div className="stat-value">4,200</div>
                            <div className="stat-desc">↗︎ 400 (22%)</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">En Az Tercih Edilen Nakış Tipi</div>
                            <div className="stat-value">1,200</div>
                            <div className="stat-desc">↘︎ 90 (14%)</div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='h-1/2 w-full flex flex-col mt-8 gap-y-2 items-start'>
                <h1 className='text-2xl font-semibold '>
                    Nakışlar
                </h1>
                <div className="overflow-scroll w-full h-auto">
                    <table className="table table-md table-pin-rows table-pin-cols">
                        <thead >
                            <tr>
                                <td>Nakış Adı</td>
                                <td>Oluşturulma Tarihi</td>
                                <td>Güncellenme Tarihi</td>
                                <td>Görseller</td>
                                <td className='flex items-center justify-center'>Operasyonlar</td>
                            </tr>
                        </thead>
                        <tbody>
                            {patterns.map((pattern, key) => {

                                return (
                                    <tr key={key} className='hover:scale-95 transition-all hover:cursor-pointer hover:opacity-90'>
                                        <td onClick={() => { setisVerificationModalOpen(true); setSelectedPattern(pattern) }}>{pattern.patternName}</td>
                                        <td>{pattern.creationTime}</td>
                                        <td>{pattern.updateTime}</td>
                                        <td className="w-full flex items-start justify-start gap-x-2 gap-y-1">
                                            {patterns.length > 0 && pattern.urls?.map((url, index) => {
                                                const inputId = `file_input_${pattern.id}_${index}`;
                                                return (
                                                    <div key={index} className="relative aspect-square w-28 h-28 cursor-crosshair rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-base-200 transition-colors">
                                                        {url !== null ? (
                                                            <div className='group'>
                                                                <img
                                                                    src={url}
                                                                    alt={`Fotoğraf ${index}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                                <div
                                                                    className="absolute hidden group-hover:flex top-1 right-1 cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 items-center justify-center shadow-md hover:bg-red-600 transition"
                                                                    onClick={() => handlePhotoDelete(index, "list", key, pattern.id)}
                                                                >
                                                                    ✕
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <label htmlFor={inputId} className="text-center cursor-crosshair p-4">
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
                                                        <input
                                                            multiple
                                                            onChange={(e) => handleUpdatePhotoChange(e, index, pattern.id)}
                                                            type="file"
                                                            id={inputId}
                                                            name={`file_${pattern.id}_${index}`}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </td>
                                        <td >
                                            <div onClick={() => { setisVerificationModalOpen(true); setSelectedPattern(pattern) }}
                                                className=' flex items-center justify-center gap-x-2 hover:scale-125 transition-all' >
                                                <AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                        </td>
                                    </tr>)

                            })}




                        </tbody>

                    </table>


                </div>

            </div>


            {selectedPattern && <VerificationModal isActive={isVerificationModalOpen} onClose={verificationModalClose}
                trueOperation={deleteSelectedPattern} ></VerificationModal>}

        </div>
    )

}
