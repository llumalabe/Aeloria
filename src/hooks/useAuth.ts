'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';

export default function useAuth() {
  const { address } = useWallet();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const registerNewUser = useCallback(async () => {
    if (!address) return;
    
    try {
      console.log('Registering new user:', address);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            username: `Player_${address.slice(2, 8)}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setIsRegistered(true);
        console.log('✅ User registered successfully!', data.user);
        
        // Show welcome message
        if (typeof window !== 'undefined') {
          alert(`🎮 Welcome to Aeloria!\n\nYour starter Warrior has been created!\nGo to Town → Characters to view your hero.`);
        }
      } else {
        console.error('Registration failed:', data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }, [address]);

  const checkAndRegisterUser = useCallback(async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      
      // Check if user exists
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}`
      );

      if (checkResponse.ok) {
        const data = await checkResponse.json();
        if (data.success) {
          setUserData(data.user);
          setIsRegistered(true);
          console.log('User already registered:', data.user);
        } else {
          // User not found, register new user
          await registerNewUser();
        }
      } else {
        // User not found, register new user
        await registerNewUser();
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Try to register anyway
      await registerNewUser();
    } finally {
      setIsLoading(false);
    }
  }, [address, registerNewUser]);

  useEffect(() => {
    if (address) {
      checkAndRegisterUser();
    } else {
      setIsRegistered(false);
      setIsLoading(false);
      setUserData(null);
    }
  }, [address, checkAndRegisterUser]);

  const refreshUserData = useCallback(async () => {
    if (!address) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [address]);

  return {
    isRegistered,
    isLoading,
    userData,
    refreshUserData,
  };
}
