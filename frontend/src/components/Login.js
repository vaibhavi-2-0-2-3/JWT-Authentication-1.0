import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null); // Error state

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null); // Clear error when user starts typing
  };

  const sendRequest = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      email: inputs.email,
      password: inputs.password,
    });
    
    // Check if the response status is OK
    if (res.status === 200) {
      return res.data; // Return data if the request is successful
    } else {
      // If the status is not 200, handle it as an error
      setError(res.data.message || "An error occurred"); // Assuming the server sends an error message
      throw new Error(res.data.message || "An error occurred");
    }
  } catch (err) {
    console.error("Error details:", err); // Log error details to the console
    setError(err.response ? err.response.data.message : "An error occurred");
    throw err; // Rethrow the error to handle it in handleSubmit
  }
};


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading
    sendRequest()
      .then((data) => {
        if (data) {
          // If login is successful, redirect
          // localStorage.setItem('token', data.token); // Example if JWT is received
          history("/user"); // Redirect to user dashboard
        }
      })
      .catch((err) => {
        // Error handling is already done in sendRequest
        console.error("Login failed:", err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box marginLeft="auto" marginRight="auto" width={300} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant='h2'>Login</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            name="email"
            onChange={handleChange}
            type="email"
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin='normal'
            required
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin='normal'
            type="password"
            required
          />
          <Button type="submit" variant="contained">Login</Button>
        </Box>
      </form>
    </div>
  );
}

export default Login;
