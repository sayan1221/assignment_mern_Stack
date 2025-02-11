import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // For redirecting


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerSubmit = async (e) => {
    console.log('register');
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/registration",
        formData,
        { withCredentials: true }
      );
      if (!response.data) {
        console.error("Frondend reg ->", response.data);
        return;
      }
      // console.log('Registration successfully', response.data);
      toast.success("Registration successfully");
      setFormData({ name: "", mobile: "", email: "", password: "", });
      setIsLogin(!isLogin);
    } catch (e) {
      console.error('Registration failed', e);
      toast.error("Registration failed");
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);  // Store JWT token
        // console.log('Login successful', response.data);
        setFormData({ name: "", mobile: "", email: "", password: "", });
        toast.success("Login successful");
        // Redirect to Profile page
        navigate("/profile");
      } else {
        console.error("Login failed: No token received");
      }
    } catch (e) {
      console.error('Login failed', e);
      toast.error("Failed to Login");
    }
  };



  return (
    <div className="px-5 flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      {isLogin === true ? (
        <>
          {/* registration..... */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Create your account</h2>
            <form onSubmit={registerSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Mobile</label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Register
              </button>
            </form>
            <p className="text-center mt-4 text-sm">Already have an account?
              <span className="text-blue-500 cursor-pointer ml-1" onClick={() => { setIsLogin(!isLogin) }} >Login</span>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* login ............. */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Login your account</h2>
            <form onSubmit={loginSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"

              >
                Login
              </button>
            </form>
            <p className="text-center mt-4 text-sm">Don't have an account?
              <span className="text-blue-500 cursor-pointer ml-1" onClick={() => { setIsLogin(!isLogin) }} >Register</span>
            </p>
          </div >
        </>
      )}

    </div >
  );
};

export default AuthPage;
