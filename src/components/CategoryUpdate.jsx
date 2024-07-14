import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { addCategory, updateCategoryByCategoryId } from '../firebase'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Form, Formik } from 'formik'
import Input from './Input'
import Button from './Button'
import { LoginSchema } from '../Validation'
import classNames from 'classnames'

export default function CategoryUpdate({ isActive, onClose, data }) {

    //console.log(data.categoryId)

    const handleSubmit = async (values, actions) => {
        updateCategoryByCategoryId(data.categoryId,values.categoryName).then(res => {
            if (res === true) {
                onClose();
            }
        })
    }

    if (isActive === true) {
        return (
            <div className='fixed top-0 animate-fade left-0 h-screen w-full z-10  backdrop-blur-sm'>
                <div className='h-full w-full flex items-center justify-center '>
                    <div className='relative flex flex-col items-center py-8  bg-gradient-to-tl from-[#b7bac3] to-[#6e77ee]  rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
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
                                        <div className='flex items-center justify-center gap-x-4'>
                                            <button type='submit' disabled={!isValid || !dirty || isSubmitting || !values} className={classNames({
                                                'px-6 py-1  md:bg-brandGray rounded-md transition-all active:scale-90':true,
                                                ' md:hover:bg-green-600':dirty,
                                                'opacity-25':!dirty
                                            })}>Güncelle</button>
                                            <button typeof='button' onClick={() => { onClose() }} className='px-6 py-1 bg-red-600 bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-red-600 transition-all active:scale-90'>Vazgeç</button>
                                        </div>
                                    </div> 
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}
