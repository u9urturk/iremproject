import React, { useEffect, useState } from 'react'

export default function SelectionList({ data = [] , onSelectionChange ,definition}) {

    const [selectData, setselectData] = useState(null);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectData);
        }
    }, [selectData,onSelectionChange])

    const handleChange = (event) => {
        const selectedItem = data.find(item => item.id === String(event.target.value));
        setselectData(selectedItem);
    };
    console.log(selectData)
  
    return (
        <select onChange={handleChange} className="select rounded-md w-full">
            <option  disabled selected>{definition}</option>
            {
                data && data.map((item, index) => {
                    return (
                        <option value={item.id}
                        key={index}>{item.name}</option>
                    )
                })
            }
        </select>

    )
}
