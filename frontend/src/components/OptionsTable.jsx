import React, { useState } from 'react'

const url = 'http://127.0.0.1:5000';

const OptionsTable = ({ setClsList, setOptionsSelected }) => {
    const [selectedClasses, setSelectedClasses] = useState([]);
    const clsList = ["Can", "HDPE", "PET_Bottle", "Plastic_wrapper", "Tetrapak"]
    const handleChange = (value) => {
        setSelectedClasses(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    }

    const handleSumbit = () => {
        setOptionsSelected(true);
        const clsObj = {};
        selectedClasses.forEach(item => {
            clsObj[item] = 0;
        });

        const postClsList = async () => {
            try {
                await fetch(url.concat('/receive_list'), {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ selectedClasses })
                })
                setClsList(clsObj);
            } catch (error) {
                console.log(error);
            }
        }

        postClsList();
    }

    return (
        <div className='flex flex-col items-center justify-start w-1/4 bg-gray-100 rounded-lg shadow-md m-4 p-2'>
            <table className="table-auto w-fit">
                <thead>
                    <tr>
                        <th className="border-green-600 border-2 px-4 py-2">Sort</th>
                        <th className="border-green-600 border-2 px-4 py-2">Waste Classes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        clsList.map(item => {
                            return (
                                <tr key={item} className='bg-gray-100'>
                                    <td className="border-green-600 border-2 px-4 py-2"><input type="checkbox" value={item} onChange={(e) => handleChange(e.target.value)} checked={selectedClasses.includes(item)} /></td>
                                    <td className="border-green-600 border-2 px-4 py-2">{item}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button
                onClick={handleSumbit}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
                Submit Options
            </button>
        </div>
    )
}

export default OptionsTable