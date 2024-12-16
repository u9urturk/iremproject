import React, { useState } from "react";

const FeaturePicker = ({ features, onSelectFeatures }) => {
  const [selectedFeatures, setSelectedFeatures] = useState({});

  const handleFeatureSelect = (featureKey, value) => {
    const updatedFeatures = {
      ...selectedFeatures,
      [featureKey]: value,
    };
    setSelectedFeatures(updatedFeatures);
    onSelectFeatures(updatedFeatures); // Parent component'e seçimleri bildir
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-left">
      <h2 className="text-2xl font-bold text-center mb-6">Özellik Seçimi</h2>
      <div className="space-y-6">
        {features.map((feature) => (
          <div key={feature.key} className="p-4 border rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">{feature.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {feature.options.map((option) => (
                <button
                  key={option.value}
                  className={`px-4 py-2 rounded border-2 text-sm font-medium 
                    ${selectedFeatures[feature.key] === option.value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => handleFeatureSelect(feature.key, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturePicker;