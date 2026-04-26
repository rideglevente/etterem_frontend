import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import AwardsSection from '../components/AwardsSection';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
        if (user.name === 'admin') {
            navigate('/desks');
        } else {
            navigate('/orders');
        }
    }
  }, [user, loading, navigate]);

  return (
    <>
      <Hero />
      <StorySection />
      <AwardsSection />
    </>
  );
}
