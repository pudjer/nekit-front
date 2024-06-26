import React, { useState } from 'react';
import { TextField, Button, DialogContent, Link, Typography } from '@mui/material';
import { StoreInstance, UserCreateDTO } from '@/Store/Store';
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
        setError(e.response?.data)
      }
    }
  };


  const handleUpdate = async () => {
    // Call API to update user
    const update: Partial<UserCreateDTO> = {}
    if(username)update.username = username
    if(password)update.password = password
    if(email)update.email = email
    try{
      await StoreInstance.updateUser(update);
      close()
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.response?.data)
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
      <Link href={'https://t.me/CoinTrackX_Bot?start='+StoreInstance.user!._id}><Typography>Добавить Telegram аккаунт</Typography></Link>
    </DialogContent>
  );
};

export default UserManagement;
