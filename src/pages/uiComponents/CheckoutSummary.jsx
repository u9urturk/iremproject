import React from 'react';
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CheckoutSummary = () => {
    const { items, totalQuantity, totalAmount, removeFromCart, clearCart, updateQantityFromCart } = useCart();

    const cartItems = [
        {
            baseImage: "/api/placeholder/400/320",
            name: "Yeni Ürün",
            color: "Yeşil",
            pattern: "Yeni Desen 2",
            quantity: 1,
            basePrice: 500,
        },
        {
            baseImage: "/api/placeholder/400/320",
            name: "İkinci Ürün",
            color: "Mavi",
            pattern: "Çiçekli",
            quantity: 2,
            basePrice: 750,
        }
    ];

  
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
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Teslimat Adresi</h2>
                        </div>
                        <div className="p-4 bg-base-100 rounded-lg">
                            <p className="font-medium">Ev Adresi</p>
                            <p className="text-gray-600 mt-1">Örnek Mahallesi, Örnek Sokak No:1 D:2</p>
                            <p className="text-gray-600">Kadıköy/İstanbul</p>
                        </div>
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
                                <span>{  'Ücretsiz' }</span>
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

                        <button className="w-full bg-primary bg-opacity-80 text-white py-3 rounded-lg font-semibold hover:bg-opacity-100 transition-all">
                            Siparişi Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;