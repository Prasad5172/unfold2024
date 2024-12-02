import React, { useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toastFailed } from "../Utils/ToastFunctions";

function PrevBattles() {
  const navigate = useNavigate();
  const [prevBattles,setPrevBattles] = useState([]);
  const {setIsLoading,userId} = useContext(AuthContext);
  // Example list of battles
  const battles = [
    { id: 1, name: "Battle of Heroes" },
    { id: 2, name: "Dragon's Wrath" },
    { id: 3, name: "The Last Stand" },
  ];
  
  useEffect(() => {
    const fetchPrevBattles = async () => {

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
              toastFailed(data.error);
          }else{
            setPrevBattles(data);
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            // Handle request timeout
            console.log('Request timed out');
            toastFailed('Request timed out. Please try again later.');
          } else {
            console.log(error);
            toastFailed(error.message);
          }
        }
    };
  
    fetchPrevBattles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Previous Battles</h1>
      <ul className="space-y-4">
        {prevBattles.map((battle) => (
          <li
            key={battle.id}
            className="p-4 bg-gray-400 rounded-lg hover:bg-gray-100 cursor-pointer shadow-md"
            onClick={() => navigate(`/battles/${battle.id}`)}
          >
            <p className="text-lg font-semibold text-blue-600 hover:underline">
              {battle.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrevBattles;
