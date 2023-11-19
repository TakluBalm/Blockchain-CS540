import React from "react";
import { useNavigate } from "react-router-dom";


function UpperNav() {
  const navigate = useNavigate();
  const handleButton = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <>
        <nav className=" bg-black border-gray-200  sm:px-2 lg:px-4 py-2.5 w-full">
          <div className="flex">
            <button
              onClick={handleButton}
              style={{ color: "white", fontSize: "30px" }}
              className=" flex-1 flex-wrap justify-between items-center py-1 mx-auto max-w-screen-xl"
            >
              CS540 Blockchain Project
            </button>
          </div>
        </nav>
    </>
  );
}

export default UpperNav;