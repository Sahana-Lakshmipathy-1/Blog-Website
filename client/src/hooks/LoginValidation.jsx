import { useState } from 'react';

export const useLoginValidation = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

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
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    if (!validateLogin()) return { success: false, errors: loginErrors };

    try {
      const response = await fetch('http://127.0.0.1:2500/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: { general: errorData.detail || 'Login failed' } };
      }

      const data = await response.json();
      if (data.token) localStorage.setItem('authToken', data.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, errors: { general: 'Network error, please try again later.' } };
    }
  };

  return {
    loginData,
    setLoginData,
    loginErrors,
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
    return Object.keys(errors).length === 0;
  };

  const signup = async () => {
    if (!validateSignup()) return { success: false, errors: signupErrors };

    try {
      const response = await fetch('http://127.0.0.1:2500/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: { general: errorData.detail || 'Signup failed' } };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, errors: { general: 'Network error, please try again later.' } };
    }
  };

  return {
    signupData,
    setSignupData,
    signupErrors,
    validateSignup,
    signup,
  };
};
