import React, { useEffect, useState } from 'react'
import UpperNav from './UpperNav';
import PositiveResult from './PositiveResult';
import NegativeResult from './NegativeResult';

export default function Result() {
  
  const [success, setSuccess] = useState("");
  const [reason, setReason] = useState("");

  
  useEffect(() => {
    var x = sessionStorage.getItem("success")
    setSuccess(x);
    var y = sessionStorage.getItem("reason")
    setReason(y);

  }, [])

  return (
    <>
      <UpperNav />
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ransomware Detection and Recovery
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Random Forest ML Model for detecting Ransomware Attacks
            </p>
          </div>
          {success === "true" && <PositiveResult/> }
          {success !== "true" &&  <NegativeResult />}
        </div>
      </div>

    </>
  )
}
