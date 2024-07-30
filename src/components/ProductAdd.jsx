import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { addProduct, getAllFabrics, getCategories, getColors, getPatterns, getProductByProductId } from '../firebase'
import { Form, Formik } from 'formik'
import Input from './Input'
import classNames from 'classnames'
import SelectionList from '../pages/DevDash/Pages/Components/SelectionList'


export default function ProductAdd({ productStateChange }) {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedFabric, setSelectedFabric] = useState(null)
    const [selectedPattern, setSelectedPattern] = useState(null)

    const [categories, setCategories] = useState([])
    const [colors, setColors] = useState([])
    const [fabrics, setFabrics] = useState([])
    const [patterns, setPatterns] = useState([])

    const [productStateChanged, setProductStateChanged] = useState()



    const handleSelectCategoryChange = (selected) => {
        setSelectedCategory(selected)
    }

    const handleSelectColorChange = (selected) => {
        setSelectedColor(selected)
    }

    const handleSelectFabricChange = (selected) => {
        setSelectedFabric(selected)
    }

    const handleSelectPatternChange = (selected) => {
        setSelectedPattern(selected)
    }

    const categoryReaction =useCallback(
      () => {
        getCategories().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                // console.log(doc.data())
                setCategories(prevState => [...prevState, data])
            })
        })
      },
      [],
    )
    

    const colorReaction = () => {
        getColors().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                // console.log(doc.data())
                setColors(prevState => [...prevState, data])
            })
        })


    }


    const fabricReaction = () => {
        getAllFabrics().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                // console.log(doc.data())
                setFabrics(prevState => [...prevState, data])
            })
        })

    }


    const patternReaction = () => {
        getPatterns().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                // console.log(doc.data())
                setPatterns(prevState => [...prevState, data])
            })
        })


    }


    useEffect(() => {
        categoryReaction();
        colorReaction();
        fabricReaction();
        patternReaction();

    }, [categoryReaction])

    const handleSubmit = async (values, actions) => {

        await addProduct(values.productName, values.price, selectedCategory, selectedColor, selectedFabric, selectedPattern).then(res => {
            let productId = res.id
            getProductByProductId(productId).then(res => {
                if (productStateChange) {
                    setProductStateChanged({ data: res, productId: productId })
                }
            })

        })
        setisActive(false);

    }

    useEffect(() => {
        if (productStateChange) {
            productStateChange(productStateChanged);
        }
    }, [isActive, productStateChanged,productStateChange])

    return (
        <div>
            {user && <div className='flex items-center justify-center gap-x-2'>
                <button type='button' onClick={() => { setisActive(true) }} className='bg-brandGray active:scale-90 transition-all text-brandWhite hover:bg-brandGreen py-2 px-6 rounded-md'>Ürün Ekle</button>
            </div>}

            {
                isActive === true && <div className='fixed top-0 animate-fade left-0 h-screen w-full  z-20'>
                    <div className='h-full w-full flex items-center justify-center '>
                        <div className='relative flex flex-col items-center pb-8 bg-gradient-to-b from-neutral to-base-100 shadow-2xl  rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                            <strong className='text-3xl font-semibold mt-8'>Ürün bilgileri</strong>
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
                                            <div className='flex flex-col items-center justify-center w-48 gap-2'>
                                                <Input type="text" name="productName" className='input input-bordered rounded-md w-full max-w-xs ' label='Ürün Adı' />
                                                <Input type="number" name="price" className='input input-bordered rounded-md w-full max-w-xs ' label={values.price.length === 0 ? 'Fiyat' : '₺'} />
                                                <SelectionList definition={'Kategori'} data={categories} onSelectionChange={handleSelectCategoryChange}></SelectionList>
                                                <SelectionList definition={'Renk'} data={colors} onSelectionChange={handleSelectColorChange}></SelectionList>
                                                <SelectionList definition={'Kumaş'} data={fabrics} onSelectionChange={handleSelectFabricChange}></SelectionList>
                                                <SelectionList definition={'Desen'} data={patterns} onSelectionChange={handleSelectPatternChange}></SelectionList>


                                            </div>
                                            <div className='flex items-center justify-center gap-x-4'>
                                                {
                                                    selectedCategory && <button type='submit' disabled={selectedCategory.id === undefined || values.productName.length === 0 || values.price.length === 0} className={classNames({
                                                        'px-6 py-1  md:bg-brandGray rounded-md transition-all active:scale-90': true,
                                                        ' md:hover:bg-green-600': selectedCategory.id !== undefined && values.productName.length !== 0 && values.price.length !== 0,
                                                        'opacity-25': selectedCategory.id === undefined || values.productName.length === 0 || values.price.length === 0
                                                    })}>Ürün Ekle</button>
                                                }
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
