import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, CreditCard, MapPin, ArrowDownUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSelector } from 'react-redux';
import AddressManager from '../profile/AddressManager';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUserAddresses } from '../../firebase/addressService';
import { createOrder } from '../../firebase/orderService';


const CheckoutSummary = () => {
    const user = useSelector(state => state.auth.user);
    const { items, totalAmount, clearCart } = useCart();
    const [address, setAddress] = useState();
    const [allAddress, setAllAddress] = useState([])
    const [justAdd, setJustAdd] = useState(false);
    const navigate = useNavigate();

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

    const justAddClose = (success) => {
        setJustAdd(false);
        if (success === true) { getAllAddress(); }
    }



    const goToOrderWithState = (data) => {
        // Yönlendirme yaparken state verisi gönderme
        navigate(`/profile/orders/${data.orderId}`, {
            state: { order: data.order },
        });
    };




    const sendOrder = () => {
        createOrder(user.uid, {
            items: items,
            address: address,
            totalAmount: totalAmount
        }).then(res => {
            clearCart(false)
            goToOrderWithState(res);
        })
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
            <ul className="steps w-full md:mb-8 steps-horizontal">
                <li className="step step-primary">Sepet</li>
                <li className="step step-primary">Sipariş Özeti</li>
                <li className="step">Planlama Ve Üretim</li>
            </ul>

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
                                            <p className='font-semibold'>Renk: {item.color.name}</p>
                                            <p className='font-semibold'>Kumaş: {item.fabric.name}</p>
                                            <div className='flex items-center justify-start gap-x-1'>
                                                <p className='font-semibold'>Model:</p>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <img src={item.pattern.img} className='w-16 h-16 ml-2' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm">Adet: {item.quantity}</span>
                                            <span className="font-semibold">Fiyat: {(item.isFullPrice?item.fullPrice:item.basePrice) * item.quantity} ₺</span>
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
                                allAddress.length > 0 && <div className="dropdown dropdown-top dropdown-hover">
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
                        {allAddress.length > 0 ? (
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
                                    <button onClick={() => { setJustAdd(!justAdd) }} className='btn btn-primary rounded-md opacity-90 text-white'>Yeni Adres Ekle</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf - Sipariş Özeti */}
                <div className="lg:col-span-1">
                    <div className="bg-base-200 rounded-lg shadow-lg p-6 sticky top-28">
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

                        <Link onClick={sendOrder} className="w-full btn  bg-primary bg-opacity-80 text-white py-3 rounded-lg font-semibold hover:bg-primary hover:bg-opacity-100 transition-all">
                            Siparişi Oluştur
                        </Link>
                    </div>
                </div>
            </div>
            {justAdd === true &&
                <AddressManager handleJustAdd={justAdd} mainPage={false} onClose={justAddClose}></AddressManager>}
        </div>
    );
};

export default CheckoutSummary;