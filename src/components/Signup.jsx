import { Button, TextField, Checkbox, FormControlLabel, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Corrected import

const API_URL = 'https://meetz-api.onrender.com';

const Signup = ({ signupData, setSignupData, setToken, setSignupStep, setAuthError, setActiveTab, setLoading, showPassword, setShowPassword, capitalizeName }) => {
  const handleSignup = () => {
    if (!signupData.termsAgreed) {
      setAuthError('You must agree to the Terms & Conditions');
      return;
    }
    setLoading(true);
    const formattedData = { ...signupData, firstName: capitalizeName(signupData.firstName), lastName: capitalizeName(signupData.lastName) };
    fetch(`${API_URL}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formattedData) })
      .then(res => res.json())
      .then(data => {
        if (data.error) setAuthError(data.error);
        else {
          setToken(data.token);
          setSignupStep(1);
          setAuthError('');
        }
      })
      .catch(err => setAuthError('Signup failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between">
      <Box sx={{ flex: 1 }} />
      <Typography variant="h4" className="text-primary mb-2 p-1 text-center" sx={{ fontSize: 35, fontWeight: 550 }}>Create Account</Typography>
      <Typography variant="body2" className="text-secondary mb-8 text-center" sx={{ fontSize: 18, fontWeight: 500 }}>Fill your information below</Typography>
      <TextField
        label="Email"
        InputLabelProps={{ sx: { fontSize: '20px' } }}
        value={signupData.username}
        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
        fullWidth
        sx={{ mb: 3, mt: 4, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 25, backgroundColor: '#f4f5f9' } }}
      />
      <TextField
        label="Password"
        InputLabelProps={{ sx: { fontSize: '20px' } }}
        type={showPassword ? 'text' : 'password'}
        value={signupData.password}
        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
        fullWidth
        sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 25, backgroundColor: '#f4f5f9' } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />} {/* Corrected component names */}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="First Name"
        InputLabelProps={{ sx: { fontSize: '20px' } }}
        value={signupData.firstName}
        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
        fullWidth
        sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { fontSize: 25, borderRadius: 2, backgroundColor: '#f4f5f9' } }}
      />
      <TextField
        label="Last Name"
        InputLabelProps={{ sx: { fontSize: '20px' } }}
        value={signupData.lastName}
        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
        fullWidth
        sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { fontSize: 25, borderRadius: 2, backgroundColor: '#f4f5f9' } }}
      />
      <FormControlLabel
        control={<Checkbox checked={signupData.termsAgreed} onChange={(e) => setSignupData({ ...signupData, termsAgreed: e.target.checked })} />}
        label={<Typography sx={{ fontSize: '18px' }}> I agree to the <a href="/terms" target="_blank" className="text-accent text-lg">Terms & Conditions</a></Typography>}
        sx={{ mb: 2 }}
      />
      <Button
        onClick={handleSignup}
        sx={{ backgroundColor: '#6D53F4', fontSize: '20px', fontWeight: 500, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, mb: 3, borderRadius: 50, px: 4, py: 1.5 }}
        fullWidth
      >
        Sign Up
      </Button>
      <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4', fontSize: '16px', fontWeight: 500 }}>Already have an account? Login</Button>
      <Box sx={{ flex: 1 }} />
    </div>
  );
};

export default Signup;