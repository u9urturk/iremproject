import React, { useEffect, useState } from 'react'
import { deleteCategoryByCategoryId, getCategories } from '../../../firebase';
import VerificationModal from '../../../components/VerificationModal';
import CategoryUpdate from '../../../components/CategoryUpdate';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'

export default function Categories() {
    const getCategoriesBase = getCategories();
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



    const categoryReaction = () => {
        getCategoriesBase.then(res => {
            res.forEach((doc) => {
                let data = { categoryId: doc.id, ...doc.data() }
                // console.log(doc.data())
                setCategories(prevState => [...prevState, data])
            })
        })

    }

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
                setisVerificationModalOpen(false);
            }
        })
    }


    useEffect(() => {
        categoryReaction()
    }, [])

    return (
        <div className="overflow-scroll w-full h-auto">
            <table className="table table-md table-pin-rows table-pin-cols">
                <thead >
                    <tr>
                        <th></th>
                        <td>Kategori</td>
                        <td>Ürün Sayısı</td>
                        <td>Son Güncellenme Tarihi</td>
                        <td>Favori Ürün</td>
                        <td>Günlük İncelenme Sayısı</td>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((data, key) => {

                        return <tr key={key} className='hover:scale-95 transition-all hover:cursor-pointer hover:opacity-90'>
                            <th>1</th>
                            <td>{data.name}</td>
                            <td>25</td>
                            <td>24.01.2024</td>
                            <td>Mavi Desenli Havlu</td>
                            <td>300</td>
                            <td>
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
