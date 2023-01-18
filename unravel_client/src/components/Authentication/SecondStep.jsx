import React from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SecondStep = (props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user.email,
      password: user.password,
    },
  });

  const onSubmit = (data) => {
    props.updateUser(data);
    navigate("/signup/3");
    console.log(data);
  };

  return (
    <>
      <Header {...props} router={{ location }} />

      <form
        className="p-24 justify-center flex"
        onSubmit={handleSubmit(onSubmit)}
      >
        <motion.div initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={{ stiffness: 100 }}>
          <div className="group relative">
            <div>
              <label className="absolute form--label">Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                autoComplete="off"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is not valid.",
                  },
                })}
                className={`form--input ${
                  errors.email ? "input-error" : ""
                }`}
              />
              {errors.email && (
                <p className="errorMsg ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="group relative mt-6 ">
              <label className="absolute form--label">Password</label>
              <input
                type="password"
                placeholder="Choose a password"
                autoComplete="off"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password should have at-least 6 characters.",
                  },
                })}
                className={`form--input ${
                  errors.password ? "input-error" : ""
                }`}
              />
              {errors.password && (
                <p className="errorMsg ml-1">{errors.password.message}</p>
              )}
            </div>

            <button className="btn mt-6 btn--primary" type="submit">
              Next
            </button>
          </div>
        </motion.div>
      </form>
      {/* Waves Container */}
      <div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#c19892" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#d8d7d7" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#bebfbd" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f3f1ef" />
          </g>
        </svg>
      </div>
      {/* Waves end */}
    </>
  );
};

export default SecondStep;
