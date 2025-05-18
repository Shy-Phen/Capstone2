import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "../Components/Input";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false); // Remember Me state
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.username.length < 3)
      return toast.error("Username must be at least 3 characters");
    if (!rememberMe) {
      toast.error("Please check the 'Remember Me' box to proceed");
      return false;
    }

    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gray-900 lg:w-80 lg:h-[500px] sm:w-48 sm:h-52 md:h-[500px] md:w-96 rounded-lg border border-white p-6">
        <h2 className="text-center myfont text-white text-2xl mb-4">
          Register
        </h2>
        <form className="flex flex-col " onSubmit={handleSignUp}>
          <Input
            label="Email"
            icon={Mail}
            type="text"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            label="Username"
            icon={User}
            type="text"
            placeholder="John Doe"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-white">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white mt-4 py-2 rounded-lg disabled:bg-gray-600"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader className="w-5 h-5 animate-spin inline-block mr-2" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
