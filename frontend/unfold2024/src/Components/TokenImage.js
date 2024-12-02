import React, { useState, useEffect, useContext } from "react";
import "./Vote.css";
import { toastFailed, toastSuccess } from "./Utils/ToastFunctions";
import { AuthContext } from "./context/AuthContext";
const ethers = require("ethers");

function TokenImage(
  {
    tokenAddress, tokenId,battleId,battleName
  }
) {
  const {userAddress} = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ABI for ERC-721 contract
  const abi = [
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
  ];

  // Function to fetch token metadata and image
  const fetchTokenImage = async () => {
    try {
      setLoading(true);

      // Connect to Ethereum provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, abi, provider);

      // Fetch tokenURI from the smart contract
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(tokenURI);
      // If IPFS link, replace it with public gateway
      const metadataURI = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        : tokenURI;

      // Fetch metadata JSON
      const response = await fetch(metadataURI);
      const metadata = await response.json();

      // Resolve image IPFS URI to HTTP
      const imageURI = metadata.image.startsWith("ipfs://")
        ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        : metadata.image;

      // Set the image URL and attributes
      setImageSrc(imageURI);
      setAttributes(metadata.attributes); // Store the token's attributes
    } catch (error) {
      console.error("Failed to fetch token image:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenAddress && tokenId) {
      fetchTokenImage();
    }
  }, [tokenAddress, tokenId]);

  const handleVote =async () => {
    toastSuccess("clicked")
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/battles/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            battle_id: battleId,
            voter_address: userAddress,
            meme_address: tokenAddress,
          }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toastSuccess("Voted successfully!");
      } else {
        toastFailed(data.error || "Failed to fetch wallet data");
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
  };
  return (
    <div className="flex flex-col w-64 items-center justify-center  ">
      {loading ? (
        <p>Loading...</p>
      ) : imageSrc ? (
        <div className="text-center rounded-sm">
          <img
            src={imageSrc}
            alt={`Token ${tokenId}`}
            className="w-64 h-64 rounded-lg shadow-lg"
          />
      <p className="text-white pt-2">{battleName}</p>

          <div className="vote_nft_btn hover:cursor-pointer ">
            <div className="button ">
              <p onClick={handleVote} className="px-20 py-3">Like</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Image not found</p>
      )}
    </div>
  );
}

export default TokenImage;
