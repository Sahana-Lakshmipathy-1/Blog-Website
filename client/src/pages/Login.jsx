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

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const AuthCard = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

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
    console.log("[AuthCard] Switching form:", isLogin ? "Login → Signup" : "Signup → Login");
    setIsLogin(!isLogin);
    setLoginErrors({});
    setSignupErrors({});
    setGeneralError("");
  };

  /* ---------------- LOGIN SUBMIT ---------------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("[AuthCard] Login form submitted with data:", loginData);

    setLoading(true);
    setGeneralError("");
    setLoginErrors({});

    try {
      console.log("[AuthCard] Calling login() hook...");
      const result = await login();
      console.log("[AuthCard] Login result:", result);

      if (result.success) {
        console.log("[AuthCard] Login successful, setting cookies...");

        Cookies.set("accessToken", result.data.access_token, { expires: 1 / 1440 });
        Cookies.set("username", loginData.username, { expires: 1 / 1440 });

        console.log("[AuthCard] Cookies set:");
        console.log(" - accessToken:", Cookies.get("accessToken"));
        console.log(" - username:", Cookies.get("username"));

        setLoginErrors({});
        console.log("[AuthCard] Navigating to home page '/'...");
        navigate("/", { replace: true });
      } else {
        console.error("[AuthCard] Login failed. Errors:", result.errors);
        setGeneralError(result.errors.general || "Login failed, please try again.");
      }
    } catch (err) {
      console.error("[AuthCard] Unexpected error during login:", err);
      setGeneralError("Unexpected error occurred. Please try again.");
    } finally {
      console.log("[AuthCard] Login finished. Resetting loading state.");
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP SUBMIT ---------------- */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    console.log("[AuthCard] Signup form submitted with data:", signupData);

    setLoading(true);
    setGeneralError("");
    setSignupErrors({});

    try {
      console.log("[AuthCard] Calling signup() hook...");
      const result = await signup();
      console.log("[AuthCard] Signup result:", result);

      if (result.success) {
        console.log("[AuthCard] Signup successful. Storing cookies...");

        Cookies.set("accessToken", result.data.access_token, { expires: 1 / 1440 });
        Cookies.set("username", signupData.username, { expires: 1 / 1440 });

        console.log("[AuthCard] Cookies set after signup:");
        console.log(" - accessToken:", Cookies.get("accessToken"));
        console.log(" - username:", Cookies.get("username"));

        setSignupErrors({});
        alert("Signup successful! Please login.");
        console.log("[AuthCard] Switching to login form...");
        setIsLogin(true);
      } else {
        console.error("[AuthCard] Signup failed. Errors:", result.errors);
        setGeneralError(result.errors.general || "Signup failed, please try again.");
      }
    } catch (err) {
      console.error("[AuthCard] Unexpected error during signup:", err);
      setGeneralError("Unexpected error occurred. Please try again.");
    } finally {
      console.log("[AuthCard] Signup finished. Resetting loading state.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your username and password to login."
              : "Fill the form below to create a new account."}
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
              {/* Username */}
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

              {/* Password */}
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
              {/* Name */}
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
                />
              </div>

              {/* Username */}
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

              {/* Email */}
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

              {/* Password */}
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
