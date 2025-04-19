import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Home from '@/components/Home';

interface HomeProps {
  userName: string;
  onLogout: () => void;
}
export default function HomeRoute() {
  const {userName}  = useLocalSearchParams();
  const onLogout = () => {
    router.replace('/');
  };

  return (
    <Home 
      userName={userName as string}
      onLogout={onLogout}
    />
  )

}