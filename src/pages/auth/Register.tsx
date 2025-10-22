const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="bg-white shadow-lg rounded-xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center text-indigo-600">Create Account</h2>
        <input type="text" placeholder="Full Name" className="border p-2 w-full mb-3 rounded" />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3 rounded" />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded" />
        <button className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">Register</button>
      </form>
    </div>
  );
};
export default Register;
