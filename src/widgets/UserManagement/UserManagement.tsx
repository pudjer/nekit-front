import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { deleteUser, logOut, updateUser } from '@/models/User/Api';
import { StoreInstance } from '@/models/Store';
import { AxiosError } from 'axios';
import { Error } from '@mui/icons-material';


const UserManagement: React.FC<{close: ()=>void}> = ({close}) => {
  const user = StoreInstance.user!
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(user.email || '');
  const [error, setError] = useState<string|undefined>()

  const handleDelete = async() => {
    // Call API to delete user
    try{
      await deleteUser();
      close()
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.message)
      }
    }
  };


  const handleUpdate = async () => {
    // Call API to update user
    try{
      await updateUser({ username, password, email });
      close()
    }catch(e: unknown){
      if(e instanceof AxiosError){
        console.log(e)
        setError(e.message)
      }
    }
  };


  const handleExit = () => {
    // Call API to update user
    logOut()
    close()
  };

  return (
    <div>
      {error && <Error>
        {error}
      </Error>}
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleDelete}>Delete User</Button>
      <Button variant="contained" onClick={handleUpdate}>Update User</Button>
      <Button variant="contained" onClick={handleExit}>Exit</Button>

    </div>
  );
};

export default UserManagement;
