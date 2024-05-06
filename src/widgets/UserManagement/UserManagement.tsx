import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { deleteUser, updateUser } from '@/api/requests/User';
import { StoreInstance } from '@/models/Store';


const UserManagement: React.FC = () => {
  const user = StoreInstance.user!
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(user.email || '');

  const handleDelete = () => {
    // Call API to delete user
    deleteUser();
  };


  const handleUpdate = () => {
    // Call API to update user
    updateUser({ username, password, email });
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleDelete}>Delete User</Button>
      <Button variant="contained" onClick={handleUpdate}>Update User</Button>
    </div>
  );
};

export default UserManagement;
