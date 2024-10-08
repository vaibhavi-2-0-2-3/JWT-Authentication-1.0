import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // Allow sending credentials with requests
let firstRender = true;

const Welcome = () => {
  const [user, setUser] = useState(null); // Initialize user as null for clarity
  const [loading, setLoading] = useState(true); // To handle loading state

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/refresh", {
        withCredentials: true,
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.log("Error refreshing token:", err);
      return null;
    }
  };
  

  const sendRequest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user', {
        withCredentials: true, // Include credentials in the request
      });
      return res.data; // Return the response data directly
    } catch (err) {
      console.log("Error fetching user:", err);
      return null; // Return null or handle error as needed
    }
  };

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      sendRequest().then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
        setLoading(false); // Stop loading after data fetch
      });
    }

    const interval = setInterval(() => {
      refreshToken().then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      });
    }, 1000 * 29); // Refresh token every 29 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <h1>{user ? `Welcome, ${user.name}` : 'User not found'}</h1>
      )}
    </div>
  );
};

export default Welcome;
