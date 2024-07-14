import React, { useEffect, useState } from 'react'
import classNames from 'classnames';
import { useField } from 'formik';

export default function Input({ label, type = "text", ...props }) {

    const [field] = useField(props)
    const [show, setShow] = useState(false);
    const [inputType, setType] = useState(type)

    useEffect(() => {
        if (show) {
            setType('text')

        } else if (type === "password") {
            setType('password')

        }
    }, [show])

    return (
        <label className='relative  rounded-md   '>
            <input type={inputType} className={classNames({
                'px-2 text-sm outline-none  w-full  h-[38px]': true,
                'pt-[10px]': field.value
            })}{...field} {...props}></input>
            <small className={classNames({
                'absolute left-[9px]  cursor-text pointer-events-none text-brandPink -translate-y-1/2 transition-all ': true,
                'text-sm  top-1/2 ': !field.value,
                'text-[10px] top-1.5': field.value
            })}>{label}</small>
            {type === "password" && field?.value && (
                <div onClick={() => setShow(show => !show)} className=' absolute right-0 top-0 h-full cursor-pointer select-none flex items-center text-sm font-semibold pr-2'>
                    {show ? 'Gizle' : 'Göster'}
                </div>
            )}
        </label>
    )
}