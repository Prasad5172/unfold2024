import React, { useContext, useState, useEffect } from "react";
import NFTComponent from "../NFTComponent";
import { AuthContext } from "../context/AuthContext";
import { toastFailed } from "../Utils/ToastFunctions";
import { useNavigate } from "react-router-dom";

function SelectNftsToBattle() {
  const navigate = useNavigate();
  const [nftComponents, setNftComponents] = useState([]);
  const { isLoading, setIsLoading, userId, userAddress } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/memes/user/${userId}`,
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
        } else {
          setNftComponents(data);
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
      setIsLoading(false);
    };

    fetchNfts();
  }, []);

  // Function to handle NFT click
  const handleClick = async (tokenAddress, tokenId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/battle/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            meme_id: tokenId,
            wallet_address: userAddress,
            token_address: tokenAddress,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request timed out");
        toastFailed("Request timed out. Please try again later.");
      } else {
        console.log(error);
        toastFailed(error.message);
      }
    }
    navigate(`/`);
  };

  const nfts = [
    {
      tokenAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      tokenId: 266,
    },
    {
      tokenAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      tokenId: 266,
    },
    {
      tokenAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      tokenId: 266,
    },
    {
      tokenAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      tokenId: 266,
    },
  ];

  return (
    <>
      <p className="text-white text-center text-lg mt-4">
        Select memes to balance
      </p>
      <div className="flex flex-wrap gap-2">
        {nftComponents.map((nft, index) => (
          <div
            key={index}
            className="hover:cursor-pointer"
            onClick={() => handleClick(nft.tokenAddress, nft.tokenId)}
          >
            <NFTComponent
              tokenAddress={nft.tokenAddress}
              tokenId={nft.tokenId}
              className="hover:cursor-pointer" // Ensure the cursor is set here too
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default SelectNftsToBattle;
