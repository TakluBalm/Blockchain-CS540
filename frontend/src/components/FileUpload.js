import React, {useState} from 'react'
export default function FileUpload() {

    const [name, setName] = useState("");
    const [file, setFile] = useState(null);

    const getName = (e) => {
        setName(e.target.value);
    }
    const getFile = (e) => {
        setFile(e.target.files[0]);
    }

    const uploadData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);

       // request to server to save application data\
       	try{
			const res = await fetch("http://localhost:5000/upload", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			console.log(data);
		} catch (e) {
			console.log(e);
		}        
     }
    return (
        <>
            <div class="relative  flex items-center justify-center  bg-no-repeat bg-cover">
                <div class="sm:max-w-lg w-full p-5 bg-white rounded-xl z-10">
                    <div class="text-center">
                        <h2 class="mt-5 text-3xl font-bold text-gray-900">
                            Upload your data file here
                        </h2>
                        {/* <p class="mt-2 text-sm text-gray-400">Lorem ipsum is placeholder text.</p> */}
                    </div>

                    <div class="mt-8 space-y-3" >
                        <div class="grid grid-cols-1 space-y-2">
                            <label class="text-sm font-bold text-gray-500 tracking-wide">Name</label>
                            <input 
                                onChange={getName}
                                value={name}
                                class="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" 
                                type="" placeholder="Hacker"
                            />
                        </div>
                       
                        <div class="grid grid-cols-1 space-y-2">
                            <label class="text-sm font-bold text-gray-500 tracking-wide">Upload Data</label>
                            <div class="flex items-center justify-center w-full">
                                <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                                    <div class="h-full w-full text-center flex flex-col items-center justify-center  ">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                                            <img class="h-36 object-center" src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg" alt="file"/>
                                        </div>
                                        <p class="pointer-none text-gray-500 ">
                                            {file && <p>{file.name}</p>}
                                            {!file && 
                                                <p>
                                                <span class="text-sm">Drag and drop</span> files here <br /> or <span class="text-blue-600 hover:underline">select a file</span> from your computer 
                                                </p>
                                            }
                                        </p>
                                    </div>
                                    <input type="file" class="hidden" onChange={getFile}/>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
							onClick={uploadData} >
                                Upload to Server
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


