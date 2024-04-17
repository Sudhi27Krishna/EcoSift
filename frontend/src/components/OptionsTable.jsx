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
        <div className='flex flex-col items-center justify-start w-1/4 rounded-lg shadow-2xl mx-2 p-2'>
            <div className="flex flex-col justify-center overflow-x-auto shadow-md sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Sort
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Waste Classes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clsList.map(item => {
                                return (
                                    <tr key={item} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input className="ml-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    type="checkbox" value={item} onChange={(e) => handleChange(e.target.value)} checked={selectedClasses.includes(item)} />
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item}
                                        </th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <button
                    onClick={handleSumbit}
                    className="font-Outfit-Regular bg-blue-500 text-white py-3 px-4 rounded-b hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                    Submit Options
                </button>
            </div>
        </div>
    )
}

export default OptionsTable