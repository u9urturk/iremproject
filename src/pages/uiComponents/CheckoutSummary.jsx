import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, CreditCard, MapPin, ArrowDownUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import {getUserAddresses } from '../../firebase';
import { useSelector } from 'react-redux';
import AddressManager from '../profile/AddressManager';

const CheckoutSummary = () => {
    const user = useSelector(state => state.auth.user);
    const { items, totalAmount } = useCart();
    const [address, setAddress] = useState();
    const [allAddress, setAllAddress] = useState([])
    const [justAdd, setJustAdd] = useState(false);

    const defaultAddress = (data) => {
        return new Promise((resolve, reject) => {
            if (!data || data.length === 0) {
                reject("Adres listesi boş.");
            }

            const defaultAddress = data.find(e => e.isDefault === true);

            if (data) {
                resolve(defaultAddress);
            } else {
                reject("Varsayılan adres bulunamadı.");
            }
        });


    }

    const justAddClose = (success)=>{
        setJustAdd(false);
        console.log(success)
        if(success===true){getAllAddress();}
    }

    const sendOrder = ()=>{
        console.log(items,address)
    }

    const getAllAddress = () => {
        getUserAddresses(user.uid).then(res => {
           res.addresses.length > 0 && defaultAddress(res.addresses).then(e => {
                setAddress(e)
            })
            setAllAddress(res.addresses);
        })
    }

    useEffect(() => {
        if (user) {
            getAllAddress();
        }
    }, [user])

    return (
        <div className="max-w-6xl animate-fade mx-auto p-4">
            {/* Sipariş İlerleme Durumu */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">1</div>
                            <div className="h-1 flex-1 bg-primary"></div>
                        </div>
                        <p className="text-sm mt-2">Sepet</p>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">2</div>
                            <div className="h-1 flex-1 bg-gray-300"></div>
                        </div>
                        <p className="text-sm mt-2">Sipariş Özeti</p>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">3</div>
                        </div>
                        <p className="text-sm mt-2">Ödeme</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf - Ürün Listesi */}
                <div className="lg:col-span-2">
                    <div className="bg-base-200 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6">Sepetinizdeki Ürünler</h2>
                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-4 pb-6 border-b last:border-0">
                                    <img
                                        src={item.baseImage}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <p>Renk: {item.color}</p>
                                            <p>Desen: {item.pattern}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm">Adet: {item.quantity}</span>
                                            <span className="font-semibold">{item.basePrice * item.quantity} ₺</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teslimat Bilgileri */}
                    <div className="bg-base-200 rounded-lg shadow-lg p-6 mt-6">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div className='flex items-center justify-center gap-x-2'>
                                <MapPin className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold">Teslimat Adresi</h2>
                            </div>
                            {
                                allAddress.length >0 && <div className="dropdown dropdown-top dropdown-hover">
                                    <div tabIndex={0} role="button" className="">
                                        <div className='flex items-center cursor-pointer justify-center gap-x-2'>
                                            <ArrowDownUp className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-semibold">Adresi değiştir</h2>

                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 space-y-3 rounded-t-lg z-[1] w-36 p-2 shadow">
                                        <strong>Adresler</strong>
                                        {
                                            allAddress.map(address => (
                                                <li onClick={() => { setAddress(address) }} className='flex items-start rounded-md cursor-pointer hover:bg-base-100 transition-all font-semibold shadow-inner bg-base-200  justify-start w-full px-4 py-2'
                                                    key={address.id}>{address.title}</li>

                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        {allAddress.length >0 ? (
                            <div key={address?.id || Math.random()} className="p-4 bg-base-100 rounded-lg ">
                                <div className='flex items-center justify-between'>
                                    <p className="font-medium animate-fade-up">{address?.title}</p>
                                    <p className="font-semibold cursor-pointer animate-fade-up">{address?.phoneNumber}</p>
                                </div>
                                <p className="text-gray-600 mt-1 animate-fade-up">{address?.addressDetail}</p>
                                <p className="text-gray-600 animate-fade-up" >{address?.city}/{address?.district}</p>
                            </div>
                        ) : (
                            <div key={Math.random()} className="p-4 bg-base-100 rounded-lg ">
                                <div className='flex flex-col gap-y-4'>
                                    <p>Kayıtlı Adresiniz Bulunmamaktadır.</p>
                                    <button onClick={()=>{setJustAdd(!justAdd)}} className='btn btn-primary rounded-md opacity-90 text-white'>Yeni Adres Ekle</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf - Sipariş Özeti */}
                <div className="lg:col-span-1">
                    <div className="bg-base-200 rounded-lg shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ara Toplam</span>
                                <span>{totalAmount} ₺</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Kargo</span>
                                <span>{'Ücretsiz'}</span>
                            </div>
                            <div className="h-px bg-gray-200"></div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Toplam</span>
                                <span>{totalAmount} ₺</span>
                            </div>
                        </div>

                        {/* Bilgi Notları */}
                        <div className="space-y-3 mb-6">
                            <div className="flex  items-center gap-2 text-sm text-gray-600">
                                <Package className="w-4 h-4" />
                                <span>Planlanan süre içerisinde teslimat</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="w-4 h-4" />
                                <span>Güvenli ödeme</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Ürünlerin geliştirilme sürecinde sürekli iletişim</span>
                            </div>
                        </div>

                        <button onClick={sendOrder} className="w-full bg-primary bg-opacity-80 text-white py-3 rounded-lg font-semibold hover:bg-opacity-100 transition-all">
                            Siparişi Oluştur
                        </button>
                    </div>
                </div>
            </div>
            {justAdd===true&&
            <AddressManager handleJustAdd={justAdd} mainPage={false} onClose={justAddClose}></AddressManager>}
        </div>
    );
};

export default CheckoutSummary;