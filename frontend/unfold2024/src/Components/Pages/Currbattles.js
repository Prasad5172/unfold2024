import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toastFailed } from "../Utils/ToastFunctions";

function Currbattles() {
  const {userId} = useContext(AuthContext);
  const navigate = useNavigate();
  const [currBattles, setCurrBattles] = useState([]);
  const [showBattles, setShowBattles] = useState(false);

  useEffect(() => {
    // Function to check if the current time is before 10 AM IST
    const checkTime = () => {
      const now = new Date();
      const istOffset = 330; // IST is UTC+5:30
      const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
      const istNow = new Date(utcNow + istOffset * 60000);

      // Check if it's past 10 AM IST
      if (istNow.getHours() < 10) {
        setShowBattles(false);
      }
    };

    checkTime();

    // Optionally, refresh the time check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCurrBattles = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/battles/live`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (res.status === 500) {
          toastFailed(data.error);
        }else{
          setCurrBattles(data);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request timed out");
          toastFailed("Request timed out. Please try again later.");
        } else {
          console.log(error);
          toastFailed(error.mefetchCurrBattlesssage);
        }
      }
    };

    fetchCurrBattles();
  }, []);


  const handleJoin = async () => {
    // try {
    //   const res = await fetch(
    //     `${process.env.REACT_APP_BACKEND_URL}/battle/register`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         user_id: userId,
    //         meme_id: ,
    //         wallet_address: tokenAddress,
    //         token_address:
    //       }),
    //     }
    //   );
    //   const data = await res.json();
    //   console.log(data);
    //   if (data.code === 200) {
    //     setCurrBattles(data);
    //   }
    // } catch (error) {
    //   if (error.name === "AbortError") {
    //     console.log("Request timed out");
    //     toastFailed("Request timed out. Please try again later.");
    //   } else {
    //     console.log(error);
    //     toastFailed(error.message);
    //   }
    // }
  };
  const types = ["Political", "Sexist", "Dark", "Celebrity", "Regular"];

  return (
    <div className="relative h-full overflow-auto pt-6">
      {showBattles ? (
        <div className="flex flex-wrap justify-between">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-white">
              Current Battles
            </h1>
            <ul className="space-y-4">
              {currBattles.map((battle) => (
                <li
                  key={battle.id}
                  className="p-4 flex justify-between items-center rounded-lg bg-gray-600 cursor-pointer shadow-md"
                >
                  <p className="text-lg font-semibold text-blue-600 ">
                    {battle.name}
                  </p>
                  <p
                    className="ml-5 bg-gray-400 rounded-lg px-2 hover:bg-gray-100 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/selectmeme/${battle.id}`);
                    }}
                  >
                    Join Battle
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center text-white p-6">
          <h1 className="text-2xl font-bold mb-4">Registrations Closed</h1>
          <p>
            {types.map((type, index) => (
              <li
                key={index}
                className="p-4 flex justify-between items-center rounded-lg mb-2 bg-gray-600 cursor-pointer shadow-md"
                onClick={() => navigate(`/battle/${1}/${type.toLowerCase()}`)}
              >
                <p className="text-lg font-semibold text-blue-600 hover:underline">
                  {type}
                </p>
              </li>
            ))}
          </p>
        </div>
      )}
      <div className="text-white absolute bottom-4 left-auto">
        {showBattles ? "Registration ends at 10am IST " : "Voting ends at 8am"}
      </div>
    </div>
  );
}

export default Currbattles;
