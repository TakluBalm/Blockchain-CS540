import React from 'react';
import FrontPage from './components/FrontPage';
import { Route, Routes } from "react-router-dom";
import UploadPage from './components/UploadPage';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/upload" element={<UploadPage />} />
        
      </Routes>
    </>
  );
}

export default App;
