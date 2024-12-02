import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { toastFailed, toastSuccess } from "./Utils/ToastFunctions";
import { useNavigate } from "react-router-dom";

function UserForm() {
  const navigate = useNavigate();
    const {userAddress,setUserAddress,setAuthenticated,formdata,setformData,setUserId} = useContext(AuthContext);
  

  const InputEvent = (event) => {
    // console.log(formdata)
    const { name, value } = event.target;
    setformData((preval) => ({
      ...preval,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check if MetaMask is available
    if (window.ethereum) {
      try {
        // Request wallet connection
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: formdata.name,
                email: formdata.email,
                wallet_address: userAddress, 
              }),
            }
          );
          const data = await res.json();
          console.log(data);
          if (res.status === 201) {
            setAuthenticated(true);
            setUserId(data.id);
            toastSuccess("Login successfully!");
            navigate("/")
          } else {
            toastFailed(data.error || "Failed to create a user");
          }
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Request timed out");
            toastFailed("Request timed out. Please try again later.");
          } else {
            console.log(error);
            toastFailed(error.message);
          }
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      toastFailed("Please install MetaMask extension!");
    }
  };

  
  return (
    <>
      <div className="flex items-center justify-center  ">
        <p className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-1"
              
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[16px] text-black"
              required
              value={formdata.name}
              onChange={InputEvent}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
              
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[16px] text-black"
              required
              value={formdata.email}
              onChange={InputEvent}
            />
          </div>
          <p
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={handleSubmit}
          >
            Submit
          </p>
        </p>
      </div>
    </>
  );
}

export default UserForm;
