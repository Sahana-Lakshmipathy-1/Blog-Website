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
  const [isLogin, setIsLogin] = useState(true);

  // Use custom hooks for login/signup state, validation & API calls
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

  // Handle switching form type — clear errors on toggle
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login();
    if (!result.success) {
      if (result.errors.general) alert(result.errors.general);
      // Errors already set in state via hook
    } else {
      alert('Login successful!');
      // Example: navigate or update UI
      // navigate('/dashboard');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const result = await signup();
    if (!result.success) {
      if (result.errors.general) alert(result.errors.general);
    } else {
      alert('Signup successful!');
      setIsLogin(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? 'Login' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your username and password to login.'
              : 'Fill the form below to create a new account.'}
          </CardDescription>
        </CardHeader>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} noValidate>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
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

              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
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

              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} noValidate>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
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

              <div className="space-y-1">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  value={signupData.username}
                  onChange={(e) =>
                    setSignupData({ ...signupData, username: e.target.value })
                  }
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

              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupData.useremail}
                  onChange={(e) =>
                    setSignupData({ ...signupData, useremail: e.target.value })
                  }
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

              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
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

              <Button type="submit" className="w-full mt-4">
                Sign Up
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
