import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { login, logout } from '../firebase'
import {SiAdminer} from 'react-icons/si'
import {RiLogoutCircleRLine} from 'react-icons/ri'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { Form, Formik } from 'formik'
import Input from './Input'
import Button from './Button'
import { LoginSchema } from '../Validation'

export default function Login() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)
    const logo = process.env.PUBLIC_URL + "logos/logo.svg"

    const handleSubmit = async (values, actions) => {
        login(values.username, values.password)
    }
    return (
        <div>
            {!user && <div className='text-[#f9faf5]  active:scale-90  cursor-pointer transition-all hover:text-gray-700' onClick={() => { setisActive(true) }}><SiAdminer size={34}></SiAdminer></div>}
            {user && <button className='text-[#f9faf5] hover:text-gray-700 active:scale-90 cursor-pointer transition-all' onClick={() => { logout() }}><RiLogoutCircleRLine size={28}></RiLogoutCircleRLine></button>}
            {
                isActive === true && !user && <div className='fixed top-0 left-0 h-screen w-full z-10  backdrop-blur-sm'>
                    <div className='h-full w-full flex items-center justify-center '>
                        <div className='relative flex flex-col items-center pb-8  bg-gradient-to-tl from-[#b7bac3] to-[#6e77ee]  rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                            <div onClick={() => { setisActive(false) }}><AiOutlineCloseCircle className='absolute top-4 right-4 text-white transition-all cursor-pointer hover:scale-75' size={34}></AiOutlineCloseCircle></div>
                            <div className='flex items-center justify-center gap-x-3'>
                                <img src={logo} width={70} height={150} alt="iremnakis" />
                                <div className='space-x-1'>
                                    <strong className='text-2xl font-medium font-serif tracking-widest'>İrem</strong>
                                    <strong className='text-2xl font-medium text-brand-color font-serif tracking-widest'>Nakış</strong>

                                </div>
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
                                            <Input type="text" name="username" className='p-2  focus:outline-brand-color  w-48 text-base  transition-all h-10 outline-none hover:text-sm ' label='Kullanıcı adı' />
                                            <Input type="password" name="password" className='p-2  focus:outline-brand-color w-48  h-10 text-base transition-all outline-none hover:text-sm ' label='Şifre' />
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
