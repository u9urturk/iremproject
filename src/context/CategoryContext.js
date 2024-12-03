import React, { createContext, useContext, useEffect, useState } from "react";
import { getCategories } from "../firebase/categoryService";
import { getColors } from "../firebase/colorService";
import { getAllFabrics } from "../firebase/fabricService";
import { getPatterns } from "../firebase/patternService";

// Context oluşturma
const CategoryContext = createContext();

// Context sağlayıcı
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [patterns, setPatterns] = useState([]);


    useEffect(() => {
        getCategories().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                setCategories(prevState => [...prevState, data])
            })
        })

        getColors().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                setColors(prevState => [...prevState, data])
            })
        })

        getPatterns().then(res => {
            res.patterns.forEach((pattern) => {
                setPatterns(prevState => [...prevState, pattern])
            })
        })

        getAllFabrics().then(res => {
            res.forEach((doc) => {
                let data = { id: doc.id, ...doc.data() }
                setFabrics(prevState => [...prevState, data])
            })
        })
    }, []);

    // Tüm kategorileri getir
    const getAllCategories = () => categories;

    // ID'ye göre kategori adını getir
    const getCategoryNameById = (id) => {
        const category = categories.find((cat) => cat.id === id);
        return category ? category.name : "Kategori Bulunamadı";
    };

    return (
        <CategoryContext.Provider
            value={{
                patterns,
                fabrics,
                colors,
                categories,
                getAllCategories,
                getCategoryNameById,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

// Context'i kullanmak için özel bir hook
export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
};
