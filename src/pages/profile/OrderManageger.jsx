import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { readOrders } from '../../firebase';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const OrderManager = () => {

  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user)
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortedOrders, setSortedOrders] = useState([]);


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Teslim Edildi":
        return "badge badge-success";
      case "Kargoda":
        return "badge badge-info";
      case "İşlemde":
        return "badge badge-warning";
      default:
        return "badge";
    }
  };



  // Sıralama işlemini gerçekleştiren fonksiyon
  const sortOrders = (data, option = 'date_desc') => {
    let sortedData = [...data];


    if (option === 'date_desc') {
      sortedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Tarihe göre azalan
    } else if (option === 'date_asc') {
      sortedData.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)); // Tarihe göre artan
    }

    setOrders(sortedData); // Sıralanan veriyi state'e kaydet
  };

  const getOrders = () => {
    readOrders(user.uid).then(res => {
      sortOrders(res.orders);
    })
  }

  useEffect(() => {
    if (user) {
      getOrders();
    }
  }, [user])

  const goToOrderWithState = (data) => {
    console.log(data)
    navigate(`/profile/orders/${data.id}`, {
      state: { order:data }
    });
  };



  return (
    <div className="min-h-screen  animate-fade w-full bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="hero bg-base-100 rounded-box mb-6">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">Sipariş Geçmişim</h1>
              <p className="py-2">Toplam {orders.length} sipariş</p>
            </div>
          </div>
        </div>

        {/* Arama ve Filtreleme */}
        <div className="card bg-base-100 mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="input-group flex items-center justify-center gap-x-4">
                  <input
                    type="text"
                    placeholder="Sipariş ID veya ürün ara..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <select
                className="select select-bordered w-full md:w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="shipping">Kargoda</option>
                <option value="processing">İşlemde</option>
              </select>
            </div>
          </div>
        </div>

        {/* Siparişler Listesi */}
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order.id} className="collapse collapse-arrow bg-base-100 rounded-box">
              <input
                type="checkbox"
                checked={expandedOrder === order.id}
                onChange={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              />
              <div className="collapse-title">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <div>
                      <span className="font-bold">{`ORD${(orders.length - i).toString().padStart(4, '0')}`}</span>
                      <span className="text-sm opacity-70 ml-2">
                        {new Date(order.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <span className={getStatusBadgeClass(order.status ? order.status : "İşlemde")}>
                      {order.status ? order.status : "İşlemde"}
                    </span>
                  </div>
                  <div className="font-bold">
                    {order.totalAmount ? order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : "--"}
                  </div>
                </div>
              </div>

              <div className="collapse-content">
                <div className="divider"></div>

                {/* Ürünler Tablosu */}
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Adet</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.basePrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Detay Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Teslimat Bilgileri */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-sm">Teslimat Adresi</h3>
                      <p className="text-sm">{order.address.addressDetail}</p>
                    </div>
                  </div>

                  {/* Ödeme Bilgileri */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-sm">Ödeme Yöntemi</h3>
                      <p className="text-sm">{order.paymentMethod ? order.paymentMethod : "--"}</p>
                    </div>
                  </div>

                  {/* Kargo Takip */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-sm">Kargo Takip No</h3>
                      <p className="text-sm">{order.trackiNo ? order.trackingNo : "--"}</p>
                      <button className="btn btn-primary text-white rounded-lg btn-sm mt-2">Kargo Takip</button>
                    </div>
                  </div>
                </div>
                <div  onClick={() => { goToOrderWithState(order) }} className='w-full flex items-center justify-center' >
                  <Link className='btn btn-primary w-[80%] my-4 text-white  rounded-lg'>Siparişi Ayrıntılı Görüntüle</Link>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderManager;