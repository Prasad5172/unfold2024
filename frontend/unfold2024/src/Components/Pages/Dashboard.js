import React, { useState,useEffect, useContext } from 'react'
import NFTComponent from '../NFTComponent'
import { toastFailed,toastSuccess } from '../Utils/ToastFunctions';
import { AuthContext } from '../context/AuthContext';
import AddNft from '../Buttons/AddNft';


function Dashboard({ 
}) {
  const [nftComponents,setNftComponents] = useState([]);
  const {userId} = useContext(AuthContext);
  useEffect(() => {
    const fetchNfts = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/memes/user/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            }
          );
          const data = await res.json();
          console.log(data);
          if (res.status === 500) {
            toastFailed(data.error);
          }else{
            setNftComponents(data);
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
    fetchNfts();
  }, []);

  

  return (
    <div className='flex flex-wrap gap-2 '>
      {
        nftComponents.map((nft, index) => (
          <NFTComponent 
            key={index}  // Adding a unique key prop for each child
            tokenAddress={nft.tokenAddress}
            tokenId={nft.tokenId}
          />
        ))
      }
      <div className="absolute bottom-4 right-4">
        <AddNft setNftComponents={setNftComponents} nftComponents={nftComponents}/>
      </div>
    </div>
  );
  
}

export default Dashboard