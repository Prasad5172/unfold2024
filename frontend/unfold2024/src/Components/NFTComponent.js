import React ,{useState,useEffect}from "react";
import { toastFailed } from "./Utils/ToastFunctions";
const ethers = require("ethers");

function NFTComponent({tokenAddress,tokenId,category}) {
  
  const [imageSrc, setImageSrc] = useState("");
  const abi = [
    "function tokenURI(uint256 tokenId) public view returns (string memory)"
  ];
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, abi, provider);

        // Fetch tokenURI from the smart contract
        const tokenURI = await contract.tokenURI(tokenId);
        console.log("Token URI:", tokenURI);

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

        // Set the image URL
        setImageSrc(imageURI);
      } catch (error) {
        console.error("Failed to fetch token image:", error);
        toastFailed("Failed to load token image.");
      }
    };

    // Call the async function
    fetchTokenData();
  }, [tokenAddress, tokenId, abi]); // Dependencies for useEffect

  return (
    <>
      <div class="relative flex flex-col my-6 bg-gray-400 shadow-sm border border-slate-200 rounded-lg w-80 ">
        <div class="relative  m-2.5 overflow-hidden text-white rounded-md">
          <img
            src={imageSrc}
            alt="card-image"
          />
        </div>   
        <p className="text-white font-bold text-center">regular memes</p>   
      </div>
    </>
  );
}

export default NFTComponent;
