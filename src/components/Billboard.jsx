import React, { useEffect, useState } from 'react'
import { downloadImageBilboard, uploadImageBilboard } from '../firebase';
import { Carousel } from '@material-tailwind/react';

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
    <Carousel autoplay={true} loop={true} autoplayDelay={5000} transition={{ duration: 2 }} className="rounded-xl">
      {
        images.map((image, key) => {
          return <img
            key={key}
            src={image}
            alt={`image + ${key}`}
            className="h-[300px] w-full object-cover"
          />
        })
      }

    </Carousel>

  )
}
