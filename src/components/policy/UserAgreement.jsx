// src/components/UserAgreement.js
import React from 'react';

const UserAgreement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Kullanıcı Sözleşmesi</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Tanımlar</h2>
        <p>
          Bu sözleşmede yer alan "Şirket", İrem Ceyiz Evi’ni ifade eder. "Kullanıcı", İrem Ceyiz Evi'ni ziyaret eden ve/veya kullanan kişiyi ifade eder.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Hizmetler</h2>
        <p>
          İrem Ceyiz Evi, kullanıcılara ceyiz ve nakış ürünleri sunmaktadır. Şirket, hizmetlerini değiştirme, ekleme veya kaldırma hakkına sahiptir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Kullanım Koşulları</h2>
        <ul className="list-disc list-inside">
          <li>Kullanıcı, İrem Ceyiz Evi’ni yasal amaçlarla kullanmakla yükümlüdür.</li>
          <li>Kullanıcı, Şirket’in yazılı izni olmadan içeriği kopyalayamaz, dağıtamaz veya kullanamaz.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Üyelik ve Hesap Güvenliği</h2>
        <ul className="list-disc list-inside">
          <li>Kullanıcı, doğru ve eksiksiz bilgi vermeyi kabul eder.</li>
          <li>Kullanıcı, hesap güvenliğinden tamamen sorumludur.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Ürün ve Hizmetler</h2>
        <p>
          Satın alınan ürünlerin açıklamaları, fiyatları ve teslimat koşulları İrem Ceyiz Evi'nde belirtilmiştir.
          Ürünlerdeki hatalardan dolayı Şirket sorumlu değildir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Fikri Mülkiyet</h2>
        <p>
          İrem Ceyiz Evi'de bulunan tüm içerik ve tasarımlar, Şirket’e aittir ve izinsiz kullanımı yasaktır.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Yasal Sorumluluk</h2>
        <ul className="list-disc list-inside">
          <li>Şirket, kullanıcıların İrem Ceyiz Evi'ni kullanmalarından doğan herhangi bir zarardan sorumlu değildir.</li>
          <li>Şirket, yasa dışı faaliyetleri raporlamakla yükümlüdür.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Gizlilik</h2>
        <p>
          Kullanıcı bilgileri, Şirket’in Gizlilik Politikası’na uygun olarak işlenir ve korunur.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">9. Sözleşme Değişiklikleri</h2>
        <p>
          Şirket, bu sözleşmeyi zaman zaman güncelleyebilir. Kullanıcılar, değişiklikleri düzenli olarak kontrol etmelidir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">10. İletişim</h2>
        <p>
          Sorular veya sorunlar için Şirket ile [İletişim Bilgileri] üzerinden iletişime geçebilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default UserAgreement;
