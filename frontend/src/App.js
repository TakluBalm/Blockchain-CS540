import React from 'react';
import FrontPage from './components/FrontPage';
import { Route, Routes } from "react-router-dom";
import UploadPage from './components/UploadPage';
import Result from './components/Result';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<Result /> } />
      </Routes>
    </>
  );
}

export default App;
