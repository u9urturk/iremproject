import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addCategory, login, logout } from '../firebase'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Form, Formik } from 'formik'
import Input from './Input'
import Button from './Button'
import { useModal } from '../Context/ModalContext'

export default function CategoryAdd() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)

    const { isAnyModalOpen, openModal, closeModal } = useModal();

    useEffect(() => {
      if(isActive){
            openModal()
      }else{
            closeModal()
      }
    
      return () => {
        closeModal()
      }
    }, [isActive])

    const handleSubmit = async (values, actions) => {
        addCategory(values.categoryName).then(res=>{
            if(res===true){
                setisActive(false);
            }
        })
    }

    return (
        <div>
            {user && <div className='flex items-center justify-center gap-x-2'>
                <button type='button'  onClick={() => { setisActive(true) }} className='bg-brandGray active:scale-90 transition-all text-brandWhite hover:bg-brandGreen py-2 px-6 rounded-md'>Kategori Ekle</button>
            </div>}

            {
                isActive === true &&  <div className='fixed top-0 left-0 h-screen w-full z-10 animate-fade  backdrop-blur-sm'>
                    <div className='h-full w-full flex items-center justify-center '>
                        <div className='relative flex flex-col items-center pb-8  bg-gradient-to-tl from-[#b7bac3] to-base-100 rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                            <div onClick={() => { setisActive(false) }}><AiOutlineCloseCircle className='absolute top-4 right-4 text-white transition-all cursor-pointer hover:scale-75' size={34}></AiOutlineCloseCircle></div>
                            <div className='flex items-center justify-center gap-x-3'>
                                <div className='space-x-1'>
                                    <strong className='text-2xl font-medium font-serif tracking-widest'>Kategori bilgileri</strong>
                                   

                                </div>
                            </div>
                            <Formik
                                initialValues={{
                                    categoryName: ''
                            
                                }}

                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, values, isValid, dirty }) => (
                                    <Form>
                                        <div className='flex flex-col items-center justify-center gap-y-3'>
                                            <Input type="text" name="categoryName" className='p-2  focus:outline-brand-color  w-48 text-base rounded-md  transition-all h-10 outline-none hover:text-sm ' label='Kategori Adı' />
                                            <Button type='submit' disabled={!isValid || !dirty || isSubmitting}>Ekle</Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
