import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { createUser,  login } from '@/models/User/Api';
import { AxiosError } from 'axios';



const SignInForm: React.FC<{close: ()=>void}> = ({close}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string|undefined>()

  const handleSignIn = async () => {
    setError(undefined)
    try{
      await login({ username, password })
      close()
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.message)
      }
    }

  };
  const handleSignUp = async () => {
    setError(undefined)
    try{
      if(email!==''){
        await createUser({ username, password, email })
        await handleSignIn();
      }else{
        createUser({ username, password });
        await handleSignIn();
      }
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.message)
      }
    }
  };

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleSignIn}>Sign In</Button>
      <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>

    </div>
  );
};

export default SignInForm;
