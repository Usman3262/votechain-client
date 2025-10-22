import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-indigo-700">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <p className="text-gray-600">
        Welcome {user?.email || "Admin"}, you can approve users and monitor results.
      </p>
    </div>
  );
};

export default Dashboard;
