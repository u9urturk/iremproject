import React, { useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { addProduct, getCategories } from '../firebase'
import { Form, Formik } from 'formik'
import Input from './Input'
import classNames from 'classnames'
import { Listbox, Transition } from '@headlessui/react'
import { PiCaretUpDownLight } from 'react-icons/pi'
import { BsCheck } from 'react-icons/bs'


export default function ProductAdd() {
    const [isActive, setisActive] = useState(false)
    const getCategoriesBase = getCategories();
    const user = useSelector(state => state.auth.user)
    const [selected, setSelected] = useState({
        categoryName: "Kategori Seçin"
    })
    const [categories, setCategories] = useState([])



    const categoryReaction = () => {
        getCategoriesBase.then(res => {
            res.forEach((doc) => {
                let data = { categoryId: doc.id, ...doc.data() }
                // console.log(doc.data())
                setCategories(prevState => [...prevState, data])
            })
        })
    }

    useEffect(() => {
        categoryReaction()
    }, [])


    const handleSubmit = async (values, actions) => {
        
        addProduct(selected.categoryId ,values.productName,values.price).then(res => {
            if (res === true) {
                setisActive(false);
            }
        })
    }

    return (
        <div>
            {user && <div className='flex items-center justify-center gap-x-2'>
                <button type='button' onClick={() => { setisActive(true) }} className='bg-brandGray active:scale-90 transition-all text-brandWhite hover:bg-brandBlue py-1 px-6 rounded-md'>Ürün Ekle</button>
            </div>}

            {
                isActive === true && <div className='fixed top-0 animate-fade left-0 h-screen w-full z-10  backdrop-blur-sm'>
                    <div className='h-full w-full flex items-center justify-center '>
                        <div className='relative flex flex-col items-center pb-8  bg-gradient-to-tl from-[#b7bac3] to-bg-base-300 rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                            <div className='flex items-center justify-center gap-x-3'>
                                <div className='space-x-1'>
                                    <strong className='text-2xl font-medium font-serif tracking-widest'>Ürün bilgileri</strong>


                                </div>
                            </div>
                            <Formik
                                initialValues={{
                                    productName: '',
                                    price: ''

                                }}

                                onSubmit={handleSubmit}
                            >
                                {({ values }) => (
                                    <Form>
                                        <div className='flex flex-col items-center justify-center gap-y-3'>
                                            <div className='w-full h-auto' >
                                                <Listbox value={selected} onChange={setSelected}>
                                                    <div className="relative mt-1">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                            <span className="block truncate">{selected.categoryName}</span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <PiCaretUpDownLight
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute mt-1 z-[1] max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {categories.map((data, key) => (
                                                                    <Listbox.Option
                                                                        key={key}
                                                                        className={({ active }) =>
                                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                        value={data}
                                                                    >
                                                                        {({ selected }) => (
                                                                            <>
                                                                                <span
                                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                                        }`}
                                                                                >
                                                                                    {data.categoryName}
                                                                                </span>
                                                                                {selected ? (
                                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                                        <BsCheck className="h-5 w-5" aria-hidden="true" />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </Listbox>
                                            </div>
                                            <Input type="text" name="productName" className='p-2  focus:outline-brand-color  w-48 text-base rounded-md  transition-all h-10 outline-none hover:text-sm ' label='Ürün Adı' />
                                            <Input type="number" name="price" className='p-2  focus:outline-brand-color  w-48 text-base rounded-md  transition-all h-10 outline-none hover:text-sm ' label={values.price.length == 0 ? 'Fiyat' : '₺'} />
                                            <div className='flex items-center justify-center gap-x-4'>
                                                <button type='submit' disabled={selected.categoryId == undefined || values.productName.length == 0 || values.price.length == 0} className={classNames({
                                                    'px-6 py-1  md:bg-brandGray rounded-md transition-all active:scale-90': true,
                                                    ' md:hover:bg-green-600': selected.categoryId != undefined && values.productName.length != 0 && values.price.length != 0,
                                                    'opacity-25': selected.categoryId == undefined || values.productName.length == 0 || values.price.length == 0
                                                })}>Ürün Ekle</button>
                                                <button typeof='button' onClick={() => { setisActive(false) }} className='px-6 py-1 bg-red-600 bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-red-600 transition-all active:scale-90'>Vazgeç</button>
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
    )
}
