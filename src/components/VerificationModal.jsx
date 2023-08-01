import React from 'react'


export default function VerificationModal({ isActive, onClose, operationName ,trueOperation }) {


    if (isActive) {
        return (
            <div className='fixed top-0 left-0 h-screen w-full z-10  backdrop-blur-sm'>
                <div className='h-full w-full flex items-center justify-center '>
                    <div className='relative flex flex-col items-center py-6 px-4  bg-gradient-to-tl from-[#b7bac3] to-[#6e77ee]  rounded-3xl  justify-center gap-y-16 md:min-w-[300px] md:min-h-[100px] w-auto h-auto border-2 '>
                        <div className='flex flex-col gap-y-8 items-center justify-center gap-x-3'>
                            <div className='space-x-1'>
                                <p className='md:text-base text-center text-sm font-sans text-brandWhite   tracking-widest'>{`${operationName} , Onaylıyor musunuz ? `}</p>
                            </div>
                            <div className='flex items-center justify-center gap-x-10'>
                                <button typeof='button'onClick={()=>{trueOperation()}} className='px-6 py-1 bg-green-600  bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-green-600 transition-all active:scale-90'>Evet</button>
                                <button typeof='button'onClick={()=>{onClose()}} className='px-6 py-1 bg-red-600 bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-red-600 transition-all active:scale-90'>Hayır</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
