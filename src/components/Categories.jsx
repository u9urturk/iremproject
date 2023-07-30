import React, { Fragment, useEffect, useState } from 'react'
import { addCategory, getCategories } from '../firebase';

export default function Categories() {
    const getCategoriesBase = getCategories();
    const [categories, setCategories] = useState([])

    const categoryReaction = () => {
        getCategoriesBase.then(res => {
            res.forEach((doc) => {
                // console.log(doc.data())
                setCategories(prevState => [...prevState, doc.data()])
            })
        })
    }

    const handleop = () => {
        addCategory("deneme")
    }

    useEffect(() => {
        categoryReaction()
    }, [])

    if (categories.length == 0) {
        return (
            <div className='py-1 px-2'>Yükleniyor ...</div>
        )
    } else if (categories.length > 0) {
        return (
            <Fragment>

                {categories.map((data, key) => {

                    return <div key={key} className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>{data.categoryName}</div>

                })}
                <button onClick={handleop}>ekle </button>
            </Fragment>
        )
    }
}
