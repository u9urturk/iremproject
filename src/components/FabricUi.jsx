import React, { useState, useEffect } from "react";

export default function FabricUi({ fabrics, handleInput }) {
    const [currentFabrics, setCurrentFabrics] = useState([]);

    useEffect(() => {
        handleInput("fabrics",currentFabrics);
    }, [currentFabrics]);

    const toggleFabricSelection = (fabric) => {
        setCurrentFabrics((prev) =>
            prev.includes(fabric.id)
                ? prev.filter((id) => id !== fabric.id)
                : [...prev, fabric.id]
        );
    };

    const isFabricSelected = (fabric) => currentFabrics.includes(fabric.id);

    return (
        <div>
            <button
                className="btn pl-3 flex justify-start font-normal bg-transparent border border-base-200 w-full"
                onClick={() => document.getElementById("modal_fabrics").showModal()}
            >
                {currentFabrics.length > 0
                    ? `${currentFabrics.length} Kumaş Seçildi`
                    : "Kumaş Seçiniz"}
            </button>
            <dialog id="modal_fabrics" className="modal">
                <div className="modal-box max-h-[80%] overflow-y-auto">
                    <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg">Kumaşlar</h3>
                        <div className="btn btn-primary">
                            {currentFabrics.length > 0
                                ? `${currentFabrics.length} Kumaş Seçildi`
                                : "En az bir kumaş seçin!"}
                        </div>
                    </div>
                    <div className="flex place-content-center pt-4 flex-wrap gap-x-4 gap-y-4">
                        {fabrics.map((fabric, key) => (
                            <div
                                key={fabric.name + key}
                                onClick={() => toggleFabricSelection(fabric)}
                                className={`w-20 ${
                                    isFabricSelected(fabric)
                                        ? "opacity-100 bg-primary"
                                        : "opacity-75"
                                } cursor-pointer relative rounded-lg shadow flex items-center justify-center h-20 group`}
                            >
                                <p className="absolute text-black animate-fade font-bold animate-duration-300 w-full px-2 py-1 hidden group-hover:block top-0">
                                    {fabric.name}
                                </p>
                                <div
                                    style={{
                                        backgroundColor: fabric.colorCode || "#ccc",
                                    }}
                                    className="w-10 h-10 rounded-full"
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Kapat</button>
                </form>
            </dialog>
        </div>
    );
}
