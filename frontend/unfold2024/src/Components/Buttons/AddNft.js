import React, { useState, useEffect, useContext } from "react";
import Popup from "reactjs-popup";
import { AuthContext } from "../context/AuthContext";
import { toastFailed, toastSuccess } from "../Utils/ToastFunctions";
import './style.css';

const AddNft = ({setNftComponents,nftComponents}) => {
  const { setIsLoading,userId } = useContext(AuthContext);
  const [formdata, setformData] = useState({
    tokenAddress: "",
    tokenId: "",
  });

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setformData((preval) => ({
      ...preval,
      [name]: value,
    }));
  };

  

    const addNft = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/memes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              body: JSON.stringify({
                user_id: userId,
                token_address: formdata.tokenAddress,
                token_id: formdata.tokenId, 
              }),
          }
        );
        const data = await res.json();
        if (res.status === 201) {
          setNftComponents([...nftComponents,data])
          toastSuccess("added succesfully");
        }else{
          toastFailed(data.error);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // Handle request timeout
          console.log("Request timed out");
          toastFailed("Request timed out. Please try again later.");
        } else {
          console.log(error);
          toastFailed(error.message);
        }
      }
    };

  return (
    <Popup
      trigger={
        <button className="text-white">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </button>
      }
      position="left bottom"
    >
      <div className="flex items-center justify-center">
        <form
          className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <div className="mb-4">
            <label
              htmlFor="tokenAddress"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              tokenAddress
            </label>
            <input
              type="text"
              id="tokenAddress"
              name="tokenAddress"
              placeholder="Enter  token Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[16px] text-black"
              required
              value={formdata.tokenAddress}
              onChange={InputEvent}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="tokenId"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              tokenId
            </label>
            <input
              type="number"
              id="tokenId"
              name="tokenId"
              placeholder="Enter token Id"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[16px] text-black"
              required
              value={formdata.tokenId}
              onChange={InputEvent}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={addNft}
          >
            Submit
          </button>
        </form>
      </div>
    </Popup>
  );
};

export default AddNft;
