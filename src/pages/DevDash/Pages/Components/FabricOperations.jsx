import React, { useEffect, useState } from 'react'
import Input from '../../../../components/Input'
import { Form, Formik } from 'formik'
import { addFabric, deleteFabricByFabricId, getAllFabrics } from '../../../../firebase'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import { Timestamp } from 'firebase/firestore'
import logo from '../../../../materials/logos/logo.svg'


export default function FabricOperations() {
    const [isActive, setisActive] = useState(false)
    const user = useSelector(state => state.auth.user)
    const [fabrics, setFabrics] = useState([]);
    const [selectedFabric, setSelectedFabric] = useState()
    const handleSubmit = async (values, actions) => {

        addFabric(values.fabricName).then(res => {
            if (res) {
                setFabrics(prevState => [...prevState, {id:res.id, fabricName: values.fabricName}]);
                setisActive(false);
              }
        })
    }


    const deleteSelectedFabric = (data) => {
        deleteFabricByFabricId(data).then(res => {
            setFabrics(fabrics.filter(fabric => fabric.id !== data.id))
        })
    }

    const resetSelectedFabric = () => {
        setSelectedFabric(null);
    }

    const getAllFabricsReaction = () => {
        getAllFabrics().then(res => {
            res.forEach(async (doc) => {
                //FireBase zaman dönüşümü !! 
                const fbts = new Timestamp(doc.data().creationTime.seconds, doc.data().creationTime.nanoseconds)
                const date = fbts.toDate();
                const readableDate = date.toLocaleString();

                setFabrics(prevState => [...prevState, { id: doc.id, fabricName: doc.data().fabricName, creationTime: readableDate }])
            })
        })
    }

    useEffect(() => {
        getAllFabricsReaction()
    }, [])

    return (
        <div className='flex  animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards w-full h-full flex-col items-center justify-center'>
            <div className='flex flex-col w-full h-1/2 gap-y-8 items-center justify-center'>
                <div className='flex w-full  items-start justify-between '>
                    <h1 className='text-2xl font-semibold'>
                        Kumaş İşlemleri
                    </h1>
                    {user && <div className='flex items-center justify-center gap-x-2'>
                        <button type='button' onClick={() => { setisActive(true) }} className='bg-brandGray active:scale-90 transition-all text-brandWhite hover:bg-brandGreen py-2 px-6 rounded-md'>Kumaş Ekle</button>
                    </div>}

                    {
                        isActive === true && <div className='fixed top-0 animate-fade left-0 h-screen w-full z-10  backdrop-blur-sm'>
                            <div className='h-full w-full flex items-center justify-center '>
                                <div className='relative flex flex-col items-center pb-8  bg-gradient-to-tl from-[#b7bac3] to-bg-base-300 rounded-3xl  justify-center gap-y-16 min-w-[300px] min-h-[400px] w-auto h-auto border-2 '>
                                    <div className='flex items-center justify-center gap-x-3'>
                                        <div className='space-x-1'>
                                            <strong className='text-2xl font-medium font-serif tracking-widest'>Kumaş bilgileri</strong>


                                        </div>
                                    </div>
                                    <Formik
                                        initialValues={{
                                            fabricName: ''


                                        }}

                                        onSubmit={handleSubmit}
                                    >
                                        {({ values }) => (
                                            <Form>
                                                <div className='flex flex-col items-center justify-center gap-y-3'>

                                                    <Input type="text" name="fabricName" className='p-2  focus:outline-brand-color  w-48 text-base rounded-md  transition-all h-10 outline-none hover:text-sm ' label='Kumaş Adı' />
                                                    <div className='flex pt-10 items-center justify-center gap-x-4'>
                                                        <button type='submit' disabled={values.fabricName.length == 0} className={classNames({
                                                            'px-6 py-1  md:bg-brandGray rounded-md transition-all active:scale-90': true,
                                                            ' md:hover:bg-green-600': values.fabricName.length != 0,
                                                            'opacity-25': values.fabricName.length == 0
                                                        })}>Kumaş Ekle</button>
                                                        <button typeof='button' onClick={() => { setisActive(false) }} className='px-6 py-1 bg-red-600 bg-opacity-70 md:bg-brandGray rounded-md md:hover:bg-red-600 transition-all active:scale-90'>Vazgeç</button>
                                                    </div>

                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    }

                </div>
                <div className='w-full'>
                    <div className="stats shadow">

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title">Kumaş Tipi Sayısı</div>
                            <div className="stat-value">31K</div>
                            <div className="stat-desc">Jan 1st - Feb 1st</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div className="stat-title">En Çok Tercih Edilen Kumaş Tipi</div>
                            <div className="stat-value">4,200</div>
                            <div className="stat-desc">↗︎ 400 (22%)</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">En Az Tercih Edilen Kumaş Tipi</div>
                            <div className="stat-value">1,200</div>
                            <div className="stat-desc">↘︎ 90 (14%)</div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='h-1/2 w-full flex flex-col mt-8 gap-y-2 items-start'>
                <h1 className='text-2xl font-semibold '>
                    Kumaşlar
                </h1>
                <div className="overflow-scroll w-full h-auto">
                    <table className="table table-md table-pin-rows table-pin-cols">
                        <thead >
                            <tr>

                                <td>Ürün Adı</td>
                                <td>Oluşturulma Tarihi</td>
                                <th className='flex items-center justify-center'>Operasyonlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fabrics.map((fabric, key) => {

                                return <tr key={key} className='hover:scale-95 transition-all hover:cursor-pointer hover:opacity-90'>
                                    <td>{fabric.fabricName}</td>
                                    <td>{fabric.creationTime}</td>
                                    <td className='flex items-center justify-center gap-x-2'>
                                        <div onClick={() => { document.getElementById('alert').showModal(); setSelectedFabric(fabric) }} className='hover:scale-125 transition-all' ><AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>                                     
                                    </td>

                                </tr>

                            })}




                        </tbody>

                    </table>


                </div>

            </div>
            <dialog id="alert" className="modal">
                <div className="modal-box flex item-center justify-between flex-row  gap-x-2">
                    <div className='flex items-center justify-center gap-x-4'>
                        <img className='w-auto h-16' src={logo} alt="logo" />
                        <p className="text-md">Lütfen işlemi onaylayın</p>
                    </div>
                    <div className='flex items-center justify-center gap-x-2'>
                        <button onClick={() => { deleteSelectedFabric(selectedFabric); document.getElementById('alert').close() }} className="btn btn-sm btn-primary">Onayla</button>
                        <button onClick={() => { resetSelectedFabric();document.getElementById('alert').close() }} className="btn btn-sm ">Vazgeç</button>
                    </div>

                </div>
            </dialog>

        </div>
    )
}
