import React, { useState } from 'react';
import { TextField, Button, DialogContent } from '@mui/material';
import { StoreInstance } from '@/Store/Store';
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
      await StoreInstance.deleteUser();
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
      await StoreInstance.updateUser({ username, password, email });
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
    StoreInstance.logOut()
    close()
  };

  return (
    <DialogContent>
      {error && <Error>
        {error}
      </Error>}
      <TextField
        fullWidth
        label="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        fullWidth
        label="Электронная почта"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleDelete}>УДАЛИТЬ пользователя</Button>
      <Button variant="contained" onClick={handleUpdate}>ИЗМЕНИТЬ пользователя</Button>
      <Button variant="contained" onClick={handleExit}>Выйти</Button>

    </DialogContent>
  );
};

export default UserManagement;
