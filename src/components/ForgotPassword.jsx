import { Button, TextField, Typography } from '@mui/material';

const API_URL = 'https://meetz-api.onrender.com';

const ForgotPassword = ({ forgotData, setForgotData, resetData, setResetData, resetToken, setActiveTab, setAuthError, setLoading }) => {
  const handleForgotPassword = () => {
    setLoading(true);
    fetch(`${API_URL}/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(forgotData) })
      .then(res => res.json())
      .then(data => {
        if (data.error) setAuthError(data.error);
        else setAuthError('Check your email for a reset link');
      })
      .catch(err => setAuthError('Request failed'))
      .finally(() => setLoading(false));
  };

  const handleResetPassword = () => {
    setLoading(true);
    fetch(`${API_URL}/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resetData) })
      .then(res => res.json())
      .then(data => {
        if (data.error) setAuthError(data.error);
        else {
          setAuthError('Password reset successful. Please login.');
          setActiveTab('Login');
        }
      })
      .catch(err => setAuthError('Reset failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!resetToken ? (
        <>
          <Typography variant="h4" className="text-primary mb-4 text-center">Forgot Password</Typography>
          <TextField label="Email" value={forgotData.username} onChange={(e) => setForgotData({ ...forgotData, username: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <Button onClick={handleForgotPassword} sx={{ backgroundColor: '#6D53F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, mb: 2 }} fullWidth>Send Reset Link</Button>
          <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4' }}>Back to Login</Button>
        </>
      ) : (
        <>
          <Typography variant="h4" className="text-primary mb-4 text-center">Reset Password</Typography>
          <TextField label="New Password" type="password" value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value, token: resetToken })} fullWidth sx={{ mb: 2 }} />
          <Button onClick={handleResetPassword} sx={{ backgroundColor: '#6D53F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, mb: 2 }} fullWidth>Reset Password</Button>
          <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4' }}>Back to Login</Button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;