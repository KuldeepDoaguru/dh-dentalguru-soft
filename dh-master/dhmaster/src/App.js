
import "./App.css";
import React from 'react'
import { Route, Routes } from "react-router-dom";
import UniversalLogin from "./pages/UniversalLogin";
import { useSelector } from "react-redux";


function App() {

  const user = useSelector((state) => state.user);
  return (
    <Routes>
    
 
      <Route path="/" element={<UniversalLogin />} />

    </Routes>
  );
}

export default App;
