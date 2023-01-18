import React from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const SecondStep = (props) => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    navigate("/signup/3");
    console.log(data);
  };

  return (
    <>
      <Header />
      <form
        className="p-24 justify-center flex"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="group relative">
          <div>
            <label className="absolute form--label">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              autoComplete="off"
              {...register("user_email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Email is not valid.",
                },
              })}
              className={`form--input ${
                errors.user_email ? "input-error" : ""
              }`}
            />
            {errors.user_email && (
              <p className="errorMsg ml-1">{errors.user_email.message}</p>
            )}
          </div>

          <div className="group relative mt-6 ">
            <label className="absolute form--label">Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              autoComplete="off"
              {...register("user_password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password should have at-least 6 characters.",
                },
              })}
              className={`form--input ${
                errors.user_password ? "input-error" : ""
              }`}
            />
            {errors.user_password && (
              <p className="errorMsg ml-1">{errors.user_password.message}</p>
            )}
          </div>

          <button className="btn mt-6 btn--primary" type="submit">
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default SecondStep;
