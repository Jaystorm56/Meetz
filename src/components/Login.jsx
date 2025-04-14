import { Button, TextField, Typography } from '@mui/material';

const API_URL = 'https://meetz-api.onrender.com';

const Login = ({ loginData, setLoginData, setToken, setActiveTab, setAuthError, setLoading }) => {
  const handleLogin = () => {
    setLoading(true);
    fetch(`${API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginData) })
      .then(res => res.json())
      .then(data => {
        if (data.error) setAuthError(data.error);
        else {
          setToken(data.token);
          setActiveTab('Home');
          setAuthError('');
        }
      })
      .catch(err => setAuthError('Login failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-evenly h-[600px]">
      <Typography variant="h4" className="text-primary text-bold mb-8 text-center" sx={{ fontSize: 35, fontWeight: 550 }}>Sign In</Typography>
      <Typography variant="body2" className="text-secondary mb-8 text-center" sx={{ fontSize: 22, fontWeight: 500 }}>Hi, Welcome back!</Typography>
      <TextField
        label="Email"
        InputLabelProps={{ sx: { fontSize: '18px' } }}
        value={loginData.username}
        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
        fullWidth
        sx={{ mt: 4, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2,fontSize: 20, backgroundColor: '#f4f5f9' } }}
      />
      <TextField
        label="Password"
        InputLabelProps={{ sx: { fontSize: '18px' } }}
        type="password"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        fullWidth
        sx={{ mb: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2,fontSize: 20, backgroundColor: '#f4f5f9' } }}
      />
      <Button onClick={handleLogin} sx={{ backgroundColor: '#6D53F4', fontSize: '0.7rem', fontWeight: 300, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, mb: 3, borderRadius: 50, px: 4, py: 1.5 }} fullWidth>Sign In</Button>
      <Button onClick={() => setActiveTab('Signup')} sx={{ color: '#6D53F4', fontSize: 13, fontWeight: 500 }}>Need an account? Sign up</Button>
      <Button onClick={() => setActiveTab('Forgot')} sx={{ color: '#6D53F4', fontSize: 13, fontWeight: 500 }}>Forgot Password?</Button>
    </div>
  );
};

export default Login;