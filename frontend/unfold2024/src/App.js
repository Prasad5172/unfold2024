import React, { useState } from "react";
import "./App.css";
import { HashLoader } from "react-spinners";
import { NavLink } from "react-router-dom";
import RightDashBoard from "./Components/RightDashBoard";
import LeftSideDashBoard from "./Components/LeftSideDashBoard";
import { AuthContext } from "./Components/context/AuthContext";
import LandingComponent from "./Components/Pages/LandingComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Fix useState destructuring
  const [userAddress, setUserAddress] = useState("0x0000000000000000000000000000000000000000");
  const [authenticated,setAuthenticated] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [formdata,setformData] = useState({
    name:"",
    email:""
  });
  const [userId,setUserId] = useState(0);

  return (
    <AuthContext.Provider
      value={{
        userAddress,
        setUserAddress,
        setAuthenticated,
        isLoading,
        setIsLoading,
        formdata, 
        setformData,
        userId,
        setUserId
      }}
    >
      {!authenticated  ? (
        <LandingComponent /> // Show loading if address is 0x0
      ) : (
        <div className="flex h-screen bg-gray-100">
          <LeftSideDashBoard />
          <RightDashBoard />
          
        </div>
      )}
      <ToastContainer position="top-right" />
      
    </AuthContext.Provider>
  );
}

export default App;
