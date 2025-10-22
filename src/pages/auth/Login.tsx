import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock JWT (replace with API call later)
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      "eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9." +
      "abc123";

    login(fakeToken);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center text-indigo-600">
          Admin / User Login
        </h2>
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3 rounded" />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded" />
        <button className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
