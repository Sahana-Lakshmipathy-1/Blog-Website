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

  return {
    loginData,
    setLoginData,
    loginErrors,
    validateLogin,
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

  return {
    signupData,
    setSignupData,
    signupErrors,
    validateSignup,
  };
};
