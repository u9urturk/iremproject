import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash, Home, Building, Check } from 'lucide-react';
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from '../../firebase';
import { useSelector } from 'react-redux';

const AddressManager = ({handleJustAdd=false,onClose,mainPage=null}) => {
    const user = useSelector(state => state.auth.user)

    const [addresses, setAddresses] = useState([]);
    const [justAdd, setJustAdd] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        phoneNumber: '',
        city: '',
        district: '',
        neighborhood: '',
        addressDetail: '',
        isDefault: false
    });

    useEffect(() => {
        loadAddresses();
    }, [user]);

    useEffect(() => {
      if(handleJustAdd === true){
        setIsAddModalOpen(true)
        setJustAdd(true);
      }else{
        setIsAddModalOpen(false)
        setJustAdd(false);
      }
    }, [handleJustAdd])
    

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const result = await getUserAddresses(user.uid);
            setAddresses(result.addresses);
        } catch (error) {
            console.error('Load addresses error:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingAddress) {
                await updateAddress(user.uid, editingAddress.id, formData);
            } else {
                await createAddress(user.uid, formData);
            }
            setIsAddModalOpen(false);
            setEditingAddress(null);
            resetForm();
            loadAddresses();
            onClose(true);
        } catch (error) {
            console.error('Submit address error:', error);
        }
        setLoading(false);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData(address);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteAddress(user.uid, addressId);
                loadAddresses();
            } catch (error) {
                console.error('Delete address error:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            fullName: '',
            phoneNumber: '',
            city: '',
            district: '',
            neighborhood: '',
            addressDetail: '',
            isDefault: false
        });
    };

   if(justAdd === false && mainPage === true){
    return (
        <div className="container mx-auto min-h-screen  p-4 max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="text-primary" />
                    Adres Yönetimi
                </h1>
                <button
                    onClick={() => {
                        setIsAddModalOpen(true);
                        setEditingAddress(null);
                        resetForm();
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Adres Ekle
                </button>
            </div>

            {/* Address List */}
            {loading ? (
                <div className="flex justify-center">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                </div>
            ) : addresses.length === 0 ? (
                <div className="card bg-base-200">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center">Henüz adres eklenmemiş</h2>
                        <p>Yeni bir adres eklemek için yukarıdaki butonu kullanabilirsiniz.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div key={address.id} className="card bg-base-200 animate-fade shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {address.isDefault ? <Home className="text-primary" /> : <Building />}
                                        <h2 className="card-title">{address.title}</h2>
                                    </div>
                                    {address.isDefault && (
                                        <div className="badge badge-primary">Varsayılan</div>
                                    )}
                                </div>
                                <p className="font-medium">{address.fullName}</p>
                                <p className="text-sm">{address.phoneNumber}</p>
                                <p className="text-sm text-gray-600">
                                    {address.neighborhood}, {address.district}/{address.city}
                                </p>
                                <p className="text-sm">{address.addressDetail}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Edit size={16} />
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="btn btn-ghost btn-sm text-error"
                                    >
                                        <Trash size={16} />
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <dialog className={`modal ${isAddModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-4">
                        {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Adres Başlığı</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Ad Soyad</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Telefon</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Şehir</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">İlçe</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mahalle</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.neighborhood}
                                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Adres Detayı</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={formData.addressDetail}
                                    onChange={(e) => setFormData({...formData, addressDetail: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Varsayılan adres olarak ayarla</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingAddress(null);
                                    resetForm();
                                }}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <Check size={20} />
                                )}
                                {editingAddress ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="modal-backdrop bg-neutral opacity-40" onClick={() => setIsAddModalOpen(false)}></div>
            </dialog>
        </div>
    );
   }else if(justAdd === true && mainPage === false){
    return (
        <div className="container mx-auto p-4 max-w-6xl">
            
            {/* Add/Edit Modal */}
            <dialog className={`modal ${isAddModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-4">
                        {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Adres Başlığı</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Ad Soyad</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Telefon</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Şehir</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">İlçe</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mahalle</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.neighborhood}
                                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Adres Detayı</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={formData.addressDetail}
                                    onChange={(e) => setFormData({...formData, addressDetail: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Varsayılan adres olarak ayarla</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingAddress(null);
                                    resetForm();
                                    onClose(false);
                                }}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <Check size={20} />
                                )}
                                {editingAddress ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="modal-backdrop bg-neutral opacity-40" onClick={() => setIsAddModalOpen(false)}></div>
            </dialog>
        </div>
    );
   }
};

export default AddressManager;