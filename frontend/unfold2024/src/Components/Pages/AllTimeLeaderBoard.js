import React, { useContext, useState,useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toastFailed } from "../Utils/ToastFunctions";

function AllTimeLeaderBoard() {
  // Example data
  // const leaders = [
  //   { name: "Alice Gold", address: "0x123Gold", votes: 500 },
  //   { name: "Bob Silver", address: "0x456Silver", votes: 400 },
  //   { name: "Charlie Bronze", address: "0x789Bronze", votes: 300 },
  //   { name: "David", address: "0x101David", votes: 200 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  //   { name: "Eve", address: "0x202Eve", votes: 150 },
  // ];
  const [battlePlayers, setBattlePlayers] = useState([]);
  const { isLoading, setIsLoading } = useContext(AuthContext);
  useEffect(() => {
    const fetchAllTimeLeaders = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/leaderboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (data.code === 200) {
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

    fetchAllTimeLeaders();
  }, []);

  const [winner, second, third, ...remainingUsers] = battlePlayers;

  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold text-center">All-Time Leaderboard</h1>

      {/* Winner Section */}
      {winner && (
        <div className="flex flex-col items-center">
          <img
            src="https://img.icons8.com/emoji/96/1st-place-medal-emoji.png"
            alt="Gold Cup"
            className="w-20 h-16"
          />
          <h2 className="text-lg font-bold text-yellow-600">{winner.name}</h2>
          <p className="text-gray-600 text-sm">{winner.address}</p>
          <p className="text-blue-500 font-bold">Votes: {winner.votes}</p>
        </div>
      )}

      {/* Silver and Bronze Section */}
      <div className="grid grid-cols-3 gap-4 mb-4 items-center">
        {/* Silver - Second Place */}
        {second && (
          <div className="text-center">
            <img
              src="https://img.icons8.com/emoji/96/2nd-place-medal-emoji.png"
              alt="Silver Cup"
              className="w-16 h-12 mx-auto"
            />
            <h2 className="text-lg font-semibold">{second.name}</h2>
            <p className="text-gray-600 text-sm">{second.address}</p>
            <p className="text-blue-500 font-bold">Votes: {second.votes}</p>
          </div>
        )}

        {/* Empty space to center Winner */}
        <div></div>

        {/* Bronze - Third Place */}
        {third && (
          <div className="text-center">
            <img
              src="https://img.icons8.com/emoji/96/3rd-place-medal-emoji.png"
              alt="Bronze Cup"
              className="w-16 h-12 mx-auto "
            />
            <h2 className="text-lg font-semibold">{third.name}</h2>
            <p className="text-gray-600 text-sm">{third.address}</p>
            <p className="text-blue-500 font-bold">Votes: {third.votes}</p>
          </div>
        )}
      </div>

      {/* Remaining Users */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Address</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Votes</th>
            </tr>
          </thead>
          <tbody>
            {remainingUsers.map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-200`}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.address}</td>
                <td className="px-4 py-2 text-blue-600 font-bold">{user.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllTimeLeaderBoard;
