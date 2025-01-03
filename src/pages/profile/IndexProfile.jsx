import React, { useEffect, useState } from 'react'
import { FaRegBell, FaCheckCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { getUserbyId, updateUserProfile } from '../../firebase/userService';



export default function IndexProfile() {
  const user = useSelector(state => state.auth.user)
  const [form, setForm] = useState(
    {
      name: "",
      email: "",
      phoneNumber: "",
      district: "",
      county: "",
      emailVerified: false,
      phoneVerified: false,
      photoURL: ""
    }
  )

  useEffect(() => {
    if (user) {
      getUserbyId(user.uid).then(res => {
        setForm({
          displayName: res.displayName,
          email: res.email,
          phoneNumber: res.phoneNumber ? res.phoneNumber : "",
          county: res.county ? res.county : "",
          district: res.district ? res.district : "",
          emailVerified: res.emailVerified ? res.emailVerified : false,
          phoneVerified: res.phoneVerified ? res.phoneVerified : false,
          photoURL: res.photoURL ? res.photoURL : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        });
      })
    }
  }, [user])


  const handleUpdateProfile = async () => {
    await updateUserProfile(user.uid, form);
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm, // Mevcut form değerlerini koru
      [name]: value // Sadece değişen alanı güncelle
    }));
  };
  return (
    <div className='w-full animate-fade  px-8 py-4  space-y-8 flex rounded-md items-center justify-center flex-col h-auto'>
      <div className=' py-3 px-4 sm:px-8   w-full tracking-wider flex items-center justify-between rounded font-bold  bg-base-100'>
        <span>Profil</span>
        <div className='flex items-center justify-center gap-x-2'>
          <div ><FaRegBell size={22} /></div>

        </div>
      </div>
      <div className='flex items-center w-[90%] justify-center flex-col'>
        <div className="avatar pb-4">
          <div className="w-20 sm:w-32 max-w-full rounded">
            {form.photoURL?<img className='animate-fade' src={form.photoURL} />
              :<div className='w-full h-full bg-base-100 flex items-center justify-center'><span className="loading bg-primary loading-ring loading-lg"></span></div>
          }
          </div>
        </div>
        <form className='w-full space-y-4' action="">
          <div>
            <strong>Ad-Soyad</strong>
            <input type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Ad" className='w-full rounded input' />
          </div>
          <div>
            <strong>E-Posta</strong>
            <div className='flex items-center justify-center gap-x-4 sm:gap-x-8'>
              <input type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email" className='w-full rounded input' />
              <span className={`cursor-pointer tooltip ${form.emailVerified ? "tooltip-success" : "tooltip-warning"}`} data-tip={`${form.emailVerified ? "E-Posta Doğrulandı." : "E-Posta Doğrulanmadı."}`}>
                <FaCheckCircle className={`${form.emailVerified ? "text-success" : "text-warning"}`} size={24} />
              </span>
            </div>
          </div>
          <div>
            <strong>Telefon Numarası</strong>
            <div className='flex items-center justify-center gap-x-4 sm:gap-x-8'>
              <input type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Telefon" className='w-full rounded input' />
              <span className={`cursor-pointer tooltip ${form.emailVerified ? "tooltip-success" : "tooltip-warning"}`} data-tip={`${form.phoneVerified ? "Numara Doğrulandı." : "Numara Doğrulanmadı."}`}>
                <FaCheckCircle className={`${form.phoneVerified ? "text-success" : "text-warning"}`} size={24} />
              </span>
            </div>
          </div>
          <div>
            <strong>İlçe</strong>
            <input type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="İlçe" className='w-full rounded input' />
          </div>
          <div>
            <strong>Şehir</strong>
            <input type="text"
              name="county"
              value={form.county}
              onChange={handleChange}
              placeholder="İl" className='w-full rounded input' />
          </div>
        </form>
        <div className='flex items-center py-4 w-full justify-end '>
          <button onClick={handleUpdateProfile} className='btn text-gray-100 btn-accent rounded'>Bilgileri Güncelle</button>
        </div>
      </div>
    </div>
  )
}
