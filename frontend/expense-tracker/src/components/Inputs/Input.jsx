import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ label, value, onChange, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        {/* [READABILITY] Nested ternary is hard to read. Extract to a variable:
            const inputType = type === "password" && showPassword ? "text" : type; */}
        <input
          type={type == 'password' ? showPassword ? 'text' : 'password' : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)} // [SIMPLIFY] Unnecessary wrapper — just use onChange={onChange}
        />

        {/* [SIMPLIFY] The <> fragment is unnecessary — a single ternary works fine.
            Also onClick={() => toggleShowPassword()} can be just onClick={toggleShowPassword} */}
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
