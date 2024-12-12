import React, { useEffect } from 'react'

export default function LoadingUi({isOpen = false,message}) {

    useEffect(() => {
        isOpen===true ? document.getElementById("modal_loading").showModal() : document.getElementById("modal_loading").close()
    }, [isOpen])

    return (
        <div>
            <dialog id="modal_loading" className="modal ">
                <div className="modal-box flex flex-col items-center justify-center  max-h-[80%] overflow-y-auto">
                    <p className='font-medium'>{message}</p>
                    <span className="loading loading-infinity text-primary w-16"></span>

                </div>
            </dialog>
        </div>
    )
}
