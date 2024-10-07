import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

function Signup() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    e.preventDefault();
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    // Handle signup logic here
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box marginLeft="auto" marginRight="auto" width={300} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography value={inputs.name} variant='h2'>Signup</Typography>
          <TextField name='name'
          onChange={handleChange}
          value={inputs.name}
          variant="outlined" 
          placeholder="Name" 
          margin='normal' />
          <TextField name='email'
          onChange={handleChange}
          type={"email"}
          value={inputs.email} 
          variant="outlined" 
          placeholder="Email" 
          margin='normal' />
          <TextField name='password'
          onChange={handleChange}
          value={inputs.password}
          variant="outlined" 
          placeholder="Password" 
          margin='normal' 
          type="password" />
          <Button type="submit" variant="contained">Signup</Button>
        </Box>
      </form>
    </div>
  );
}

export default Signup;
