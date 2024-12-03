import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { FaChevronCircleUp } from "react-icons/fa";


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

  if (isVisible) {
    return (
      <div onClick={scrollToTop} className="fixed bg-transparent z-50 p-3 cursor-pointer hover:scale-110 transition duration-300 bottom-4 right-4">
        <FaChevronCircleUp  className='text-primary bg-transparent' size={28} />
      </div>
    );
  }
}
