import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { setCredentials } from '../store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect (() => {
    window.scrollTo(0,0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await login(email, password);
      } else {
        response = await register(name, email, password, role);
      }

      dispatch(setCredentials(response.data));

      isLogin && toast.success("Login Succesful");
      !isLogin && toast.success("Registration Succesful");

      const user = response.data.user;
      
      // Navigate based on role and profile status
      if (user.role === "employer" && user.profile) {
        navigate('/employer-dashboard');
      } else if (user.role === "job_seeker" && user.profile) {
        navigate('/jobseeker-dashboard');
      } else {
        navigate('/profile'); // Redirect to profile if profile is incomplete or missing
      }
    } catch (error) {
      toast.error("Authentication Failed");
      setError(`Authentication failed`);
    }
  };

  return (
    <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      User Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">User Type</label>
                      <div className="mt-1">
                        <div className="flex items-center">
                          <input
                            id="employer"
                            name="role"
                            type="radio"
                            required
                            value="employer"
                            checked={role === "employer"}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="employer" className="ml-2 block text-sm text-gray-700">
                            Employer
                          </label>
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            id="job_seeker"
                            name="role"
                            type="radio"
                            required
                            value="job_seeker"
                            checked={role === "job_seeker"}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="job_seeker" className="ml-2 block text-sm text-gray-700">
                            Job Seeker
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-500"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLogin ? 'Sign in' : 'Register'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {isLogin ? 'New to JobBoard?' : 'Already have an account?'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLogin ? 'Create a new account' : 'Sign in to your account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}