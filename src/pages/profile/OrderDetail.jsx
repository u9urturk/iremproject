import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, CreditCard, MapPin, ArrowDownUp } from 'lucide-react';
import { getUserAddresses } from '../../firebase';
import { useSelector } from 'react-redux';
import AddressManager from '../profile/AddressManager';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [address, setAddress] = useState();
    const [items, setItems] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [allAddress, setAllAddress] = useState([])
    const [justAdd, setJustAdd] = useState(false);

    useEffect(() => {
        if (location.state !== null) {
            setAddress(location.state.order.address)
            setItems(location.state.order.items)
            setTotalAmount(location.state.order.totalAmount ? location.state.order.totalAmount : 0)
        }
    }, [location.state])

    console.log(items, address, totalAmount);
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


    useEffect(() => {

        if (!location.state) {
            navigate('/profile/orders');
        }
    }, [location, navigate]);
    console.log(location.state)

    const getAllAddress = () => {
        getUserAddresses(user.uid).then(res => {
            setAllAddress(res.addresses);
        })
    }
    return (
        <div className="max-w-6xl animate-fade-left mx-auto p-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf - Ürün Listesi */}
                <div className="lg:col-span-2">
                    <div className="bg-base-200 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6">Sipariş Detayları</h2>
                        <div className="space-y-6">
                            {items && items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-6 border-b last:border-0">
                                    <img
                                        src={item.baseImage}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <p>Renk: {item.color.colorName}</p>
                                            <p>Kumaş: {item.fabric.fabricName}</p>
                                            <div className='flex items-center justify-start gap-x-1'>
                                                <p>Model:</p>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    {
                                                        item.patterns.urls.map((url, key) => (
                                                            <img key={key} src={url} className='w-16 h-16' alt="" srcset="" />
                                                        ))
                                                    }
                                                </div>
                                            </div>
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
                        {address && (
                            <div key={address.address?.id || Math.random()} className="p-4 bg-base-100 rounded-lg ">
                                <div className='flex items-center justify-between'>
                                    <p className="font-medium animate-fade-up">{address?.title}</p>
                                    <p className="font-semibold cursor-pointer animate-fade-up">{address?.phoneNumber}</p>
                                </div>
                                <p className="text-gray-600 mt-1 animate-fade-up">{address?.addressDetail}</p>
                                <p className="text-gray-600 animate-fade-up" >{address?.city}/{address?.district}</p>
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

                    </div>
                </div>
            </div>
            {justAdd === true &&
                <AddressManager handleJustAdd={justAdd} mainPage={false} onClose={justAddClose}></AddressManager>}
        </div>
    );
};

export default OrderDetail;