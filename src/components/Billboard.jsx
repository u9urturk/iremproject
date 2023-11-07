import React, { useEffect, useState } from 'react'
import { downloadImageBilboard, uploadImageBilboard } from '../firebase';

export default function Billboard() {

  const [file, setFile] = useState(null)
  const [images, setImages] = useState([]);

  const updateImage = () => {
    if (file != null) {
      uploadImageBilboard(file[0]);
      setFile(null);
    }
  }




  const listen = () => {
    downloadImageBilboard().then((res) => {
      setImages(res);
    })
  }

  useEffect(() => {
    listen()
  }, [])



  useEffect(() => {
    updateImage()
  }, [file])
  return (
    <div className="w-full w-max-[calc(100%-200px)] h-[600px] carousel rounded-box">
      {/* <button className='h-8 w-12 bg-red'><input accept='image/jpeg/png' type='file' multiple onChange={((e) => { setFile(e.target.files) })} className='cursor-pointer hover:scale-125 active:scale-100 transition-all ' title='Görsel Güncelle'></input></button> */}
      {
        images.map((image, key) => {
          return <div key={key} className="carousel-item w-full">
            <img src={image} className="w-full" alt="Tailwind CSS Carousel component" />
          </div>
        })
      }

    </div>
  )
}
