import { useState } from "react";

/* ------------------ Cookie Helpers ------------------ */
const setCookie = (name, value, minutes) => {
  const expiryDate = new Date(Date.now() + minutes * 60 * 1000);

  // GMT string (required for actual cookie)
  const expires = expiryDate.toUTCString();

  // For logs → IST version
  const expiresIST = expiryDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const cookieString = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Strict`;
  document.cookie = cookieString;

  console.log(`[Cookie] SET → ${cookieString}`);
  console.log(`[Cookie] Expiry (IST): ${expiresIST}`);
};


const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  const value = match ? decodeURIComponent(match[2]) : null;

  console.log(`[Cookie] GET → ${name}:`, value);
  return value;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(`[Cookie] DELETE → ${name}`);
};

/* ------------------ JWT Decoder ------------------ */
const parseJwt = (token) => {
  try {
    console.log("[JWT] Raw token:", token);
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    console.log("[JWT] Decoded payload:", parsed);
    return parsed;
  } catch (err) {
    console.error("[JWT] Failed to parse token:", err);
    return null;
  }
};

/* ------------------ Login Hook ------------------ */
export const useLoginValidation = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  const validateLogin = () => {
    console.log("[Login] Validating loginData:", loginData);
    const errors = {};
    if (!loginData.username.trim()) {
      errors.username = "Username is required";
    } else if (loginData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setLoginErrors(errors);
    console.log("[Login] Validation result:", errors);
    return errors;
  };

  const login = async () => {
    console.log("[Login] login() called with:", loginData);

    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      console.warn("[Login] Validation failed:", errors);
      return { success: false, errors };
    }

    try {
      console.log("[Login] Sending request to /api/auth/token");
      const response = await fetch("http://127.0.0.1:2500/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      console.log("[Login] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Login] Error response:", errorData);
        return {
          success: false,
          errors: { general: errorData.detail || "Login failed" },
        };
      }

      const data = await response.json();
      console.log("[Login] Success response data:", data);

      if (data.access_token) {
        console.log("[Login] Token received:", data.access_token);

        // Decode JWT for username
        const payload = parseJwt(data.access_token);
        const username = payload?.sub || loginData.username;

        console.log("[Login] Username resolved from token:", username);

        // Store in cookies for 1 minute
        setCookie("accessToken", data.access_token, 1);
        setCookie("username", username, 1);
      } else {
        console.error("[Login] No access_token in response!");
        return { success: false, errors: { general: "Invalid token received" } };
      }

      console.log("[Login] Login successful");
      return { success: true, data };
    } catch (err) {
      console.error("[Login] Network or unexpected error:", err);
      return {
        success: false,
        errors: { general: "Network error, please try again later." },
      };
    }
  };

  return {
    loginData,
    setLoginData,
    loginErrors,
    setLoginErrors,
    validateLogin,
    login,
  };
};

/* ------------------ Signup Hook ------------------ */
export const useSignupValidation = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    name: "",
    useremail: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  const validateSignup = () => {
    console.log("[Signup] Validating signupData:", signupData);
    const errors = {};

    if (!signupData.name.trim()) {
      errors.name = "Name is required";
    } else if (signupData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!signupData.username.trim()) {
      errors.username = "Username is required";
    } else if (signupData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!signupData.useremail.trim()) {
      errors.useremail = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(signupData.useremail)
    ) {
      errors.useremail = "Invalid email address";
    }

    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setSignupErrors(errors);
    console.log("[Signup] Validation result:", errors);
    return errors;
  };

  const signup = async () => {
    console.log("[Signup] signup() called with:", signupData);

    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      console.warn("[Signup] Validation failed:", errors);
      return { success: false, errors };
    }

    try {
      console.log("[Signup] Sending request to /api/auth/signup");
      const response = await fetch("http://127.0.0.1:2500/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      console.log("[Signup] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Signup] Error response:", errorData);
        return {
          success: false,
          errors: { general: errorData.detail || "Signup failed" },
        };
      }

      const data = await response.json();
      console.log("[Signup] Success response data:", data);
      return { success: true, data };
    } catch (err) {
      console.error("[Signup] Network or unexpected error:", err);
      return {
        success: false,
        errors: { general: "Network error, please try again later." },
      };
    }
  };

  return {
    signupData,
    setSignupData,
    signupErrors,
    setSignupErrors,
    validateSignup,
    signup,
  };
};

/* ------------------ Export cookie utils (for logout etc.) ------------------ */
export { getCookie, deleteCookie };
