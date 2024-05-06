import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createUser, getUser, login } from '@/api/requests/User';
import { StoreInstance } from '@/models/Store';
import { User } from '@/models/User';



const SignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const handleSignIn = async () => {
    await login({ username, password })
    const user: User = await getUser()
    StoreInstance.user = user
  };
  const handleSignUp = () => {
    if(email!==''){
      createUser({ username, password, email }).then(()=>handleSignIn());
    }else{
      createUser({ username, password }).then(()=>handleSignIn());
    }
  };

  return (
    <div>
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
