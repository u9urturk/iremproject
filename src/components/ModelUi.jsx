import React, { useState } from 'react'
import { useEffect } from 'react';

export default function ModelUi({ patterns ,currentModel }) {

    const [currentPattern, setCurrentPattern] = useState({
        name:"Model seçiniz"
    })

    useEffect(() => {
        currentModel('productData', 'patternId',currentPattern.id);
    }, [currentPattern])
    
    return (
        <div>{/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn pl-3 flex justify-start font-normal bg-transparent border border-base-200 w-full"
                onClick={() => document.getElementById('modal_model').showModal()}>{currentPattern.name}</button>
            <dialog id="modal_model" className="modal">
                <div className="modal-box max-h-[80%]">
                    <h3 className="font-bold  text-lg">Modeller</h3>
                    <div className='flex place-content-center pt-4 flex-wrap gap-x-4 gap-y-4'>
                        {
                            patterns.map((pattern, key) => (
                                <div key={pattern.name + key} onClick={() => { setCurrentPattern(pattern)
                                    document.getElementById("modal_model").close();
                                }} className='w-20 cursor-pointer relative rounded-lg shadow flex items-center justify-center  h-20 group  '>
                                    <p className='absolute text-black animate-fade font-bold animate-duration-300 w-full px-2 py-1 hidden group-hover:block top-0'>{pattern.name}</p>
                                    <img
                                        className='w-20 h-20'
                                        src={pattern.imgsUrl[0]}
                                        alt={pattern.name}
                                    />
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






