import React, { useEffect, useState } from 'react'
import { getAllOrders } from '../../../../firebase/orderService';

export default function OrderManagment() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            const fetchedOrders = await getAllOrders();
            setOrders(fetchedOrders.orders);
        };

        fetchOrders();
    }, []);


    const getTotalAmount = () => {
        return orders.reduce((total, order) => {
            return total + (order.totalAmount || 0);
        }, 0);
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        console.log(`Sipariş ID: ${orderId} durumu güncellendi: ${newStatus}`);
    };

    function OrderStatus(statusCode = 0) {
        const orderStatus = {
            0: { label: "Yeni Sipariş", color: "bg-blue-500" },
            1: { label: "Hazırlanıyor", color: "bg-orange-500" },
            2: { label: "Yolda", color: "bg-green-500" },
            3: { label: "Teslim Edildi", color: "bg-gray-500" },
            4: { label: "İptal Edildi", color: "bg-red-500" },

        };

        const status = orderStatus[statusCode];

        return <span className={`px-3 py-1 text-white rounded ${status?.color}`}>{status?.label || "Bilinmiyor"}</span>;
    }

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='animate-fade max-w-7xl  mx-auto'>
            {/* cards */}
            <div className='flex flex-wrap justify-between items-center m-8 gap-4'>
                <div className="card bg-base-200 w-96 shadow-xl">
                    <div className="card-body flex justify-start gap-y-12">
                        <h1 className="card-title "><strong>Toplam Siparişler</strong></h1>
                        <strong className='font-bold text-4xl'> <p>{orders.length}</p></strong>
                    </div>
                </div>
                <div className="card bg-base-200 w-96 shadow-xl">
                    <div className="card-body flex justify-start gap-y-12">
                        <h1 className="card-title "><strong>Toplam Gelir</strong></h1>
                        <strong className='font-bold text-4xl'> <p>{getTotalAmount()} ₺</p></strong>
                    </div>
                </div>
            </div>

            <div >
                <div className="bg-base-200 shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-semibold mb-6">Sipariş Yönetimi</h1>

                    <div className="mb-6 flex items-center justify-between">
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                className="w-full p-2 bg-base-100 rounded-lg focus:outline-none"
                                placeholder="Sipariş ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Filtrele</button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Rapor</button>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        {filteredOrders.map((order) => (
                            <li key={order.id} className="bg-base-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200 ease-in-out">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                                        <p className="text-sm text-gray-600">Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                                        <p className="text-sm text-gray-600">Müşteri: {order.address.fullName || "Bilinmiyor"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-semibold text-blue-600">{order.totalAmount ? `${order.totalAmount} ₺` : "Bilinmiyor"}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-gray-500">
                                    <p className="text-sm">Adres: {order?.address.addressDetail || "Bilinmiyor"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className='mt-4 flex space-x-4'>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'Onaylandı')}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'Teslim Edildi')}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                        >
                                            Teslim Edildi
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'İptal Edildi')}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            İptal Et
                                        </button>
                                    </div>
                                    {OrderStatus(order?.status)}

                                </div>
                            </li>
                        ))}
                    </ul>

                    {filteredOrders.length === 0 && (
                        <div className="mt-6 text-center text-gray-500">
                            <p>Henüz sipariş yok.</p>
                        </div>
                    )}

                    <div className="mt-6 text-right">
                        <h2 className="text-2xl font-semibold text-gray-900">Toplam Tutar: {getTotalAmount()} ₺</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
