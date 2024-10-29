// src/components/CookiePolicy.js
import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Çerez Politikası</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Çerez Nedir?</h2>
        <p>
          Çerezler, web tarayıcınızda saklanan küçük veri parçalarıdır. Web sitesinin işleyişini sağlamak ve
          kullanıcı deneyimini geliştirmek için kullanılır.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Hangi Çerezleri Kullanıyoruz?</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Zorunlu Çerezler:</strong> Web sitesinin temel işlevlerini sağlamak için kullanılır.</li>
          <li><strong>Performans Çerezleri:</strong> Web sitesinin performansını analiz etmek için kullanılır.</li>
          <li><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için kullanılır.</li>
          <li><strong>Reklam Çerezleri:</strong> Kullanıcılara kişiselleştirilmiş reklamlar sunmak için kullanılır.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Çerez Yönetimi</h2>
        <p>
          Çerezleri tarayıcı ayarlarınızdan yönetebilir veya silebilirsiniz. Ancak, bazı web sitesi işlevleri
          çerezler devre dışı bırakıldığında çalışmayabilir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Üçüncü Taraf Çerezler</h2>
        <p>
          Web sitesinde üçüncü taraflar tarafından yerleştirilen çerezler olabilir. Bu çerezler, üçüncü tarafların
          politikalarına tabidir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Çerez Politikası Değişiklikleri</h2>
        <p>
          Çerez politikası zaman zaman güncellenebilir. Kullanıcılar, değişiklikleri düzenli olarak kontrol etmelidir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. İletişim</h2>
        <p>
          Çerez politikası hakkında sorularınız varsa, [İletişim Bilgileri] üzerinden bize ulaşabilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;
