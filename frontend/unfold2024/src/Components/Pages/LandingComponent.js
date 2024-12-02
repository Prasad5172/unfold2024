import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import ConnectToWallet from '../ConnectToWallet';
import { AuthContext } from '../context/AuthContext';
import UserForm from '../UserForm';

function LandingComponent() {
    const { userAddress } = useContext(AuthContext);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', backgroundColor: '#1a1a1a', color: '#fff' }}>
      {/* Animated Heading */}
      <motion.h1
        style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        Meme Battles
      </motion.h1>

      {/* Animated Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
      >
      {userAddress === "0x0000000000000000000000000000000000000000" ? (
        <ConnectToWallet />
      ) : (
        <UserForm />
      )}
      </motion.div>
    </div>
  );
}

export default LandingComponent;
