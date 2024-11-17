import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { FcUpload } from "react-icons/fc";


export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Bileşen unmount olduğunda dinleyiciyi kaldır
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed z-50 bottom-4 right-4">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-brandGreen z-50 text-white p-3 rounded-full shadow-lg hover:scale-110 transition duration-300"
        >
          <FcUpload size={20} />

        </button>
      )}
    </div>
  );
}
