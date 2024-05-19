import React, { useState } from 'react';
import { TextField, Button, Alert, FormControlLabel, Switch, DialogContent, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { StoreInstance } from '@/Store/Store';



const SignInForm: React.FC<{close: ()=>void}> = ({close}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string|undefined>()
  const [signUp, setSignUp] = useState(false)
  const [tgPassRequired, setTgPassRequired] = useState(false)
  const [tgValue, setTgValue] = useState<number>()

  const handleSignIn = async () => {
    setError(undefined)
    try{
      const res = await StoreInstance.login({ username, password })
      if(res){
        setTgPassRequired(true)
        return
      }
      close()
    }catch(e: unknown){
      if(e instanceof AxiosError){
        setError(e.response?.data.message)
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
        setError(e.response?.data.message)
      }
    }
  };
  if(tgPassRequired){
    return <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant='h5'>Введите одноразовый пароль от telegram-бота</Typography>
        <TextField type="number" value={tgValue} onChange={e=>{
          setError(undefined)
          setTgValue(Number(e.target.value))
        }}/>
        <Button onClick={async ()=>{
          try{
            tgValue && await StoreInstance.tgLogin(tgValue, username, password)
          }catch(e){
            if(e instanceof AxiosError)setError(e.response?.data.message)
          }
          close()
        }}>Подтвердить</Button>
        <Button onClick={()=>{
          setTgPassRequired(false)
        }}>Отмена</Button>
      </DialogContent>
  }
  return (
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControlLabel control={<Switch checked={signUp} onChange={()=>setSignUp(!signUp)}/>} label={signUp ? "Зарегистрироваться" : "Войти"} />
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
      {signUp && <TextField
        fullWidth
        label="Электронная почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />}
      {
        signUp 
        ? 
        <Button variant="contained" onClick={handleSignUp}>Зарегистрироваться</Button>
        :
        <Button variant="contained" onClick={handleSignIn}>Войти</Button>
      }
    </DialogContent>
  );
};

export default SignInForm;
