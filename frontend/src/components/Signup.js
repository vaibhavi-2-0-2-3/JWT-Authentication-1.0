import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/signup', {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password
    });
    if (res && res.data) {
      return res.data; // Ensure res.data exists before returning
    }
  } catch (err) {
    console.log("Error in signup request:", err);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading
    // Send http request
    sendRequest().then(()=>history("/login"));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box marginLeft="auto" marginRight="auto" width={300} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant='h2'>Signup</Typography>
          <TextField
            name="name"
            onChange={handleChange}
            value={inputs.name}
            variant="outlined"
            placeholder="Name"
            margin='normal'
          />
          <TextField
            name="email"
            onChange={handleChange}
            type="email"
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin='normal'
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin='normal'
            type="password"
          />
          <Button type="submit" variant="contained">Signup</Button>
        </Box>
      </form>
    </div>
  );
}

export default Signup;
