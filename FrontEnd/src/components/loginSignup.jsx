import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

function LoginSignup({ isDarkMode, toggleTheme }) {
  // Add auth context
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!isLogin) {
      if (!name || name.length < 3) {
        errors.name = "Name must be at least 3 characters long";
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!password.match(/[A-Z]/)) {
      errors.password = "Password must contain at least one uppercase letter";
    }

    if (!password.match(/[a-z]/)) {
      errors.password = "Password must contain at least one lowercase letter";
    }

    if (!password.match(/[0-9]/)) {
      errors.password = "Password must contain at least one number";
    }

    if (!password.match(/[!@#$%^&*]/)) {
      errors.password = "Password must contain at least one special character";
    }

    return errors;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const payload = isLogin 
        ? { email, password }
        : { name, email, password };
      
      // Use the appropriate service method based on login or register
      const data = isLogin 
        ? await UserService.login(payload) 
        : await UserService.register(payload);
      
      // The error handling is now done in the service layer

      // Update auth context first
      await login(data.user, data.token);

      // Log the user data to verify isAdmin status
      console.log('User data:', data.user);

      // Check admin status and redirect
      if (data.user && data.user.isAdmin === true) {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin', { replace: true });
      } else {
        console.log('Redirecting to home...');
        navigate('/', { replace: true });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add error display in the form
  const errorMessage = error && (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <p className="text-red-700">{error}</p>
    </div>
  );

  // Add this after your existing error message display
  const renderFieldError = (fieldName) => {
    return validationErrors[fieldName] && (
      <p className="text-red-500 text-sm mt-1">{validationErrors[fieldName]}</p>
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)]">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full rounded-xl shadow-md p-6 bg-[var(--card-background)]" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
          {errorMessage}
          <div className="text-center mb-8">
            <svg
              className="w-12 h-12 text-[var(--accent)] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold">{isLogin ? "Login to Your Account" : "Create an Account"}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {isLogin
                ? "Access your saved PC builds and configurations"
                : "Join to save and manage your custom PC builds"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border ${validationErrors.name ? 'border-red-500' : 'border-[var(--border-color)]'} dark:border-gray-700 rounded-md px-4 py-2 w-full 
                  focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 
                  bg-[var(--card-background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]`}
                  placeholder="John Doe"
                  required={!isLogin}
                />
                {renderFieldError('name')}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border ${validationErrors.email ? 'border-red-500' : 'border-[var(--border-color)]'} dark:border-gray-700 rounded-md px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 
                bg-[var(--card-background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]`}
                placeholder="you@example.com"
                required
              />
              {renderFieldError('email')}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border ${validationErrors.password ? 'border-red-500' : 'border-[var(--border-color)]'} dark:border-gray-700 rounded-md px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 
                bg-[var(--card-background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]`}
                placeholder="••••••••"
                required
              />
              {renderFieldError('password')}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-[#f87060] hover:text-orange-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="bg-[#f87060] hover:bg-[#f87060] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 w-full flex items-center justify-center cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 ">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-[#f87060] hover:text-orange-600 hover:underline cursor-pointer"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Or continue with</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 border border-[var(--border-color)] 
rounded-md hover:bg-[var(--config-bg)] transition-colors text-[var(--text-primary)] dark:border-gray-700 cursor-pointer"
                onClick={() => console.log("Google sign-in clicked")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 border border-[var(--border-color)] 
rounded-md hover:bg-[var(--config-bg)] transition-colors text-[var(--text-primary)] dark:border-gray-700 cursor-pointer"
                onClick={() => console.log("Facebook sign-in clicked")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginSignup;