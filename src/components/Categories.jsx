import React, { Fragment, useEffect, useState } from 'react'
import { addCategory, deleteCategoryByCategoryId, getCategories } from '../firebase';
import { useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import CategoryAdd from './CategoryAdd';
import VerificationModal from './VerificationModal';
import CategoryUpdate from './CategoryUpdate';

export default function Categories() {
    const getCategoriesBase = getCategories();
    const [categories, setCategories] = useState([])
    const [currentCategory, setcurrentCategory] = useState(false)
    const user = useSelector(state => state.auth.user)
    const [isVerificationModalOpen ,setisVerificationModalOpen ] = useState(false)
    const [isCategoryUpdateModalOpen ,setisCategoryUpdateModalOpen ] = useState(false)


    const verificationModalClose = ()=>{
        setisVerificationModalOpen(false);
    }

    const categoryUpdateModalClose = ()=>{
        setisCategoryUpdateModalOpen(false);
    }

    const selectCurrentCategory = (selectedCurrentCategory,type)=>{
        if(type==="delete"){
            setisVerificationModalOpen(true);
        }else{
            setisCategoryUpdateModalOpen(true);
        }
        setcurrentCategory(selectedCurrentCategory);
    }

    const deleteCategory=()=>{
        deleteCategoryByCategoryId(currentCategory).then(res=>{
            if(res===true){
                setisVerificationModalOpen(false);
            }
        })
    }

    const categoryReaction = () => {
        getCategoriesBase.then(res => {
            res.forEach((doc) => {
                let data = {categoryId : doc.id,...doc.data()}
                // console.log(doc.data())
                setCategories(prevState => [...prevState, data])
            })
        })
    }

    useEffect(() => {
        categoryReaction()
    }, [])


    
        return (
            <Fragment>
                <div className='flex flex-col  gap-y-2 items-center justify-center'>
                    <CategoryAdd></CategoryAdd>
                    {categories.length == 0 &&<div className='py-1 px-2'>Yükleniyor ...</div>}

                   { categories.length > 0 && <div className='flex items-center justify-center gap-x-2 text-brandWhite'>
                        {categories.map((data,key) => {

                            return <div key={key} className='flex flex-col items-center justify-center gap-y-2'>
                              { user&&data&& <div className='flex items-center justify-center gap-x-2'>
                                    <div onClick={()=>{selectCurrentCategory(data,"delete")}} className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={16} color='red'  ></AiOutlineDelete></div>
                                    <div onClick={()=>{selectCurrentCategory(data,"update")}} className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={16} color='green' ></RxUpdate></div>


                                </div>}
                                <div className='hover:bg-gradient-to-tl from-brandGray to-brandBlue bg-brandGray cursor-pointer transition-all py-1 px-3 rounded-md'>
                                    {data.categoryName}
                                </div>
                            </div>

                        })}


                    </div>}
                </div>

                <VerificationModal isActive={isVerificationModalOpen} onClose = {verificationModalClose} 
                operationName={`${currentCategory.categoryName} isimli kategori silinecek`}
                trueOperation={deleteCategory} ></VerificationModal>

                <CategoryUpdate isActive={isCategoryUpdateModalOpen} onClose={categoryUpdateModalClose} data={currentCategory} ></CategoryUpdate>

            </Fragment>
        )
    
}
