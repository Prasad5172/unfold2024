import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toastFailed } from "../Utils/ToastFunctions";

function LeaderBoard() {
  const params = useParams();
  console.log(params.id);
  const [battlePlayers, setBattlePlayers] = useState([]);
  
  const {setIsLoading,userId } = useContext(AuthContext);
  useEffect(() => {
    const fetchLeaderBoard = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/battles/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (res.status === 500) {
          
        }else{
          setBattlePlayers(data);
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
      setIsLoading(false);
    };

    // fetchLeaderBoard();
  }, []);

  const players = [
    {
      name: "John Doe",
      address: "0x123456789ABCDEF",
      votes: 500,
    },
    { name: "Jane Smith", address: "0xABC123DEF456", votes: 250 },
    { name: "Mike Brown", address: "0xDEF789ABC123", votes: 200 },
    { name: "Alice Green", address: "0x456DEF789ABC", votes: 150 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Leaderboard</h1>

      {/* Winner Section */}
      <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg shadow-md mb-10">
        <img
          src="https://img.icons8.com/emoji/96/trophy-emoji.png"
          alt="Winner Trophy"
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-xl font-bold text-blue-700">Winner</h2>
        <p className="text-lg font-semibold">{winner?.name}</p>
        <p className="text-gray-600">{winner?.address}</p>
        <p className="text-green-700 font-bold">Votes: {winner?.votes}</p>
      </div>
    </div>
  );
}

export default LeaderBoard;
