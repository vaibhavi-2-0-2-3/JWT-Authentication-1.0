import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // Allow sending credentials with requests

const Welcome = () => {
  const [user, setUser] = useState(); // Corrected this line

  const sendRequest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user', {
        withCredentials: true, // Include credentials in the request
      });
      return res.data; // Return the response data directly
    } catch (err) {
      console.log(err);
      return null; // Return null or handle error as needed
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      if (data) {
        setUser(data.user); // Check if data is not null before setting state
      }
    });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      {user ? <h1>{user.name}</h1> : <h1>Loading...</h1>} {/* Show loading while fetching */}
    </div>
  );
};

export default Welcome;
