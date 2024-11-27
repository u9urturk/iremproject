import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { downloadImages, getColorByColorId, getCommentsByProductId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId, } from '../firebase';
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
        const colorPromise = getColorByColorId(res.colorId);
        const fabricPromise = getFabricsByFabricId(res.fabricId);
        const patternPromise = getPatternByPatternId(res.patternId);


        const [colors, fabrics, patterns] = await Promise.all([colorPromise, fabricPromise, patternPromise]);
        setProduct({
          name: res.productName,
          basePrice: res.basePrice,
          fullPrice: res.fullPrice || null,
          color: {colorName: colors?.name || 'Unknown Color' },
          fabric: {fabricName: fabrics?.name || 'Unknown Fabric'},
          patterns: {
            patternName: patterns?.name || 'Unknown Pattern', 
            urls: patterns?.imgsUrl?.filter(img => img !== null),
          },
          rating: Math.round(res.rating),
          explanation: res.explanation || 'No explanation provided', 
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
    addToCart(productId, product, quantity, baseImage)
  }

  const updateReviewState = (data) => {
    setReviews(prevReviews => [...prevReviews, data])
  }

  const setQuantityFb = (e) => {
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
