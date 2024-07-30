import React, { useCallback, useEffect, useState } from 'react'
import { deleteProductByProductId, getCategoryByCategoryId, getProducts, uploadImage } from '../../../firebase';
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import VerificationModal from '../../../components/VerificationModal';

export default function Products(productChanged) {


    const [products, setProducts] = useState([])
    const [file, setFile] = useState(null)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)

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


    const productChangedOperation = async (dataChanged) => {
        if (dataChanged.productChanged && dataChanged.productChanged.data && dataChanged.productChanged.data.categoryId) {
            try {
                const res = await getCategoryByCategoryId(dataChanged.productChanged.data.categoryId);
                const categoryName = res.categoryName;

                let data = {
                    productId: dataChanged.productChanged.productId,
                    categoryName: categoryName,
                    ...dataChanged.productChanged.data
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
                // Ürünleri al
                const products = await getProducts();
                console.log(products)
                // Her ürün için kategori adını güncelle ve veriyi topla
                const updatedProducts = await Promise.all(products.docs.map(async (doc) => {
                    // Kategoriyi al
                    const category = await getCategoryByCategoryId(doc.data().categoryId);
                    // Ürünü güncelle
                    return {
                        productId: doc.id,
                        categoryName: category.categoryName,
                        ...doc.data()
                    };
                }));
                // Ürünleri state'e ayarla
                setProducts(updatedProducts);
            } catch (error) {
                console.error('Error fetching products or categories:', error);
            }
        },
        [] // Bağımlılık dizisi boş çünkü `categoryName`'i bağımlılık dizisinde kullanmak yerine her ürün için güncellenir
    );


    useEffect(() => {
        productReaction()
    }, [productReaction])

    const updateImage = useCallback(
        () => {
            if (currentProduct != null && file != null) {
                uploadImage("productImages", currentProduct, file[0]);
                setCurrentProduct(null);
                setFile(null);
            }
        },
        [currentProduct, file],
    )



    useEffect(() => {
        updateImage()
    }, [file, updateImage])


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
                                <div onClick={() => { setisVerificationModalOpen(true); setCurrentProduct(product) }} className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={18} color='green' ></RxUpdate></div>
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
