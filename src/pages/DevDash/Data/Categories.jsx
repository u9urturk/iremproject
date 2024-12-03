import React, { useCallback, useEffect, useState } from 'react'
import VerificationModal from '../../../components/VerificationModal';
import CategoryUpdate from '../../../components/CategoryUpdate';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import { Timestamp } from 'firebase/firestore';
import { deleteCategoryByCategoryId, getCategories } from '../../../firebase/categoryService';

export default function Categories({selectCategory}) {
    const [categories, setCategories] = useState([])
    const [currentCategory, setcurrentCategory] = useState(false)
    const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)
    const [isCategoryUpdateModalOpen, setisCategoryUpdateModalOpen] = useState(false)


    const verificationModalClose = () => {
        setisVerificationModalOpen(false);
    }

    const categoryUpdateModalClose = () => {
        setisCategoryUpdateModalOpen(false);
    }

    useEffect(() => {
      if(selectCategory !== null && selectCategory !== undefined){
        categoryChangedOperation(selectCategory)
      }
    }, [selectCategory])

    const categoryChangedOperation = async (select) => {
        try {
        
            let data = {
                id:select.id,
                name:select.name,
                creationTime:select.creationTime
            };

            setCategories(prevState => [...prevState, data]);
        } catch (error) {
            console.error("Error in categoryChangedOperation method!:", error);
        }
    }

    

    const categoryReaction = useCallback(
      () => {
        getCategories().then(res => {
            res.forEach(async (doc) => {
                //FireBase zaman dönüşümü !! 
                const fbts = new Timestamp(doc.data().creationTime.seconds, doc.data().creationTime.nanoseconds)
                const date = fbts.toDate();
                const readableDate = date.toLocaleString();

                setCategories(prevState => [...prevState, { id: doc.id, name: doc.data().name, creationTime: readableDate }])
            })
        })
      },
      [],
    )
    

    const selectCurrentCategory = (selectedCurrentCategory, type) => {
        if (type === "delete") {
            setisVerificationModalOpen(true);
        } else {
            setisCategoryUpdateModalOpen(true);
        }
        setcurrentCategory(selectedCurrentCategory);
    }

    const deleteCategory = () => {
        deleteCategoryByCategoryId(currentCategory).then(res => {
            if (res === true) {
                setCategories(categories.filter(category=>category.id !== currentCategory.id));
                setisVerificationModalOpen(false);
            }
        })
    }


    useEffect(() => {
        categoryReaction()
    }, [categoryReaction])

    return (
        <div className="overflow-scroll w-full h-auto">
            <table className="table table-md table-pin-rows table-pin-cols">
                <thead >
                    <tr>
                        <td>Kategori</td>
                        <td>Son Güncellenme Tarihi</td>
                        <th>Operasyonlar</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((data, key) => {

                        return <tr key={key} className='hover:scale-95 transition-all hover:cursor-pointer hover:opacity-90'>
                            <td>{data.name}</td>
                            <td>{data.creationTime}</td>

                            <td className='flex items-center justify-start flex-row gap-x-4 '>
                                <div onClick={() => { selectCurrentCategory(data, "delete") }} className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={16} color='red'  ></AiOutlineDelete></div>
                                <div onClick={() => { selectCurrentCategory(data, "update") }} className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={16} color='green' ></RxUpdate></div>
                            </td>

                        </tr>

                    })}




                </tbody>

            </table>

            <VerificationModal isActive={isVerificationModalOpen} onClose={verificationModalClose}
                operationName={`${currentCategory.categoryName} isimli kategori silinecek`}
                trueOperation={deleteCategory} ></VerificationModal>

            <CategoryUpdate isActive={isCategoryUpdateModalOpen} onClose={categoryUpdateModalClose} data={currentCategory} ></CategoryUpdate>
        </div>
    )
}
