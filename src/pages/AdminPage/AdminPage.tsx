import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

interface UserFormProps {
  userId?: string; // If editing, pass the user ID
  onSuccess?: () => void; // Callback after successful operation
}


export const AdminPage = () => {
  const [userId, setUserId] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>();
  const [refresh, setRefresh] = useState(false);

  // Handle the form submission
  const handleFetchUser = () => {
    // If an ID is entered, set it for editing, otherwise clear the form for creating a new user
    setEditingUserId(userId.trim() ? userId.trim() : null);
  };

  const handleSuccess = () => {
    setRefresh(!refresh);
    setUserId(''); // Clear the input field after a successful operation
    setEditingUserId(null); // Reset the form state
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" mb={4}>
        Admin Dashboard
      </Typography>

      {/* Input field to enter the User ID */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Enter User ID (leave blank to create new)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFetchUser}>
          {userId ? 'Edit User' : 'Create User'}
        </Button>
      </Box>

      {/* User Form */}
      <AdminForm userId={editingUserId || undefined} onSuccess={handleSuccess} />
    </Box>
  );
};

export const AdminForm: React.FC<UserFormProps> = ({ userId, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOperator, setIsOperator] = useState(false);
  const [hashedPassword, setHashedPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch user data if editing
  useEffect(() => {
    if (userId) {
      axios
        .get(`/admin/user/${userId}`)
        .then((response) => {
          const user = response.data;
          setUsername(user.username);
          setEmail(user.email || '');
          setBlocked(user.blocked);
          setIsAdmin(user.isAdmin);
          setIsOperator(user.isOperator);
        })
        .catch((err) => setError(err.response?.data?.message || 'Error fetching user data'));
    }
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const userData = {
      username,
      email: email || undefined,
      blocked,
      isAdmin,
      isOperator,
      hashedPassword,
    };

    try {
      if (userId) {
        await axios.patch(`/admin/user/${userId}`, userData);
      } else {
        await axios.post('/admin/user', userData);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving user data');
    }
  };

  // Handle delete user
  const handleDelete = async () => {
    if (!userId) return;
    try {
      await axios.delete(`/admin/user/${userId}`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>{userId ? 'Edit User' : 'Create User'}</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        inputProps={{ maxLength: 25 }}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        value={hashedPassword}
        onChange={(e) => setHashedPassword(e.target.value)}
        type="password"
        required={!userId} // Password is required for new users only
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={<Checkbox checked={blocked} onChange={(e) => setBlocked(e.target.checked)} />}
        label="Blocked"
      />

      <FormControlLabel
        control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
        label="Admin"
      />

      <FormControlLabel
        control={<Checkbox checked={isOperator} onChange={(e) => setIsOperator(e.target.checked)} />}
        label="Operator"
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" type="submit">
          {userId ? 'Update' : 'Create'}
        </Button>

        {userId && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};


