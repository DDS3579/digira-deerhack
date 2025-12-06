import { useState, useEffect } from 'react';

/**
 * Custom hook to get user's geolocation with permission request
 * @param {Object} options - Options for geolocation
 * @param {boolean} options.enabled - Whether to automatically request location on mount
 * @param {Object} options.geolocationOptions - Options passed to navigator.geolocation.getCurrentPosition
 * @returns {Object} - { latitude, longitude, error, loading, getLocation }
 */
export function useGeolocation({ enabled = false, geolocationOptions = {} } = {}) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...geolocationOptions
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );
  };

  useEffect(() => {
    if (enabled) {
      getLocation();
    }
  }, [enabled]);

  return { latitude, longitude, error, loading, getLocation };
}

