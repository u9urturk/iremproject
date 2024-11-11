import React, { useCallback, useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import { useParams } from 'react-router-dom';
import { addToCart, getColorByColorId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId } from '../firebase';
import ProductRating from '../components/ProductRaiting';
import { IoColorPaletteOutline } from "react-icons/io5";
import { GiRolledCloth } from "react-icons/gi";
import { MdOutlinePattern } from "react-icons/md";
import CustomerReviews from '../components/CustomerReviews';
import { useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import ProductDetail from './uiComponents/ProductDetail';




export default function Product() {
  const user = useSelector(state => state.auth.user)
  const { productId } = useParams();
  const [product, setProduct] = useState(null)
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

  const handleAddToCart = () => {
    addToCart(productId, product)
  }


  useEffect(() => {
    getProductReaction();
  }, [getProductReaction])

  console.log(productId, product)


  if (product) {
    return (

      <ProductDetail product={product}></ProductDetail>

    )
  } else {
    <div>Loading...</div>
  }

}
