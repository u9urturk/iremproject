import React, { useState, useEffect } from 'react'
import { Plus, Box, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import ProductAdd from '../../../components/ProductAdd'
import Products from '../Data/Products'

export default function ProductOperations() {
    const [productChanged, setProductChanged] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        mostViewedProduct: null,
        leastViewedProduct: null
    });

    const handleSetTotalProducts = (data) => {
        setStats({
            totalProducts: data,
            ...stats
        })
    }

    // Simulated data fetch - replace with actual data fetching logic
    useEffect(() => {
        const fetchProductStats = async () => {
            // Placeholder for actual API call
            setStats({
                mostViewedProduct: {
                    name: 'Smart Watch X1',
                    views: 4200,
                    growth: 22
                },
                leastViewedProduct: {
                    name: 'Classic Headphones',
                    views: 1200,
                    decline: 14
                }
            });
        };

        fetchProductStats();
    }, [productChanged]);

    const handleProductStateChange = (data) => {
        setProductChanged(data);
    }


    return (
        <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
            <div className="flex  justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Ürün İşlemleri</h1>
                <ProductAdd
                    productStateChange={handleProductStateChange}
                    className="btn btn-primary btn-outline"
                >

                </ProductAdd>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <Box className="text-secondary w-10 h-10" />
                            <div className="stat-desc text-right">
                                Jan 1st - Feb 1st
                            </div>
                        </div>
                        <h3 className="card-title text-lg">Toplam Ürün Sayısı</h3>
                        <p className="text-3xl font-bold text-primary">{stats.totalProducts?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <TrendingUp className="text-success w-10 h-10" />
                            <div className="stat-desc text-success">
                                +{stats.mostViewedProduct?.growth}%
                            </div>
                        </div>
                        <h3 className="card-title text-lg">En Çok İncelenen Ürün</h3>
                        <div>
                            <p className="text-2xl font-bold">{stats.mostViewedProduct?.name}</p>
                            <p className="text-xl">{stats.mostViewedProduct?.views.toLocaleString()} görüntülenme</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <TrendingDown className="text-error w-10 h-10" />
                            <div className="stat-desc text-error">
                                -{stats.leastViewedProduct?.decline}%
                            </div>
                        </div>
                        <h3 className="card-title text-lg">En Az İncelenen Ürün</h3>
                        <div>
                            <p className="text-2xl font-bold">{stats.leastViewedProduct?.name}</p>
                            <p className="text-xl">{stats.leastViewedProduct?.views.toLocaleString()} görüntülenme</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4">

                <Products totalProducts={handleSetTotalProducts} productChanged={productChanged} />
            </div>
        </div>
    )
}