import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = formData;

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };

  return (
    <div className=" text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Choose New Password</h1>
          <p>Almost done. Enter your new Password and you are all set.</p>
          <form onSubmit={handleOnSubmit}>
            <label>
              <p>New Password *</p>
              <input
                required={true}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={changeHandler}
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>

            <label>
              <p>Confirm New Password *</p>
              <input
                required={true}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={changeHandler}
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>

            <button type="submit">Reset Password</button>
          </form>

          <div>
            <Link to={"/login"}>
              <p>Back To login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
