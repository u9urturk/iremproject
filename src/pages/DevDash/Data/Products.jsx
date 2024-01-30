import React, { useEffect, useState } from 'react'
import { getCategoryByCategoryId, getProducts, uploadImage } from '../../../firebase';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import ListenImages from '../../../components/ListenImages';

export default function Products() {

    const getProductsBase = getProducts();
    const [products, setProducts] = useState([])
    const [file, setFile] = useState(null)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [categoryName, setCategoryName] = useState("")





    const productReaction = () => {
        getProductsBase.then(res => {
            res.forEach(async (doc) => {
                await getCategoryByCategoryId(doc.data().categoryId).then((res) => {
                    setCategoryName(res.categoryName);
                });
                let data = {
                    productId: doc.id,
                    categoryName: categoryName,
                    ...doc.data()
                }


                setProducts(prevState => [...prevState, data])
            })
        })
    }

    useEffect(() => {
        productReaction()
    }, [])

    const updateImage = () => {
        if (currentProduct != null && file != null) {
            uploadImage(currentProduct, file[0]);
            setCurrentProduct(null);
            setFile(null);
        }
    }


    useEffect(() => {
        updateImage()
    }, [file])


    return (
        <div className="overflow-scroll w-full h-auto">
            <table className="table table-md table-pin-rows table-pin-cols">
                <thead >
                    <tr>
                        <th></th>
                        <td>Ürün Adı</td>
                        <td>Stok</td>
                        <td>Fiyat</td>
                        <td>Memnuniyet</td>
                        <td>Günlük İncelenme Sayısı</td>
                        <td>Görsel</td>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, key) => {

                        return <tr key={key} className='hover:scale-95 transition-all hover:cursor-pointer hover:opacity-90'>
                            <th>1</th>
                            <td>{product.productName}</td>
                            <td>25</td>
                            <td>{product.price} &#x20BA;</td>
                            <td>Mavi Desenli Havlu</td>
                            <td>300</td>
                            <td>
                                <div className=' gap-x-2 flex items-center justify-center py-2'>
                                    <input accept='image/jpeg' onClick={() => { setCurrentProduct(product.productId) }} type='file' multiple onChange={((e) => { setFile(e.target.files) })} className='cursor-pointer hover:scale-125 active:scale-100 transition-all ' title='Görsel Güncelle'></input>
                                </div>
                            </td>
                            <td>
                                <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={18} color='green' ></RxUpdate></div>
                            </td>

                        </tr>

                    })}




                </tbody>

            </table>


        </div>
    )
}
