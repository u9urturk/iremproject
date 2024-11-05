import { useState, useEffect } from 'react';

const useProgressiveValue = (initialValue, targetValue, duration = 2000) => {
    const [value, setValue] = useState(initialValue); // Başlangıç değeri
    const stepTime = duration / targetValue; // Her adımda geçen süre

    useEffect(() => {
        const interval = setInterval(() => {
            setValue((prevValue) => {
                if (prevValue < targetValue) {
                    return prevValue + 1; // Her seferinde 1 artır
                } else {
                    clearInterval(interval); // Hedefe ulaştığında durdur
                    return prevValue;
                }
            });
        }, stepTime);

        return () => clearInterval(interval); // Bileşen unmount olduğunda temizle
    }, [targetValue, stepTime]);

    return value;
};

export default useProgressiveValue;
