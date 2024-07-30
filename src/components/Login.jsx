import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { login, logout, signInWithFacebook, signInWithGoogle } from '../firebase'
import { AiOutlineCloseCircle, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { Form, Formik } from 'formik'
import Input from './Input'
import Button from './Button'
import { LoginSchema } from '../Validation'
import logo from '../materials/logos/logo.svg'
import { useModal } from '../Context/ModalContext'
import { Link } from 'react-router-dom'
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";


export default function Login() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)


    const { isAnyModalOpen, openModal, closeModal } = useModal();

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

    const handleSubmit = async (values, actions) => {
        login(values.username, values.password)
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            console.log(result.user); // Kullanıcı bilgilerini burada alabilirsiniz
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithFacebook();
            console.log(result.user); // Kullanıcı bilgilerini burada alabilirsiniz
        } catch (error) {
            console.error("Facebook login error:", error);
        }
    };
    return (
        <div>
            {!user && <div className=' active:scale-90 -rotate-90 hover:rotate-0  cursor-pointer transition-all' onClick={() => { setisActive(true) }}><AiOutlineLogin size={24}></AiOutlineLogin></div>}
            {user && <button className=' flex items-center -rotate-90 hover:-rotate-180 justify-centeractive:scale-90 cursor-pointer transition-all' onClick={() => { logout() }}><AiOutlineLogout size={24}></AiOutlineLogout></button>}
            {
                isActive === true && !user && <div className='fixed top-0 left-0 h-screen w-full z-10  animate-fade backdrop-blur-sm'>
                    <div className='h-full w-full flex items-center  justify-center  '>
                        <div className='relative pt-4 bg-gradient-to-b from-neutral to-base-100 shadow-2xl flex flex-col items-center   bg-opacity-70  rounded-3xl  justify-around min-w-[300px] min-h-[400px] w-auto h-auto  '>
                            <div onClick={() => { setisActive(false) }}><AiOutlineCloseCircle className='absolute top-4 right-4 text-brandPink transition-all cursor-pointer hover:scale-125' size={24}></AiOutlineCloseCircle></div>
                            <div className='flex items-center justify-center gap-x-3'>
                                <img src={logo} width={70} height={150} alt="iremceyizevi" />
                                <span class="ml-3 text-3xl  font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz Evi</p></span>
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
                                        <div className='flex flex-col items-center justify-center gap-y-8'>
                                            <div className='flex items-center flex-col justify-center gap-y-4'>
                                                <Input type="text" name="username" className='p-2 w-48  shadow-inner  bg-transparent transition-all h-10 outline-none hover:text-sm ' label='E-Posta' />
                                                <Input type="password" name="password" className='p-2 w-48 shadow-inner bg-transparent  transition-all h-10 outline-none hover:text-sm ' label='Şifre' />
                                            </div>
                                            <Button type='submit' disabled={!isValid || !dirty || isSubmitting}>Giriş Yap</Button>
                                        </div>
                                    </Form>
                                )}

                            </Formik>
                            <div className="flex w-full items-center justify-around">
                                <div className="flex items-center justify-start text-xs">
                                    <label className="label opacity-80 flex gap-x-1 cursor-pointer">
                                        <input type="checkbox" className="checkbox checkbox-xs" />
                                        <span className="label-text">Beni hatırla</span>
                                    </label>
                                </div>
                                <Link className=" opacity-70 underline" prefetch={false}>
                                    Şifremi unuttum?
                                </Link>
                            </div>
                            <div className='w-full h-auto flex items-center justify-center pb-4 gap-y-2 flex-col'>

                                <div className="flex items-center justify-between">
                                    <div className="h-px bg-muted flex-1" />
                                    <span className="mx-4 text-muted-foreground">or</span>
                                    <div className="h-px bg-muted flex-1" />
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline" onClick={handleFacebookLogin} className="w-full">
                                        <FaFacebookSquare className="w-5 h-5 mr-2" />
                                        Facebook ile Giriş Yap
                                    </Button>
                                    <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
                                        <FaGoogle className="w-5 h-5 mr-2" />
                                        Google ile Giriş Yap
                                    </Button>
                                </div>
                                <div className="text-center pt-4 text-sm opacity-70 text-muted-foreground">
                                    Hesaba sahip değil misin?{" "}
                                    <Link href="#" className="text-primary pl-2 underline" prefetch={false}>
                                        Kayıt Ol
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
