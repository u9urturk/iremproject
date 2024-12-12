import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import ProductDetail from './uiComponents/ProductDetail';
import { getCommentsByProductId } from '../firebase/commentService';
import { getColorByColorId } from '../firebase/colorService';
import { getFabricsByFabricId } from '../firebase/fabricService';
import { getPatternByPatternId } from '../firebase/patternService';
import { getProductByProductId } from '../firebase/productService';
import { showToast } from '../firebase';




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
        try {
          const colorArray = []
          const colorPromise = res.product.varyants.map(varyant => varyant.color).filter(color => {
            if (colorArray.find(cl => cl.id === color.id)) {
              return;
            }
            colorArray.push(color)
          })
          const fabricArray = [];
          const fabricPromise = res.product.varyants
            .map(varyant => varyant.fabric)
            .filter(fabric => {
              if (fabricArray.find(fb => fb.id === fabric.id)) {
                return false;
              }
              fabricArray.push(fabric);
              return true;
            });

          const patternArray = [];
          const patternPromise = res.product.varyants
            .map(varyant => varyant.pattern)
            .filter(pattern => {
              if (patternArray.find(pt => pt.id === pattern.id)) {
                return false;
              }
              patternArray.push(pattern);
              return true;
            });


          const [colors, fabrics, patterns] = await Promise.all([
            Promise.all(colorPromise),
            Promise.all(fabricPromise),
            Promise.all(patternPromise),
          ]);

          setProduct({
            name: res.product.productName,
            basePrice: res.product.basePrice,
            fullPrice: res.product.fullPrice || null,
            colors: colorArray,
            fabrics: fabricArray,
            patterns: patternArray,
            rating: Math.round(res.product.rating),
            explanation: res.product.explanation || 'Ürün açıklaması bulunamadı',
            varyants: res.product.varyants
          });
        } catch (error) {
          console.error("Error fetching product data:", error);
          showToast('error', "Ürün verileri alınırken bir hata oluştu.");
        }
      });
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

  const handleAddToCart = (baseImage, isFullPrice) => {
    addToCart(productId, product, quantity, baseImage, isFullPrice)
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
