import React from 'react'
import Carousel from '../components/Carousel'

export default function Product() {

  return (
    <div className='container px-8 mx-auto text-4xl text-red-900'>
      <section class="py-12">
        <div className="card flex flex-col md:flex-row items-center justify-center lg:card-side bg-base-100 shadow-xl">
          <figure className='w-full  md:w-1/4'>
            <Carousel></Carousel>
          </figure>
          <div className="card-body w-full md:w-3/4">
            <div className='flex flex-col md:flex-row items-center md:justify-between'>
              <h2 className="card-title  text-4xl">Ürün Adı</h2>
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
                <div>Özellik1</div>
                <div>Özellik2</div>
                <div>Özellik3</div>

              </div>
              <div>
                <div>100 TL</div>
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
}
