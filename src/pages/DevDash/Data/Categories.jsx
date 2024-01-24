import React, { useEffect, useState } from 'react'
import { getCategories } from '../../../firebase';

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
                            <td>{data.categoryName}</td>
                            <td>25</td>
                            <td>24.01.2024</td>
                            <td>Mavi Desenli Havlu</td>
                            <td>300</td>
                        </tr>

                    })}




                </tbody>

            </table>
        </div>
    )
}
