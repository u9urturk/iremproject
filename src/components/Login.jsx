import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { login, logout } from '../firebase'
import { AiOutlineCloseCircle, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { Form, Formik } from 'formik'
import Input from './Input'
import Button from './Button'
import { LoginSchema } from '../Validation'
import logo from '../materials/logos/logo.svg'
import { useModal } from '../Context/ModalContext'

export default function Login() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)

    
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

    const handleSubmit = async (values, actions) => {
        login(values.username, values.password)
    }
    return (
        <div>
            {!user && <div className='text-brandPink  active:scale-90 -rotate-90 hover:rotate-0  cursor-pointer transition-all' onClick={() => { setisActive(true) }}><AiOutlineLogin size={24}></AiOutlineLogin></div>}
            {user && <button className='text-brandPink flex items-center -rotate-90 hover:-rotate-180 justify-centeractive:scale-90 cursor-pointer transition-all' onClick={() => { logout() }}><AiOutlineLogout size={24}></AiOutlineLogout></button>}
            {
                isActive === true && !user && <div className='fixed top-0 left-0 h-screen w-full z-10  animate-fade backdrop-blur-sm'>
                    <div className='h-full w-full flex items-center  justify-center  '>
                        <div className='relative  bg-gradient-to-b from-base-300 bg-base-100 flex flex-col items-center pb-8  bg-opacity-70  rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto  '>
                            <div onClick={() => { setisActive(false) }}><AiOutlineCloseCircle className='absolute top-4 right-4 text-brandPink transition-all cursor-pointer hover:scale-75' size={34}></AiOutlineCloseCircle></div>
                            <div className='flex items-center justify-center gap-x-3'>
                                <img src={logo} width={70} height={150} alt="iremnakis" />
                                <span class="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz Evi</p></span>
                            </div>
                            <Formik
                                validationSchema={LoginSchema}
                                initialValues={{
                                    username: '',
                                    password: ''
                                }}

                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, values, isValid, dirty }) => (
                                    <Form>
                                        <div className='flex flex-col items-center justify-center gap-y-3'>
                                            <Input type="text" name="username" className='p-2 w-48 text-base  transition-all h-10 outline-none hover:text-sm ' label='E-Posta' />
                                            <Input type="password" name="password" className='p-2 w-48 bg-transparent h-10 text-base transition-all outline-none hover:text-sm ' label='Şifre' />
                                            <Button type='submit' disabled={!isValid || !dirty || isSubmitting}>Giriş Yap</Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
