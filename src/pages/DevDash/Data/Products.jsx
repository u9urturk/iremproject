import React, { useCallback, useEffect, useState } from 'react'
import { deleteProductByProductId, getCategoryByCategoryId, getProducts, uploadImage } from '../../../firebase';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import VerificationModal from '../../../components/VerificationModal';
import { RefreshCw } from 'lucide-react';
import { useCategory } from '../../../context/CategoryContext';

export default function Products({ productChanged, totalProducts }) {


    const [products, setProducts] = useState([])
    const [file, setFile] = useState(null)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)
    const [currentQQ, setCurrentQQ] = useState("Sırala")
    const [currentQQCategory, setCurrentQQCategory] = useState("Kategoriler");
    const { categories ,getCategoryNameById } = useCategory();



    useEffect(() => {
        totalProducts(products.length)
    }, [products])

    const quaryList = [
        "Tarihi Göre Artan",
        "Tarihe Göre Azalan",
        "Fiyata Göre Artan",
        "Fiyata Göre Azalan",
        "Ürün Puanına Göre Azalan",
        "Ürün Puanına Göre Artan",
    ]

    const resetFilter = () => {
        setCurrentQQ("Sırala");
        setCurrentQQCategory("Kategoriler");
    }


    useEffect(() => {
        if (productChanged !== undefined && productChanged !== null) {
            productChangedOperation(productChanged);

        }
    }, [productChanged])

    const verificationModalClose = () => {
        setisVerificationModalOpen(false);
    }

    const deleteSelectedProduct = () => {
        deleteProductByProductId(currentProduct).then(res => {
            setProducts(products.filter(e => e.productId !== currentProduct.productId));
            setCurrentProduct(null);
        })
    }


    const productChangedOperation = async () => {
        if (productChanged && productChanged.data && productChanged.data.categoryId) {
            try {
                const res = await getCategoryNameById(productChanged.data.categoryId);
                const categoryName = res;

                let data = {
                    productId: productChanged.productId,
                    categoryName: categoryName,
                    ...productChanged.data
                };

                setProducts(prevState => [...prevState, data]);
            } catch (error) {
                console.error("Error fetching category by categoryId:", error);
            }
        } else {
            console.error("dataChanged or dataChanged.data or dataChanged.data.categoryId is undefined");
        }
    }


    const productReaction = useCallback(
        async () => {
            try {
                const products = await getProducts();
                const updatedProducts = await Promise.all(products.docs.map(async (doc) => {
                    const category = await getCategoryNameById(doc.data().categoryId);
                    return {
                        productId: doc.id,
                        categoryName: category,
                        ...doc.data()
                    };
                }));
                setProducts(updatedProducts);
            } catch (error) {
                console.error('Error fetching products or categories:', error);
            }
        },
        []
    );


    useEffect(() => {
        productReaction()
    }, [productReaction])

    return (
        <div className="overflow-scroll w-full h-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-primary">Ürünler</h2>
                <div>
                    <button onClick={resetFilter} className='btn btn-sm -translate-x-2 hover:bg-primary focus:bg-primary rounded-md'>Sıfırla</button>
                    <div className="dropdown dropdown-left">
                        <div tabIndex={0} role="button" className={`btn btn-sm  rounded px-4 m-1 ${currentQQCategory==="Kategoriler"?"":"bg-secondary"}`}>{currentQQCategory}</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded z-[2] w-52 p-2 shadow">
                            {categories.map((qq, key) => (
                                <li className='transition-all' onClick={() => { setCurrentQQCategory(qq.name) }} key={qq.id}><button className='btn btn-xs hover:bg-secondary focus:bg-secondary rounded-md'>{qq.name}</button></li>
                            ))}
                        </ul>
                    </div>
                    <div className="dropdown dropdown-left">
                        <div tabIndex={0} role="button" className={`btn btn-sm  rounded px-4 m-1 ${currentQQ==="Sırala"?" ":"bg-accent"}`}>{currentQQ}</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded z-[2] w-52 p-2 shadow">
                            {quaryList.map((qq, key) => (
                                <li className='transition-all' onClick={() => { setCurrentQQ(qq) }} key={qq + key}><button className='btn btn-xs hover:bg-accent focus:bg-accent rounded-md'>{qq}</button></li>
                            ))}
                        </ul>
                    </div>
                    <button
                        className="btn btn-sm btn-ghost"
                    >
                        <RefreshCw className=" w-4 h-4" /> Yenile
                    </button>
                </div>
            </div>
            <table className="table table-md table-pin-rows table-pin-cols">
                <thead >
                    <tr>
                        <td>Ürün Adı</td>
                        <td>Kategori</td>
                        <td>Fiyat</td>
                        {/* <td>Görsel</td> */}
                        <th className='flex items-center justify-center'>Operasyonlar</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, key) => {

                        return <tr key={key} className={`hover:cursor-pointer ${(key % 2 === 0) ? "bg-base-200" : ""} `}>
                            <td>{product.productName}</td>
                            <td>{product.categoryName}</td>
                            <td>{product.price} &#x20BA;</td>
                            <td className='flex flex-col items-center justify-center gap-y-2'>
                                <div onClick={() => { setisVerificationModalOpen(true); setCurrentProduct(product) }}
                                    className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'>
                                    <AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                <div className='cursor-pointer hover:scale-125 active:scale-100   transition-all' title='Güncelle'><RxUpdate size={18} color='green' >
                                </RxUpdate></div>
                            </td>

                        </tr>

                    })}




                </tbody>

            </table>

            <VerificationModal isActive={isVerificationModalOpen} onClose={verificationModalClose}
                trueOperation={deleteSelectedProduct} ></VerificationModal>
        </div>
    )
}
