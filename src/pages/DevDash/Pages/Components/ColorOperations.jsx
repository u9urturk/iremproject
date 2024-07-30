import { React, useCallback, useEffect, useState } from 'react'
import '../../../../Modal.css'
import "../../../../ScrollStyle.css"
import { Form, Formik } from 'formik';
import Input from '../../../../components/Input.jsx';
import { addColor, deleteColorByColorId, getColors } from '../../../../firebase.js';
import VerificationModal from '../../../../components/VerificationModal.jsx';
import ColorPicker from '../../../../components/ColorPicker.jsx';

export default function ColorOperations() {
  const [colors, setColors] = useState([])
  const [selectedColor, setSelectedColor] = useState(null);
  const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false)
  const [color, setColor] = useState()


  const handleSubmit = async (values, actions) => {
    const data = {
      colorName: values.colorName,
      colorCode: color
    }
    if (values.colorName.length > 0 && color !== undefined && color !== null) {
      addColor(data).then(res => {
        setColors(prevState => [...prevState, { colorId: res.id, name: values.colorName, colorCode: color }]);
        values.colorName = '';
        setColor('')
      })
    }else{
      addColor(null);
    }

  }

  const handleColorSelect = (color) => {
    setColor(color);
  }

  const verificationModalClose = () => {
    setisVerificationModalOpen(false);
    resetSelectedColor();
    console.log('Ok')
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

  const colorReaction = useCallback(() => {
    getColors().then(res => {
      res.forEach((doc) => {
        let data = { colorId: doc.id, ...doc.data() };
        setColors(prevState => [...prevState, data]);
      });
    });
  }, [])
  


  useEffect(() => {
    colorReaction();
  }, [colorReaction])

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
              return <div key={key} style={{ backgroundColor: data.colorCode }}
                className={`h-14 group indicator w-14 relative  tooltip hover:z-10 tooltip-bottom  cursor-pointer 
                transition-all hover:scale-110 rounded-ss-xl`} data-tip={data.name}>
                <div className="hidden group-hover:block transition-all indicator-item indicator-top">
                  <button onClick={() => { setisVerificationModalOpen(true); setSelectedColor(data) }}
                    className="btn btn-xs  btn-primary">Sil</button>
                </div>
              </div>
            })
          }

        </div>
        <div className='w-full' >

          <Formik
            initialValues={{
              colorName: ''
            }}

            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className='flex flex-row items-center justify-center '>
                <div className='flex w-full flex-row gap-x-8 items-center justify-center'>
                  <Input type="text" name="colorName" className='input rounded-lg input-bordered w-full max-w-xs' placeholder='Renk Adı ' />
                  <div style={{ backgroundColor: color }} className="btn rounded-md" onClick={() => document.getElementById('my_modal_1').showModal()}>Renk Seç</div>
                  <button type='submit' className='btn rounded-md'>Ekle</button>
                </div>

              </Form>
            )}
          </Formik>

        </div>

      </div>
      <dialog id="my_modal_1" className="modal">
        <div className='flex gap-y-4 flex-col items-center justify-center'>
          <ColorPicker onColorSelect={handleColorSelect}></ColorPicker>
          <div className='flex items-center justify-center gap-x-2 '>
            <button style={{ backgroundColor: color }} className={`btn rounded-md border-0`} onClick={() => { document.getElementById('my_modal_1').close() }}>Onayla</button>
            <button className='btn rounded-md' onClick={() => { document.getElementById('my_modal_1').close() }}>Vazgeç</button>
          </div>
        </div>
      </dialog>

      <VerificationModal isActive={isVerificationModalOpen} onClose={verificationModalClose}
        trueOperation={deleteSelectedColor} ></VerificationModal>

    </div>


  )

}
