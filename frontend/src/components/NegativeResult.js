import React from 'react'
import { MdNoEncryptionGmailerrorred } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { Buffer } from 'buffer';

export default function NegativeResult() {

    const MalData = [
        {
            id: 1,
            title: 'Data and File Malicous',
            description: `Data and File Uploaded were checked for ransomware using random forest machine learning and found to be malicous.`,
            button: MdNoEncryptionGmailerrorred,
            color: "text-red-600 w-20 h-20"
        },
        {
            id: 2,
            title: 'Data Restoration Process',
            description: `You can restore your data by clicking on the button below and mitigation process will be fired and data backup will soon be restored.`,
            button: BiError,
            color: "w-20 h-20 text-blue-800"
        }
    ]

    // Returns snapshot in zipped form
    const getRecoveryData = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/latestSnapshot');
            const blob = await res.blob();

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'recovery.zip'

            // Append the link to the document
            document.body.appendChild(downloadLink);

            // Trigger a click on the link to start the download
            downloadLink.click();

            // Remove the link from the document
            document.body.removeChild(downloadLink);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-black pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {MalData.map((data) => (
                    <article key={data.id} className='justify-between'>
                        <div className="w-full max-w-md px-8 bg-white py-4 mt-16 rounded-lg  shadow-lg">
                            <div className="flex justify-center -mt-16 md:justify-end">
                                <data.button className={data.color} />
                            </div>

                            <h2 className="mt-2 text-xl bg-white font-semibold text-black md:mt-0">{data.title}</h2>
                            <p className="mt-2 text-sm text-black">{data.description}</p>
                        </div>
                    </article>
                ))}
            </div>
            <div className="mt-10 text-center items-center">
                <button
                    className="w-40 flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={getRecoveryData}
                >
                    Recover Data
                </button>
            </div>
        </div>

    )
}
