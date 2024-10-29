// src/components/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Bilgi Toplama</h2>
        <p>
          Şirket, kullanıcıların kişisel bilgilerini, örneğin ad, e-posta adresi ve ödeme bilgilerini toplar.
          Kullanıcılar hakkında topladığımız diğer bilgiler, web sitesi kullanım verileri ve çerezler yoluyla
          elde edilen bilgilerdir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Bilgi Kullanımı</h2>
        <p>
          Toplanan bilgiler, kullanıcı deneyimini kişiselleştirmek, hizmetleri geliştirmek ve kullanıcıyla iletişim
          kurmak için kullanılır. Bilgiler, üçüncü şahıslarla paylaşılabilir ancak sadece hizmetlerin sağlanması
          amacıyla.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Çerezler</h2>
        <p>
          Çerezler, web sitesinin performansını iyileştirmek için kullanılır. Çerezlerin nasıl kullanıldığı hakkında
          daha fazla bilgi için Çerez Politikası’nı inceleyebilirsiniz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Bilgi Güvenliği</h2>
        <p>
          Şirket, kullanıcı bilgilerini korumak için uygun güvenlik önlemlerini alır. Ancak, internet üzerinden
          iletilen bilgilerin güvenliğini garanti edemeyiz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Haklar</h2>
        <p>
          Kullanıcılar, kişisel bilgilerine erişme, düzeltme ve silme haklarına sahiptir. Bu hakları kullanmak için
          Şirket ile iletişime geçebilirsiniz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Politika Değişiklikleri</h2>
        <p>
          Bu gizlilik politikası zaman zaman güncellenebilir. Kullanıcılar, değişiklikleri düzenli olarak kontrol etmelidir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. İletişim</h2>
        <p>
          Gizlilik politikası hakkında sorularınız varsa, [İletişim Bilgileri] üzerinden bize ulaşabilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
