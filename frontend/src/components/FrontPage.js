import React from 'react'
import { Link } from 'react-router-dom'
const posts = [
    {
      id: 1,
      title: 'Setting Up a Blockchain Network',
      description:
        `We created smart contracts and deployed them on the Ethereum blockchain. 
        This was for sole purpose of having our data stored on the blockchain securly.`,
      category: { title: 'Ethereum IDE, Remix' },
    },
    {
      id: 2,
      title: 'Creating APIs for Timely Data Backups',
      description:
        `We created backend framework for backing up health data on Blokchain through timely backups.
        Data is stored on blockchain through smart contracts as well as on our server.`,
      category: { title: 'Flask, Gnache' },
    },
    {
      id: 3,
      title: 'Detecting and Mitigating Ransomware Attacks',
      description:
        `We have modeled Random Forest ML Model for detecting Ransomware Attacks and 
        used various techniques to mitigate the attack.`,
      category: { title: 'Python, Random Forest Model' },
    },
  ]
  
export default function FrontPage() {
    return (
    <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    CS540 Blockchain Project
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Blockchain-Enabled Security Framework Against Ransomware Attacks for Smart Healthcare Systems.
                </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                        <div className="flex items-center gap-x-4 text-xs">
                            <p className="text-gray-500">
                                Step {post.id}
                            </p>
                            <p className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                                {post.category.title}
                            </p>
                        </div>
                        
                        <div className="group relative">
                            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                {post.title}
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                {post.description}
                            </p>
                        </div>
                    </article>
                ))}
            </div> 

            <div className="mt-10 text-center items-center">
                <Link 
                    className="w-32 flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80" 
                    to="/upload"
                >
                    Get Started
                </Link>
            </div>
        </div>
    </div>
    )
  }
  