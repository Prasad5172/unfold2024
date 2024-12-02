import React, { useState, useEffect } from "react";
import TokenImage from "../TokenImage";
import { toastFailed } from "../Utils/ToastFunctions";
import { useParams } from "react-router-dom";

function BattleMemes() {
  const [memes, setMemes] = useState([]);
  const params = useParams();
  useEffect(() => {
    const fetchmemes = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/memes/category/${params.category}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (res.status === 500) {
        } else {
          setMemes(data);
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

    fetchmemes();
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {memes.map((meme, index) => (
          <TokenImage
            tokenAddress={meme.token_address}
            tokenId={meme.token_id}
            battleName={meme.category}
            battleId={params.battleId}
          />
        ))}
      </div>
    </>
  );
}

export default BattleMemes;
