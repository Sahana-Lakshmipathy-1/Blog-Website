import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  useLoginValidation,
  useSignupValidation,
} from "@/hooks/LoginValidation";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const AuthCard = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLoginErrors({});
    setSignupErrors({});
    setErrorMessage("");
  };

  /* ---------------- LOGIN SUBMIT ---------------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setLoginErrors({});

    try {
      const result = await login();

      if (result.success) {
        Cookies.set("accessToken", result.data.access_token, { expires: 45 / 1440 });
        Cookies.set("username", loginData.username, { expires: 45 / 1440 });

        navigate("/", { replace: true });
      } else {
        setErrorMessage(result.errors.general || "Login failed. Please try again.");
      }
    } catch {
      setErrorMessage("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP SUBMIT ---------------- */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSignupErrors({});

    try {
      const result = await signup();

      if (result.success) {
        Cookies.set("accessToken", result.data.access_token, { expires: 45 / 1440 });
        Cookies.set("username", signupData.username, { expires: 45 / 1440 });

        setIsLogin(true); // switch to login
      } else {
        setErrorMessage(result.errors.general || "Signup failed. Please try again.");
      }
    } catch {
      setErrorMessage("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your username and password to login."
              : "Fill the form below to create a new account."}
          </CardDescription>
        </CardHeader>

        {/* AlertDialog for general errors */}
        {errorMessage && (
          <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage("")}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Error</AlertDialogTitle>
                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction onClick={() => setErrorMessage("")}>
                Close
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        )}

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
                />
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
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
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
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Your full name"
                />
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
                />
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
                />
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
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
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
