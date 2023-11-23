import React from 'react'
import { FaCheck, FaCheckDouble } from "react-icons/fa";

export default function PositiveResult() {
    const normalData = [
        {
            id: 1,
            title: 'Data and File Normal',
            description: `Data and File Uploaded were checked for ransomware using random forest machine learning and found to be normal.`,
            button: FaCheck,
        },
        {
            id: 2,
            title: 'Data Uploaded Successfully',
            description: `Data was uploaded successfully and securedly onto blockchain through smart contract.`,
            button: FaCheckDouble,
        }
    ]
    return (
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-black pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {normalData.map((data) => (
                <article key={data.id} className='justify-between'>
                    <div className="w-full max-w-md px-8 bg-white py-4 mt-16 rounded-lg  shadow-lg">
                        <div className="flex justify-center -mt-16 md:justify-end">
                            <data.button className="w-20 h-20 text-green-800" />
                        </div>

                        <h2 className="mt-2 text-xl bg-white font-semibold text-black md:mt-0">{data.title}</h2>
                        <p className="mt-2 text-sm text-black">{data.description}</p>
                    </div>
                </article>
            ))}
        </div>
    )
}
