import React, { useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import { useParams } from 'react-router-dom';
import { getColorByColorId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId } from '../firebase';

export default function Product() {

  const { productId } = useParams();
  const [product, setProduct] = useState(null)

  const getProductReaction = () => {
    getProductByProductId(productId).then(async res => {
      const colorPromise = getColorByColorId(res.colorId);
      const fabricPromise = getFabricsByFabricId(res.fabricId);
      const patternPromise = getPatternByPatternId(res.patternId);

      const [color, fabric, pattern] = await Promise.all([colorPromise, fabricPromise, patternPromise]);

      setProduct({
        name: res.productName,
        price: res.price,
        color: color.name,
        fabric: fabric.name,
        pattern: pattern.name
      });
    })
  }

  useEffect(() => {
    getProductReaction();
  }, [productId])

  console.log(product)
  if (product) {
    return (
      <div className='container px-8 mx-auto text-4xl text-red-900'>
        <section class="py-12">
          <div className="card flex flex-col md:flex-row items-center justify-center lg:card-side bg-base-100 shadow-xl">
            <figure className='w-full  md:w-1/4'>
              <Carousel productId={productId}></Carousel>
            </figure>
            <div className="card-body w-full md:w-3/4">
              <div className='flex flex-col md:flex-row items-center md:justify-between'>
                <h2 className="card-title  text-4xl">{product.name}</h2>
                <div>
                  <div className="rating gap-1">
                    <input type="radio" name="rating-3" className="mask mask-heart bg-red-400" />
                    <input type="radio" name="rating-3" className="mask mask-heart bg-orange-400" defaultChecked />
                    <input type="radio" name="rating-3" className="mask mask-heart bg-yellow-400" />
                    <input type="radio" name="rating-3" className="mask mask-heart bg-lime-400" />
                    <input type="radio" name="rating-3" className="mask mask-heart bg-green-400" />
                  </div>
                </div>
              </div>
              <p className='text-sm opacity-95 text-brandBlue'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet vitae consectetur sunt cumque expedita nostrum ab molestiae voluptatum sequi. Soluta natus aspernatur qu</p>
              <div className="card-actions w-full justify-between">
                <div className='text-base'>
                  <div>{product.color}</div>
                  <div>{product.fabric}</div>
                  <div>{product.pattern}</div>

                </div>
                <div>
                  <div>{product.price} </div>
                  <button className="btn btn-primary">Sepete Ekle</button>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section class="bg-gray-200 py-12">
          <div class="container mx-auto">
            <h2 class="text-2xl font-bold mb-4 text-center">Customer Reviews</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white rounded-lg p-4 mb-4">
                <h3 class="font-semibold">John Doe</h3>
                <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  convallis risus et massa consectetur, vel ullamcorper arcu ultricies.</p>
              </div>
              <div class="bg-white rounded-lg p-4 mb-4">
                <h3 class="font-semibold">Jane Smith</h3>
                <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  convallis risus et massa consectetur, vel ullamcorper arcu ultricies.</p>
              </div>
              <div class="bg-white rounded-lg p-4 mb-4">
                <h3 class="font-semibold">Michael Johnson</h3>
                <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  convallis risus et massa consectetur, vel ullamcorper arcu ultricies.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  } else {
    return (
      <div className='container flex items-center justify-center h-screen px-8 mx-auto text-4xl text-red-900'>
        <h1>YÜKLENİYOR...</h1>
      </div>
    )
  }
}
