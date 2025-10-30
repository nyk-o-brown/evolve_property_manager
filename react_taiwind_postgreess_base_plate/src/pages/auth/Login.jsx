import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  // Mock admin login function
  const mockAdminLogin = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Admin User",
      email: email,
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9),
      role: "admin"
    };
    return {
      success: true,
      user: mockUser,
      token: mockUser.token
    };
  };

  // Real tenant login function
  const tenantLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/tenant_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok || result.status !== 'success') {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    } catch (err) {
      throw new Error(err.message || 'Server error. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!role) {
      setError("Please select a login role (Administrator or Tenant).");
      setIsLoading(false);
      return;
    }

    try {
      if (role === "admin") {
        // Admin login (mock)
        const result = await mockAdminLogin(email, password);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("role", "admin");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);

      } else if (role === "tenant") {
        // Tenant login (real)
        const result = await tenantLogin(email, password);
        
        // Store tenant data
        localStorage.setItem("token", result.token);
        localStorage.setItem("tenant", JSON.stringify(result.tenant));
        localStorage.setItem("role", "tenant");

        setTimeout(() => {
          navigate("/tenant", { replace: true });
        }, 500);
      }

    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!role) {
      setError("Please select a login role before continuing with Google.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("token", "mock-google-token");
      localStorage.setItem("user", JSON.stringify({
        id: "google-user",
        name: "Google User",
        email: "user@google.com"
      }));
      localStorage.setItem("role", role);
      
      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/tenant", { replace: true });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Role selection */}
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-2">Choose your login role:</p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => { setRole("admin"); setError(""); }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    role === "admin" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("tenant"); setError(""); }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    role === "tenant" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Tenant
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in to your account"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-gray-900 font-medium hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;