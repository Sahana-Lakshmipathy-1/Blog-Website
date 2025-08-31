import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { useLoginValidation, useSignupValidation } from '@/hooks/LoginValidation';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const AuthCard = () => {
  const navigate = useNavigate();

  // State to switch between Login and Signup form
  const [isLogin, setIsLogin] = useState(true);

  // Loading state during async calls
  const [loading, setLoading] = useState(false);

  // General error message (non-field specific)
  const [generalError, setGeneralError] = useState('');

  // Hooks for login and signup validation and data
  const {
    loginData,
    setLoginData,
    loginErrors,
    login,
    setLoginErrors,
  } = useLoginValidation();

  const {
    signupData,
    setSignupData,
    signupErrors,
    signup,
    setSignupErrors,
  } = useSignupValidation();

  // Toggle between login/signup and clear errors
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLoginErrors({});
    setSignupErrors({});
    setGeneralError('');
  };

  // Submit handler for login form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setLoginErrors({}); // clear field errors before validating

    try {
      const result = await login();
      if (result.success) {
        setLoginErrors({});
        navigate('/', { replace: true });
      } else {
        setGeneralError(result.errors.general || 'Login failed, please try again.');
      }
    } catch {
      setGeneralError('Unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit handler for signup form
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setSignupErrors({}); // clear field errors before validating

    try {
      const result = await signup();
      if (result.success) {
        setSignupErrors({});
        alert('Signup successful! Please login.');
        setIsLogin(true);
      } else {
        setGeneralError(result.errors.general || 'Signup failed, please try again.');
      }
    } catch {
      setGeneralError('Unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your username and password to login.'
              : 'Fill the form below to create a new account.'}
          </CardDescription>
        </CardHeader>

        {/* General error alert */}
        {generalError && (
          <Alert variant="destructive" className="mx-6 mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} noValidate>
            <CardContent className="space-y-6">
              {/* Username field */}
              <div className="space-y-1">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter your username"
                  aria-invalid={!!loginErrors.username}
                  aria-describedby="login-username-error"
                />
                {loginErrors.username && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{loginErrors.username}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  aria-invalid={!!loginErrors.password}
                  aria-describedby="login-password-error"
                />
                {loginErrors.password && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{loginErrors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} noValidate>
            <CardContent className="space-y-6">
              {/* Name field */}
              <div className="space-y-1">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Your full name"
                  aria-invalid={!!signupErrors.name}
                  aria-describedby="signup-name-error"
                />
                {signupErrors.name && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{signupErrors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Username field */}
              <div className="space-y-1">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  placeholder="Choose a username"
                  aria-invalid={!!signupErrors.username}
                  aria-describedby="signup-username-error"
                />
                {signupErrors.username && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{signupErrors.username}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupData.useremail}
                  onChange={(e) => setSignupData({ ...signupData, useremail: e.target.value })}
                  placeholder="Your email address"
                  aria-invalid={!!signupErrors.useremail}
                  aria-describedby="signup-email-error"
                />
                {signupErrors.useremail && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{signupErrors.useremail}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Choose a password"
                  aria-invalid={!!signupErrors.password}
                  aria-describedby="signup-password-error"
                />
                {signupErrors.password && (
                  <Alert variant="destructive" className="mt-1">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{signupErrors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </CardContent>
          </form>
        )}

        <CardFooter className="text-sm text-muted-foreground text-center">
          {isLogin ? (
            <>
              New here?&nbsp;
              <button
                className="font-semibold text-black hover:text-blue-700"
                onClick={toggleForm}
                type="button"
                disabled={loading}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?&nbsp;
              <button
                className="font-semibold text-black hover:text-blue-700"
                onClick={toggleForm}
                type="button"
                disabled={loading}
              >
                Login here
              </button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthCard;