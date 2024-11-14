import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getColorByColorId, getCommentsByProductId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId,  } from '../firebase';
import { useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import ProductDetail from './uiComponents/ProductDetail';




export default function Product() {
  const user = useSelector(state => state.auth.user)
  const { productId } = useParams();
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const { addToCart } = useCart();


  const getProductReaction = useCallback(
    () => {
      getProductByProductId(productId).then(async res => {
        const colorPromise = getColorByColorId(res.colorId);
        const fabricPromise = getFabricsByFabricId(res.fabricId);
        const patternPromise = getPatternByPatternId(res.patternId);

        const [color, fabric, pattern] = await Promise.all([colorPromise, fabricPromise, patternPromise]);

        setProduct({
          name: res.productName,
          basePrice: res.price,
          fullPrice: res.fullPrice ? res.fullPrice : null,
          color: color.name,
          fabric: fabric.name,
          pattern: pattern.name,
          rating: Math.round(res.rating),
          explanation: res.explanation
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

  const handleAddToCart = () => {
    addToCart(productId, product)
  }

  const updateReviewState = (data)=>{
    setReviews(prevReviews=>[...prevReviews,data])
  }


  useEffect(() => {
    getProductReaction();
    getReviewReaction();
  }, [getProductReaction, getReviewReaction])



  if (product) {
    return (

      <ProductDetail productId={productId} updateReviewState={updateReviewState} reviews={reviews} user={user} product={product}></ProductDetail>

    )
  } else {
    <div>Loading...</div>
  }

}
