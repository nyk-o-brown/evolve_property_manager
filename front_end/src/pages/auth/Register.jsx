import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    phone: "",
    ...(role === "manager" && { companyName: "", licenseNumber: "" })
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  // Mock register function with role-based data and routing
  const mockRegister = async (userData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Role-based mock data with proper routing
    const roleData = {
      tenant: {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "tenant",
        dashboardPath: "/tenant-dashboard",
        unitNumber: Math.floor(Math.random() * 500) + 100,
        avatar: userData.name.split(' ').map(n => n[0]).join('')
      },
      manager: {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "manager",
        dashboardPath: "/manager-dashboard",
        company: userData.companyName || "My Property Company",
        licenseNumber: userData.licenseNumber || "LIC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        avatar: userData.name.split(' ').map(n => n[0]).join('')
      }
    };

    const userProfile = roleData[userData.role] || roleData.tenant;
    
    return {
      success: true,
      user: userProfile,
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9)
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { name, email, password, confirmPassword, role, phone } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    try {
      // Use mock function with role
      const result = await mockRegister({ ...formData, role });

      // Store user data with role
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("userRole", result.user.role);

      console.log(`Registration successful:`, result.user);
      
      // Redirect to role-specific dashboard
      setTimeout(() => {
        navigate(result.user.dashboardPath, { replace: true });
      }, 500);

    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Mock Google signup with role
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        id: "google-user",
        name: formData.name || "Google User",
        email: formData.email || "user@google.com",
        phone: formData.phone || "+1234567890",
        role: formData.role,
        dashboardPath: formData.role === "manager" ? "/manager-dashboard" : "/tenant-dashboard",
        ...(formData.role === "manager" ? 
          { company: formData.companyName || "Google Properties" } : 
          { unitNumber: "101" }
        ),
        avatar: (formData.name || "G U").split(' ').map(n => n[0]).join('')
      };
      
      localStorage.setItem("token", "mock-google-token");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", formData.role);
      
      navigate(userData.dashboardPath, { replace: true });
    }, 1500);
  };

  // Demo data for form preview
  const fillDemoData = (role = "tenant") => {
    const demoData = {
      tenant: {
        name: "John Tenant",
        email: "tenant@example.com",
        phone: "+1234567890",
        password: "tenant123",
        confirmPassword: "tenant123"
      },
      manager: {
        name: "Sarah Manager",
        email: "manager@example.com",
        phone: "+1987654321",
        password: "manager123",
        confirmPassword: "manager123",
        companyName: "Premium Properties LLC",
        licenseNumber: "LIC-ABC123"
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
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us today and get started
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to register as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: "tenant"});
                  fillDemoData("tenant");
                }}
                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  formData.role === "tenant" 
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">Tenant</div>
                <div className="text-xs mt-1 opacity-75">Looking to rent</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, role: "manager"});
                  fillDemoData("manager");
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

          {/* Role-specific information */}
          <div className={`mb-6 p-4 rounded-xl ${
            formData.role === "manager" 
              ? "bg-green-50 border border-green-200" 
              : "bg-blue-50 border border-blue-200"
          }`}>
            <h3 className={`font-semibold text-sm mb-2 ${
              formData.role === "manager" ? "text-green-800" : "text-blue-800"
            }`}>
              {formData.role === "manager" ? "Property Manager Account" : "Tenant Account"}
            </h3>
            <p className={`text-xs ${
              formData.role === "manager" ? "text-green-700" : "text-blue-700"
            }`}>
              {formData.role === "manager" 
                ? "Manage properties, handle tenants, and process payments with your manager account." 
                : "Find your perfect home, submit maintenance requests, and pay rent online."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* Manager-specific fields */}
            {formData.role === "manager" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  Additional information for property managers:
                </p>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Real estate license number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
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
                  Creating {formData.role} account...
                </div>
              ) : (
                `Create ${formData.role === "manager" ? "Property Manager" : "Tenant"} Account`
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
              onClick={handleGoogleSignup}
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
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-gray-900 font-medium hover:text-blue-600 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Demo Helper */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => fillDemoData(formData.role)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Fill demo {formData.role} data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;