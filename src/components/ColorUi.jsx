import React, { useState } from 'react'
import { useEffect } from 'react';

export default function ColorUi({ colors, handleInput }) {

    const [currentColors, setCurrentColors] = useState([])

    useEffect(() => {
        handleInput('colors', currentColors);
    }, [currentColors])


    const currentModels = (color) => {
        // setCurrentPatterns([])

        if (!currentColors.find((currentColor) => currentColor.id === color.id)) {
            setCurrentColors(prev => [...prev, color])
        } else {
            const updatedColors = currentColors.filter((cc) => cc.id !== color.id)
            setCurrentColors(updatedColors);
        }
    }

    const isCurrent = (color) => {
        if (currentColors.find((currentColor) => currentColor.id === color.id)) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div>
            <button className="btn pl-3 flex justify-start font-normal bg-transparent border border-base-200 w-full"
                onClick={() => document.getElementById('modal_colors').showModal()}>{currentColors.length > 0 ? currentColors.length + " Renk Seçildi" : "Renk Seçiniz"}</button>
            <dialog id="modal_colors" className="modal ">
                <div className="modal-box  max-h-[80%] overflow-y-auto">
                    <div className='flex items-start justify-between'>
                        <h3 className="font-bold  text-lg">Renkler</h3>
                        <div className='btn btn-primary '>{`${currentColors.length > 0 ? currentColors.length + " Renk Seçildi" : "En az bir renk seçin!"}`}</div>
                    </div>
                    <div className='flex place-content-center pt-4 flex-wrap gap-x-4 gap-y-4'>
                        {
                            colors.map((color, key) => (
                                <div key={color.name + key} onClick={() => {
                                    currentModels(color)
                                }} className={`w-20 ${isCurrent(color) ? "opacity-100 bg-primary" : "opacity-75"} cursor-pointer   relative rounded-lg shadow flex items-center justify-center  h-20 group`}>
                                    <p className='absolute text-black animate-fade font-bold animate-duration-300 w-full px-2 py-1 hidden group-hover:block top-0'>{color.name}</p>
                                    <div
                                        style={{ backgroundColor: color.colorCode }}
                                        className={`w-10 h-10 rounded-tl-full rounded-br-full`}></div>
                                </div>
                            ))}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}






