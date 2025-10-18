import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant" // Default role
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  // Mock login function with role-based routing
  const mockLogin = async (email, password, role) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Role-based mock data with proper routing
    const roleData = {
      tenant: {
        id: Math.random().toString(36).substr(2, 9),
        name: "John Tenant",
        email: email,
        role: "tenant",
        dashboardPath: "/tenant-dashboard",
        unitNumber: "304",
        avatar: "JT"
      },
      manager: {
        id: Math.random().toString(36).substr(2, 9),
        name: "Sarah Manager",
        email: email,
        role: "manager",
        dashboardPath: "/manager-dashboard",
        company: "Premium Properties",
        avatar: "SM"
      }
    };

    const userData = roleData[role] || roleData.tenant;
    
    return {
      success: true,
      user: userData,
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9)
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { email, password, role } = formData;

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

    try {
      // Use mock function with role
      const result = await mockLogin(email, password, role);

      // Store user data with role
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("userRole", result.user.role);

      console.log(`Login successful:`, result.user);
      
      // Redirect to role-specific dashboard
      setTimeout(() => {
        navigate(result.user.dashboardPath, { replace: true });
      }, 500);

    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login with role
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        id: "google-user",
        name: "Google User",
        email: formData.email || "user@google.com",
        role: formData.role,
        dashboardPath: formData.role === "manager" ? "/manager-dashboard" : "/tenant-dashboard",
        ...(formData.role === "manager" ? { company: "Google Properties" } : { unitNumber: "101" })
      };
      
      localStorage.setItem("token", "mock-google-token");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", formData.role);
      
      navigate(userData.dashboardPath, { replace: true });
    }, 1500);
  };

  // Demo credentials helper
  const fillDemoCredentials = (role = "tenant") => {
    const demoData = {
      tenant: {
        email: "tenant@example.com",
        password: "tenant123"
      },
      manager: {
        email: "manager@example.com",
        password: "manager123"
      }
    };

    setFormData({
      ...formData,
      ...demoData[role],
      role: role
    });
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

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: "tenant"});
                  fillDemoCredentials("tenant");
                }}
                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  formData.role === "tenant" 
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">Tenant</div>
                <div className="text-xs mt-1 opacity-75">Renting a property</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: "manager"});
                  fillDemoCredentials("manager");
                }}
                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  formData.role === "manager" 
                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">Manager</div>
                <div className="text-xs mt-1 opacity-75">Managing properties</div>
              </button>
            </div>
          </div>

          {/* Demo Credentials Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm text-center">
              <strong>Demo {formData.role === "tenant" ? "Tenant" : "Manager"} Credentials</strong><br />
              Email: <span className="font-mono text-xs">{formData.email}</span><br />
              Password: <span className="font-mono text-xs">{formData.role === "tenant" ? "tenant123" : "manager123"}</span>
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

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 px-4 rounded-lg font-semibold focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                formData.role === "manager" 
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing in as {formData.role}...
                </div>
              ) : (
                `Sign in as ${formData.role === "manager" ? "Property Manager" : "Tenant"}`
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