import {React,useEffect} from 'react'
import '../../../../Modal.css'
import { useModal } from '../../../../Context/ModalContext.jsx';
export default function ColorOperations({isActive=false , close}) {
       
        const { isAnyModalOpen, openModal, closeModal } = useModal();

        useEffect(() => {
          if(isActive){
                openModal()
          }else{
                closeModal()
          }
        
          return () => {
            closeModal()
          }
        }, [isActive])
        
    
 if(isAnyModalOpen){
    return (
        <div  className={`fixed top-0  animate-fade left-0 h-screen w-full z-10  backdrop-blur-sm`}>
                <button onClick={close} className='h-8 w-16 bg-brandGreen hover:opacity-60'>X</button>
        </div>
      )
 } 
}
