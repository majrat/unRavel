import React from "react";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginWave from "./Loginwave";

const FirstStep = (props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
    },
  });

  const onSubmit = (data) => {
    props.updateUser(data);
    navigate("/signup/2");
    console.log(data);
  };
  return (
    <>
      <div className="sm:grid flex flex-col-reverse sm:flex-none sm:grid-cols-12">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="sm:col-span-5 mt-10 col-span-12 justify-center items-center flex flex-col"
        >
          <img className="sm:w-36" src="/unravel.svg" alt="icon_img" />
          <p className="text-gray-700">Join the community</p>
          <p className="text-gray-700">Explore the world together</p>
          <img
            className="sm:w-96"
            src="/undraw_navigator_a479.svg"
            alt="bg_img"
          />
        </motion.div>
        <div className="sm:col-span-7 col-span-12">
          <Header {...props} router={{ location }} />
          <form
            className="sm:p-20 pt-20 sm:pt-0 justify-center flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="group relative sm:mt-24">
                <label className="absolute form--label">First Name</label>
                <input
                  className={`form--input sm:mr-56 ${
                    errors.first_name ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder={
                    errors.first_name
                      ? errors.first_name.message
                      : "Enter your name"
                  }
                  autoComplete="off"
                  {...register("first_name", {
                    required: "Name is required.",
                    pattern: {
                      value: /^[a-zA-Z ]+$/,
                      message: "Name should contain only characters.",
                    },
                  })}
                />
              </div>

              <div className="group relative mt-6">
                <label className="absolute form--label">Last Name</label>
                <input
                  className={`form--input sm:mr-56 ${
                    errors.last_name ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder={
                    errors.last_name
                      ? errors.last_name.message
                      : "Enter your last_name"
                  }
                  autoComplete="off"
                  {...register("last_name", {
                    pattern: {
                      value: /^[a-zA-Z ]+$/,
                      message: "username should contain only characters.",
                    },
                  })}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button className="btn btn--primary" type="submit">
                  Next
                </button>
                <Link className="btn my-5 btn--secondary" to="/signin">
                  Already have an account
                </Link>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
      <LoginWave />
    </>
  );
};

export default FirstStep;
