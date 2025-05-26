import { useState, useEffect } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';

const API_URL = 'https://meetz-api.onrender.com';

const Signup = ({ signupData, setSignupData, setToken, setSignupStep, setAuthError, setActiveTab, setLoading, showPassword, setShowPassword, capitalizeName }) => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [focusedPassword, setFocusedPassword] = useState(false);  // Track focus on password input
  const [emailError, setEmailError] = useState('');

  const passwordRules = {
    minLength: signupData.password.length >= 6,
    upperCase: /[A-Z]/.test(signupData.password),
    number: /[0-9]/.test(signupData.password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(signupData.password),
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignup = () => {
    if (signupData.password !== signupData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (!signupData.termsAgreed) {
      setAuthError('You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    const formattedData = {
      ...signupData,
      firstName: capitalizeName(signupData.firstName),
      lastName: capitalizeName(signupData.lastName),
    };

    fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
      credentials: 'include'
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          setAuthError('Invalid server response');
          setLoading(false);
          return;
        }
        console.log('Signup response:', res.status, data);
        if (!res.ok) {
          setAuthError(data.error || 'Signup failed');
        } else {
          setSignupStep(1);
          setAuthError('');
        }
      })
      .catch((err) => {
        setAuthError('Signup failed');
        console.error('Signup error:', err);
      })
      .finally(() => setLoading(false));
  };

  const handleConfirmPasswordChange = (value) => {
    setSignupData(prev => {
      if (prev.confirmPassword === value) return prev;
      return { ...prev, confirmPassword: value };
    });
    if (value !== signupData.password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setSignupData({ ...signupData, username: email });
    if (!isValidEmail(email)) {
      setEmailError('Please input a valid email');
    } else {
      setEmailError('');
    }
  };

  // Check if the form is complete and password meets rules
  const isFormValid = () => {
    return (
      signupData.username &&
      signupData.firstName &&
      signupData.lastName &&
      signupData.password &&
      signupData.confirmPassword &&
      passwordRules.minLength &&
      passwordRules.upperCase &&
      passwordRules.number &&
      passwordRules.specialChar &&
      signupData.password === signupData.confirmPassword &&
      signupData.termsAgreed
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '448px', mx: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontSize: 35, fontWeight: 550, color: '#6D53F4', mb: 1, textAlign: 'center' }}>
        Create Account
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 500, mb: 2, textAlign: 'center' }}>
        Fill your information below
      </Typography>

      <TextField
        label="Email"
        InputLabelProps={{ sx: { fontSize: '16px' } }}
        value={signupData.username}
        onChange={handleEmailChange}
        fullWidth
        sx={{
          mb: 2, mt: 4, borderRadius: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, backgroundColor: '#f4f5f9' },
        }}
        error={!!emailError}
        helperText={emailError && <Typography sx={{ color: '#D32F2F', fontSize: '14px' }}>{emailError}</Typography>}
      />

      <TextField
        label="Password"
        InputLabelProps={{ sx: { fontSize: '16px' } }}
        type={showPassword ? 'text' : 'password'}
        value={signupData.password}
        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
        fullWidth
        sx={{
          mb: 2, borderRadius: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, backgroundColor: '#f4f5f9' },
        }}
        onFocus={() => setFocusedPassword(true)}  // Show password rules when focused
        onBlur={() => setFocusedPassword(false)}  // Hide password rules when focus is lost
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Show Password Checklist only when the password input is focused */}
      {focusedPassword && (
        <Box sx={{ mb: 2, pl: 1 }}>
          <Typography sx={{ fontSize: 14, mb: 1, fontWeight: 500 }}>Password must include:</Typography>
          {[
            { label: 'At least 6 characters', valid: passwordRules.minLength },
            { label: 'One uppercase letter', valid: passwordRules.upperCase },
            { label: 'One number', valid: passwordRules.number },
            { label: 'One special character', valid: passwordRules.specialChar },
          ].map((rule, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', color: rule.valid ? 'green' : 'gray', mb: 0.5 }}>
              <CheckCircle sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: 14 }}>{rule.label}</Typography>
            </Box>
          ))}
        </Box>
      )}

      <TextField
        label="Confirm Password"
        InputLabelProps={{ sx: { fontSize: '16px' } }}
        type={showConfirmPassword ? 'text' : 'password'}
        value={signupData.confirmPassword || ''}
        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
        fullWidth
        sx={{
          mb: 2, borderRadius: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, backgroundColor: '#f4f5f9' },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {passwordError && (
        <Typography sx={{ color: '#D32F2F', fontSize: '14px', mb: 2 }}>{passwordError}</Typography>
      )}

      <TextField
        label="First Name"
        InputLabelProps={{ sx: { fontSize: '16px' } }}
        value={signupData.firstName}
        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
        fullWidth
        sx={{ mb: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { fontSize: 16, borderRadius: 2, backgroundColor: '#f4f5f9' } }}
      />

      <TextField
        label="Last Name"
        InputLabelProps={{ sx: { fontSize: '16px' } }}
        value={signupData.lastName}
        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
        fullWidth
        sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { fontSize: 16, borderRadius: 2, backgroundColor: '#f4f5f9' } }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={signupData.termsAgreed}
            onChange={(e) => setSignupData({ ...signupData, termsAgreed: e.target.checked })}
          />
        }
        label={
          <Typography sx={{ fontSize: '16px' }}>
            I agree to the <a href="/terms" target="_blank" className="text-accent text-[16px]">Terms & Conditions</a>
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      <Button
        onClick={handleSignup}
        disabled={!isFormValid()} // Disable button when the form is not valid
        sx={{
          backgroundColor: isFormValid() ? '#6D53F4' : '#B0B0B0',
          fontSize: '0.9rem',
          fontWeight: 400,
          color: '#FFFFFF',
          '&:hover': { backgroundColor: isFormValid() ? '#5C45D3' : '#B0B0B0' },
          mb: 1,
          borderRadius: 50,
          px: 4,
          py: 1.5,
        }}
        fullWidth
      >
        Sign Up
      </Button>

      <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4', fontSize: 13, fontWeight: 500 }}>
        Already have an account? Login
      </Button>
    </Box>
  );
};

export default Signup;
