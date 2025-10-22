import { useState, useEffect } from 'react';
import { portfolioApi } from '@/lib/portfolio_apis';

// Lightweight hook for components that only need profile data
export const useProfileData = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await portfolioApi.getProfileInfo();
        setProfileData(data);
      } catch (err) {
        console.warn('getProfileInfo failed', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profileData, loading, error };
};