import { useState } from 'react';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const useLoginValidation = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // Validate loginData and update errors state
  const validateLogin = () => {
    const errors = {};
    if (!loginData.username.trim()) {
      errors.username = 'Username is required';
    } else if (loginData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLoginErrors(errors);
    return errors;  // return fresh errors for immediate use
  };

  const login = async () => {
    console.log('login() called with:', loginData);
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      console.log('Validation failed:', errors);
      return { success: false, errors };
    }

    try {
      const response = await fetch('http://127.0.0.1:2500/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response body:', errorData);
        return { success: false, errors: { general: errorData.detail || 'Login failed' } };
      }

      const data = await response.json();
      console.log('Success response data:', data);

      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);

        // Decode username from JWT token and store it
        const payload = parseJwt(data.access_token);
        if (payload && payload.sub) {
          localStorage.setItem('username', payload.sub);
          console.log('Username stored in localStorage:', payload.sub);
        } else {
          console.warn('Username (sub) not found in token payload');
        }
      } else {
        return { success: false, errors: { general: 'Invalid token received' } };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, errors: { general: 'Network error, please try again later.' } };
    }
  };

  return {
    loginData,
    setLoginData,
    loginErrors,
    setLoginErrors,    // <-- Make sure to return this!
    validateLogin,
    login,
  };
};

export const useSignupValidation = () => {
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    name: '',
    useremail: '',
  });
  const [signupErrors, setSignupErrors] = useState({});

  const validateSignup = () => {
    const errors = {};

    if (!signupData.name.trim()) {
      errors.name = 'Name is required';
    } else if (signupData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!signupData.username.trim()) {
      errors.username = 'Username is required';
    } else if (signupData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!signupData.useremail.trim()) {
      errors.useremail = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(signupData.useremail)
    ) {
      errors.useremail = 'Invalid email address';
    }

    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setSignupErrors(errors);
    return errors;  // Return fresh errors for immediate use
  };

  const signup = async () => {
    console.log('signup() called with:', signupData);
    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      console.log('Validation failed:', errors);
      return { success: false, errors };
    }

    try {
      const response = await fetch('http://127.0.0.1:2500/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response body:', errorData);
        return { success: false, errors: { general: errorData.detail || 'Signup failed' } };
      }

      const data = await response.json();
      console.log('Success response data:', data);

      return { success: true, data };
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, errors: { general: 'Network error, please try again later.' } };
    }
  };

  return {
    signupData,
    setSignupData,
    signupErrors,
    setSignupErrors,   // <-- Return setter here as well
    validateSignup,
    signup,
  };
};