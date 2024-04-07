import React from 'react'

const Updates = ({ clsList, coordList }) => {
  return (
    <div className='flex flex-col items-center justify-between w-1/4 bg-gray-200 rounded-lg shadow-md mx-2 p-2'>
      <div className="flex flex-col justify-center overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Waste Classes
              </th>
              <th scope="col" className="px-6 py-3">
                Current
              </th>
              <th scope="col" className="px-6 py-3">
                Encountered
              </th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(clsList).map((cls) => {
                return (
                  <tr key={cls} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {cls}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {clsList[cls]["Current"]}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {clsList[cls]["Total"]}
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-center overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Item Id
              </th>
              <th scope="col" className="px-6 py-3">
                Item Class
              </th>
              <th scope="col" className="px-6 py-3">
                Item Coordinates
              </th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(coordList).map((item_id) => {
                return (
                  <tr key={item_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item_id}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {coordList[item_id][2]}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      ({coordList[item_id][0] + "," + coordList[item_id][1]})
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Updates