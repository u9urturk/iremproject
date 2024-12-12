import React, { useState } from 'react'
import { useEffect } from 'react';

export default function ModelUi({ patterns, currentModel }) {

    const [currentPatterns, setCurrentPatterns] = useState([])

    useEffect(() => {
        currentModel('patterns', currentPatterns);
    }, [currentPatterns])


    const currentModels = (pattern) => {
        // setCurrentPatterns([])

        if (!currentPatterns.find((currentPattern) => currentPattern === pattern.id)) {
            setCurrentPatterns(prev => [...prev, pattern.id])
        } else {
            const updatedCPatterns = currentPatterns.filter((cp) => cp !== pattern.id)
            setCurrentPatterns(updatedCPatterns)
        }
    }

    const isCurrent = (pattern) => {
        if (currentPatterns.find((currentPattern) => currentPattern === pattern.id)) {
            return true;
        } else {
            return false;
        }
    }


    return (
        <div>
            <button className="btn pl-3 flex justify-start font-normal bg-transparent border border-base-200 w-full"
                onClick={() => document.getElementById('modal_model').showModal()}>{currentPatterns.length > 0 ? currentPatterns.length + " Model Seçildi" : "Model Seçiniz"}</button>
            <dialog id="modal_model" className="modal ">
                <div className="modal-box  max-h-[80%] overflow-y-auto">
                    <div className='flex items-start justify-between'>
                        <h3 className="font-bold  text-lg">Modeller</h3>
                        <div className='btn btn-primary '>{`${currentPatterns.length>0?currentPatterns.length + " Model Seçildi":"En az bir model seçin!"}`}</div>
                    </div>
                    <div className='flex place-content-center pt-4 flex-wrap gap-x-4 gap-y-4'>
                        {
                            patterns.map((pattern, key) => (
                                <div key={pattern.name + key} onClick={() => {
                                    currentModels(pattern)
                                }} className={`w-20 ${isCurrent(pattern) ? "opacity-100 bg-primary" : "opacity-75"} cursor-pointer relative rounded-lg shadow flex items-center justify-center  h-20 group`}>
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






