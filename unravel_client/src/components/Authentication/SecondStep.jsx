import React from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LoginWave from "./Loginwave";

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
  };

  return (
    <>
      <div className="sm:grid flex flex-col-reverse sm:flex-none sm:grid-cols-12 mt-16">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="sm:col-span-5 justify-center items-center flex flex-col"
        >
          <img
            className="sm:w-36 hover:shadow-lg rounded-lg items-center hidden sm:flex flex-col cursor-pointer"
            src="/unravel.svg"
            alt="icon_img"
          />
          <img
            className="sm:w-96"
            src="/undraw_navigator_a479.svg"
            alt="bg_img"
          />
          <p className="text-gray-700 sm:text-base text-sm">
            Join the community
          </p>
          <p className="text-gray-700 sm:text-base text-sm">
            Explore the world together
          </p>
        </motion.div>
        <div className="sm:col-span-7">
          <Header {...props} router={{ location }} />

          <form
            className="sm:p-20 pt-2 sm:pt-0 justify-center flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="group relative sm:mt-24">
                <div>
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
                    className={`form--input sm:mr-56 ${
                      errors.email ? "input-error" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="errorMsg ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="group relative mt-6 ">
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
                    className={`form--input sm:mr-56 ${
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
        </div>
      </div>
      <LoginWave />
    </>
  );
};

export default SecondStep;
