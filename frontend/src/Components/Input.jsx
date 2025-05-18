import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInput = type === "password";

  return (
    <div className="relative mb-6">
      {label && (
        <label className="block mb-2 text-sm font-medium text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-green-500" />
          </div>
        )}
        <input
          {...props}
          type={isPasswordInput && !showPassword ? "password" : "text"}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
          style={{
            textAlign: "left", // Aligns the placeholder text left
          }}
        />
        {isPasswordInput && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default Input;
