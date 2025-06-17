export const getUserAddress = async () => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          const data = await response.json();
          resolve(data.display_name); // Full address string
        } catch (err) {
          reject(err.message || 'Error fetching address');
        }
      },
      (error) => {
        reject(error.message || 'Error getting location');
      }
    );
  });
};
