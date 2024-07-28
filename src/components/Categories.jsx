import React, { Fragment, useEffect, useState } from 'react'
import { getCategories  } from '../firebase';


export default function Categories() {
    const getCategoriesBase = getCategories();
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

console.log(categories)
    return (
        <Fragment>
            <div className='flex flex-col  gap-y-2 items-center justify-center'>
               {categories.length == 0 && <div className='py-1 px-2'>Yükleniyor ...</div>}

                  
               {categories.length > 0 && <div className='flex items-center justify-center gap-x-2 text-brandWhite'>
                    {categories.map((data, key) => {

                        return <div key={key} className='flex flex-col items-center justify-center gap-y-2'>
                          
                            <div className='btn glass btn-xs sm:btn-sm md:btn-md '>
                                {data.name}
                            </div>
                        </div>

                    })}


                </div>}
            </div>

            
        </Fragment>
    )

}
