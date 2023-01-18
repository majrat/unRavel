import React from "react";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const FirstStep = (props) => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    navigate("/signup/2");
    console.log(data);
  };
  return (
    <>
      <Header />
      <form
        className="p-24 justify-center flex"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="group relative">
            <label className="absolute form--label">First Name</label>
            <input
              className={`form--input ${
                errors.first_name ? "input-error" : ""
              }`}
              type="text"
              placeholder="Enter your first name"
              autoComplete="off"
              {...register("first_name", {
                required: "First name is required.",
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "First name should contain only characters.",
                },
              })}
            />
            {errors.first_name && (
              <p className="errorMsg ml-1">{errors.first_name.message}</p>
            )}
          </div>

          <div className="group relative mt-6 ">
            <label className="absolute form--label">Last Name</label>
            <input
              className={`form--input ${errors.last_name ? "input-error" : ""}`}
              type="text"
              placeholder="Enter your last name"
              autoComplete="off"
              {...register("last_name", {
                required: "Last name is required.",
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Last name should contain only characters.",
                },
              })}
            />
            {errors.last_name && (
              <p className="errorMsg ml-1">{errors.last_name.message}</p>
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

export default FirstStep;
