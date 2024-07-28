import React, { Fragment, useEffect, useState } from 'react'
import baseImage from '../materials/baseImages/420x260.webp'
import { downloadImage } from '../firebase';
import classNames from 'classnames';


export default function ListenImages({productId,target}) {
    const [image, setImage] = useState(null);
    const tg=target;

    const listen = () => {
        downloadImage(tg,productId).then((res)=>{
            setImage(res)
        })
    }

    useEffect(() => {
        listen()
    }, [productId])

    return (
        <Fragment>
            {
                image ==null?
                <span className=" rounded-t-2xl object-center  h-48  block loading loading-dots loading-lg"></span> :
                <img alt="ecommerce" className={classNames({
                    "object-cover rounded-t-2xl object-center w-full h-48  block":true,
                })} src={image!=null ? image:""} />

            }
           
        </Fragment>
    )
}
