import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { downloadImage } from '../firebase';
import classNames from 'classnames';


export default function ListenImages({productId,target}) {
    const [image, setImage] = useState(null);
    const tg=target;

    const listen =useCallback(
      () => {
        downloadImage(tg,productId).then((res)=>{
            setImage(res)
        })
      },
      [productId,tg],
    )
    

    useEffect(() => {
        listen()
    }, [productId,listen])

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
