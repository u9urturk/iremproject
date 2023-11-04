import React, { Fragment, useEffect, useState } from 'react'
import baseImage from '../materials/baseImages/420x260.webp'
import { downloadImage } from '../firebase';


export default function ListenImages({productId}) {
    const [image, setImage] = useState(null);

    const listen = () => {
        downloadImage(productId).then((res)=>{
            setImage(res)
        })
    }

    useEffect(() => {
        listen()
    }, [productId])

    return (
        <Fragment>
            <img alt="ecommerce" class="object-cover rounded-t-2xl object-center w-full h-24 md:h-56 block" src={image!=null ? image:baseImage} />
        </Fragment>
    )
}
