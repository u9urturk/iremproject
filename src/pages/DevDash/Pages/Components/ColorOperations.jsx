import { React, useEffect, useState } from 'react'
import '../../../../Modal.css'
import { useModal } from '../../../../Context/ModalContext.jsx';
import { IoIosClose } from "react-icons/io";
import "../../../../ScrollStyle.css"

import { Form, Formik } from 'formik';
import Input from '../../../../components/Input.jsx';
import classNames from 'classnames';
import { addColor, getColors } from '../../../../firebase.js';

export default function ColorOperations({ isActive = false, close }) {

  const { isAnyModalOpen, openModal, closeModal } = useModal();
  const getColorsBase = getColors();
  const [colors, setColors] = useState([])

  const handleSubmit = async (values, actions) => {
    addColor(values).then(res => {
      if (res === true) {
        setColors(prevState => [...prevState, {colorName:values.colorName,colorCode:values.colorCode}])
      }
    })
  }

  useEffect(() => {
    if (isActive) {
      openModal()
    } else {
      closeModal()
    }

    return () => {
      closeModal()
    }
  }, [isActive])


  //Get Data

  const colorReaction = () => {
    getColorsBase.then(res => {
      res.forEach((doc) => {
        let data = { colorId: doc.id, ...doc.data() }
        // console.log(doc.data())
        setColors(prevState => [...prevState, data])
      })
    })

  }

  
  useEffect(() => {
    colorReaction()
}, [])


  if (isAnyModalOpen) {
    return (
      <div className={`fixed top-0 flex items-center justify-center animate-fade left-0 h-screen w-full z-10 bg-gray-800 bg-opacity-80`}>
        <div className='relative flex  items-center justify-center opacity-90 w-[calc(100%-10rem)] rounded-3xl drop-shadow-2xl h-[calc(80%)] bg-base-100'>
          <button onClick={close} className='absolute right-1 top-1 h-auto  w-auto hover:opacity-60'><IoIosClose size={44} /> </button>
          <div className=' flex-col h-full w-full py-4 flex items-center justify-center '>
            <h1 className='text-4xl items-center justify-center font-semibold flex  w-full h-1/4'>
              RENKLER
            </h1>
            <div className='w-full h-3/4 flex flex-row items-center justify-center gap-x-12 '>
              <div className=' w-2/3 place-items-center h-full scroll-invisible m-8 grid grid-cols-5 border-brandGreen rounded-2xl overflow-scroll py-10 gap-2 gap-y-10 border-2 border-spacing-8'>
                {
                  colors.map((data,key)=>{
                    return <div key={key} style={{ backgroundColor: "#"+data.colorCode}} className={`h-14 w-14 tooltip hover:tooltip-top  cursor-pointer transition-all hover:scale-110 rounded-full`} data-tip={data.colorName}></div>
                  })
                }

              </div>
              <div className='w-1/3 h-full flex flex-col items-center justify-center' >

                <Formik
                  initialValues={{
                    colorName: '',
                    colorCode: ''

                  }}

                  onSubmit={handleSubmit}
                >
                  {({ values }) => (
                    <Form>
                      <div className='flex flex-col gap-y-8 items-center justify-center'>
                        <Input type="text" name="colorName" className='px-2 py-2 bg-transparent border text-center border-brandGreen rounded-2xl outline-none' placeholder='Renk Adı ' />
                        <Input type="text" name='colorCode' className='px-2 py-2 bg-transparent border text-center border-brandGreen rounded-2xl outline-none' placeholder='Renk Kodu ' />
                        <div className='flex flex-col gap-y-2 items-center justify-center'>
                          <p>Ön İzleme</p>
                          <div  style={{ backgroundColor: "#"+values.colorCode }} className={`w-14 h-14  rounded-full transition-colors`}></div>
                        </div>

                      </div>

                      <button type='submit' disabled={values.colorName.length == 0 || values.colorCode.length == 0}
                        className={classNames({
                          "transition-all m-8 w-auto h-auto py-2 px-4 hover:drop-shadow-2xl  text-white font-semibold  rounded-2xl  ": true,
                          "bg-brandGreen hover:scale-110 active:scale-95": values.colorName.length != 0 && values.colorCode.length != 0,
                          "bg-red-700": values.colorName.length == 0 || values.colorCode.length == 0
                        })}>Yeni Renk Ekle</button>

                    </Form>
                  )}
                </Formik>

              </div>

            </div>
          </div>

        </div>

      </div>
    )
  }
}
