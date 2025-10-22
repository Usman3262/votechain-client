import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, token } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              VoteChain
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {token && user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin/dashboard')
                        ? 'bg-indigo-900 text-white'
                        : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {token && user?.role !== 'admin' && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/dashboard')
                          ? 'bg-indigo-900 text-white'
                          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/vote"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/vote')
                          ? 'bg-indigo-900 text-white'
                          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      Vote
                    </Link>
                    <Link
                      to="/results"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/results')
                          ? 'bg-indigo-900 text-white'
                          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      Results
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {token ? (
                <div className="flex items-center space-x-4">

                  <span className="text-sm">Welcome, {user?.email?.split('@')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {token && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/dashboard')
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
          {token && user?.role !== 'admin' && (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/vote"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/vote')
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Vote
              </Link>
              <Link
                to="/results"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/results')
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Results
              </Link>
            </>
          )}
          {token ? (
            <div className="pt-4 pb-3 border-t border-indigo-800">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.email?.split('@')[0]}</div>
                  <div className="text-sm font-medium text-indigo-200">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;