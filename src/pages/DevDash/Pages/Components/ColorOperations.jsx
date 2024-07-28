import { React, useEffect, useState } from 'react'
import '../../../../Modal.css'
import "../../../../ScrollStyle.css"
import { Form, Formik } from 'formik';
import Input from '../../../../components/Input.jsx';
import classNames from 'classnames';
import { addColor, deleteColorByColorId, getColors } from '../../../../firebase.js';
import VerificationModal from '../../../../components/VerificationModal.jsx';

export default function ColorOperations() {
  const getColorsBase = getColors();

  const [colors, setColors] = useState([])
  const [selectedColor, setSelectedColor] = useState(null);
  const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)



  const handleSubmit = async (values, actions) => {
    addColor(values).then(res => {
      if (res) {
        setColors(prevState => [...prevState, { colorId: res.id, colorName: values.colorName, colorCode: values.colorCode }]);
        values.colorName = '';
        values.colorCode = '';
      }
    })
  }

  const verificationModalClose =()=>{
    setisVerificationModalOpen(false);
    resetSelectedColor();
}

  const resetSelectedColor = () => {
    setSelectedColor(null);
  }

  const deleteSelectedColor = () => {
    deleteColorByColorId(selectedColor).then(res => {
      setColors(colors.filter(color => color.colorId !== selectedColor.colorId))
    })
  }




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


  return (

    <div className=' flex-col animate-fade-left animate-ease-in-out animate-normal max-h-screen
     bg-transparent  w-full flex items-center justify-center '>
      <h1 className='text-4xl items-center justify-center font-semibold flex  w-full h-[5%]'>
        RENKLER
      </h1>
      <div className='w-full h-[95%] gap-y-4 flex flex-col items-start justify-start py-8  '>
        <div className='h-auto w-full flex flex-wrap gap-4 pb-12 px-8 '>
          {
            colors.map((data, key) => {
              return <div key={key} style={{ backgroundColor: "#" + data.colorCode }}
                className={`h-14 group indicator w-14 relative  tooltip hover:z-10 tooltip-bottom  cursor-pointer 
                transition-all hover:scale-110 rounded-ss-xl`} data-tip={data.colorName}>
                <div className="hidden group-hover:block transition-all indicator-item indicator-top">
                  <button onClick={() => {setisVerificationModalOpen(true); setSelectedColor(data) }}
                    className="btn btn-xs  btn-primary">Sil</button>
                </div>
              </div>
            })
          }

        </div>
        <div className='w-full' >

          <Formik
            initialValues={{
              colorName: '',
              colorCode: ''

            }}

            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className='flex flex-row '>
                <div className='flex w-full flex-row gap-x-8 items-center justify-center'>
                  <Input type="text" name="colorName" className='input rounded-lg input-bordered w-full max-w-xs' placeholder='Renk Adı ' />
                  <Input type="text" name='colorCode' className='input  rounded-lg input-bordered w-full max-w-xs' placeholder='Renk Kodu ' />
                  <div className='flex w-full flex-col gap-y-2 items-center justify-between'>
                    <div style={{ backgroundColor: "#" + values.colorCode }} className={`w-14 h-14  rounded-ss-xl transition-colors`}></div>
                  </div>

                </div>

                <button type='submit' disabled={values.colorName.length == 0 || values.colorCode.length == 0}
                  className={classNames({
                    "transition-all m-8 w-auto h-auto py-2 px-4 hover:drop-shadow-2xl  text-white font-semibold  rounded-2xl  ": true,
                    "bg-brandGreen hover:scale-110 active:scale-95": values.colorName.length != 0 && values.colorCode.length != 0,
                    "bg-red-700": values.colorName.length == 0 || values.colorCode.length == 0
                  })}>Ekle</button>

              </Form>
            )}
          </Formik>

        </div>

      </div>

      <VerificationModal isActive={isVerificationModalOpen} onClose={verificationModalClose}
        trueOperation={deleteSelectedColor} ></VerificationModal>

    </div>


  )

}
