import React, { useEffect } from 'react'
import logo from '../materials/logos/logo.svg'



export default function VerificationModal({ isActive, onClose, operationName, trueOperation }) {

    useEffect(() => {
        if (isActive === true) {
            document.getElementById('alert').showModal();
        } else if (isActive === false) {
            document.getElementById('alert').close();

        }
        else {
            document.getElementById('alert').close();
        }
    }, [isActive])

    return (
        <dialog id="alert" className="modal">
            <div className="modal-box flex item-center justify-between flex-row  gap-x-2">
                <div className='flex items-center justify-center gap-x-4'>
                    <img className='w-auto h-16' src={logo} alt="logo" />
                    <p className="text-md">Lütfen işlemi onaylayın</p>
                </div>
                <div className='flex items-center justify-center gap-x-2'>
                    <button onClick={() => { trueOperation(); onClose() }} className="btn btn-sm btn-primary">Onayla</button>
                    <button onClick={() => { onClose(); }} className="btn btn-sm ">Vazgeç</button>
                </div>

            </div>
        </dialog>
    )
}
