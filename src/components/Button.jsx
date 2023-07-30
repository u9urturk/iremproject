import React from 'react'

export default function Button({ type = 'button', children, ...props }) {
    return (
        <button type={type}
            {...props}
            className="flex gap-x-2 items-center justify-center cursor-pointer text-white transition-all hover:scale-110 active:scale-100 rounded-lg w-48 h-10 bg-[#507BB7]">
            {children}
        </button>
    )
}
