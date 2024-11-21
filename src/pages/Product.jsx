import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getColorByColorId, getCommentsByProductId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId, } from '../firebase';
import { useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import ProductDetail from './uiComponents/ProductDetail';




export default function Product() {
  const user = useSelector(state => state.auth.user)
  const { productId } = useParams();
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState();


  const getProductReaction = useCallback(
    () => {
      getProductByProductId(productId).then(async res => {
        console.log(res)
        const colorPromise = getColorByColorId(res.colorId);
        const fabricPromise = getFabricsByFabricId(res.fabricId);
        const patternPromise = getPatternByPatternId(res.patternId);

        const [color, fabric, pattern] = await Promise.all([colorPromise, fabricPromise, patternPromise]);

        setProduct({
          name: res.productName,
          basePrice: res.basePrice,
          fullPrice: res.fullPrice ? res.fullPrice : null,
          color: color.name,
          fabric: fabric.name,
          pattern: pattern.name,
          rating: Math.round(res.rating),
          explanation: res.explanition
        });
      })
    },
    [productId],
  )



  const getReviewReaction = useCallback(
    () => {
      getCommentsByProductId(productId).then(res => {
        res.forEach(e => {
          setReviews(prevReviews => [...prevReviews, {
            id: e.id,
            customerName: e.customerName,
            comment: e.comment,
            date: new Date(e.date).toLocaleDateString('tr-TR'),
            rating: e.rating

          }]);

        });
      })
    },
    [productId],
  )

  const handleAddToCart = (baseImage) => {
    addToCart(productId, product,quantity,baseImage)
  }

  const updateReviewState = (data) => {
    setReviews(prevReviews => [...prevReviews, data])
  }

  const setQuantityFb = (e)=>{
    setQuantity(e)
  }


  useEffect(() => {
    getProductReaction();
    getReviewReaction();
  }, [getProductReaction, getReviewReaction])



  return (
    <div className='min-h-screen'>
      {product && <ProductDetail productId={productId} quantityFB={setQuantityFb} addCart={handleAddToCart} updateReviewState={updateReviewState} reviews={reviews} user={user} product={product}></ProductDetail>
      }
    </div>
  )

}
