import React, { useState } from 'react';
import { TextField, Button, Alert, Checkbox, FormControlLabel, Switch, DialogContent } from '@mui/material';
import { AxiosError } from 'axios';
import { StoreInstance } from '@/Store/Store';



const SignInForm: React.FC<{close: ()=>void}> = ({close}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string|undefined>()
  const [signUp, setSignUp] = useState(false)
  const handleSignIn = async () => {
    setError(undefined)
    try{
      await StoreInstance.login({ username, password })
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
        await StoreInstance.createUser({ username, password, email })
        await handleSignIn();
      }else{
        await StoreInstance.createUser({ username, password });
      }
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.message)
      }
    }
  };

  return (
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControlLabel control={<Switch checked={signUp} onChange={()=>setSignUp(!signUp)}/>} label={signUp ? "SIGN UP" : "SIGN IN"} />
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {signUp && <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />}
      {
        signUp 
        ? 
        <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
        :
        <Button variant="contained" onClick={handleSignIn}>Sign In</Button>
      }
    </DialogContent>
  );
};

export default SignInForm;
