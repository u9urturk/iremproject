// OrderSummary.js
import React from "react";

const OrderSummary = ({ selectedCategory, selectedFeatures, onConfirm, onEdit }) => {
    return (
        <div className="max-w-4xl animate-fade-left mx-auto mt-8 p-6 bg-white border rounded shadow">
            <h2 className="text-2xl font-bold text-center mb-6">Sipariş Özeti</h2>
            <div className="space-y-4">
                <div className="p-4 border rounded">
                    <h3 className="text-lg font-semibold">Seçilen Kategori</h3>
                    <p className="text-gray-600">{selectedCategory?.name}</p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="text-lg font-semibold">Seçilen Özellikler</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {Object.entries(selectedFeatures).map(([key, value]) => (
                            <li key={key}>
                                <span className="font-medium">{key}:</span> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={onEdit}
                >
                    Geri Dön
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onConfirm}
                >
                    Siparişi Onayla
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
