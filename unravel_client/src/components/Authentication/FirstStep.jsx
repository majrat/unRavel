import React from "react";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginBg from "./LoginBg";
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
      name: user.name,
      username: user.username,
    },
  });

  const onSubmit = (data) => {
    props.updateUser(data);
    navigate("/signup/2");
    console.log(data);
  };
  return (
    <>
      <div className="grid grid-cols-12">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="col-span-5 justify-center items-center flex flex-col"
        >
          <img className="w-36" src="/unravel.svg" alt="icon_img" />
          <p className="text-gray-700">Join the community</p>
          <p className="text-gray-700">Explore the world together</p>
          <img className="w-96" src="/undraw_navigator_a479.svg" alt="bg_img" />
        </motion.div>
        <div className="col-span-7">
          <Header {...props} router={{ location }} />
          <form
            className="p-20 justify-center flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="group relative">
                <label className="absolute form--label">Name</label>
                <input
                  className={`form--input ${errors.name ? "input-error" : ""}`}
                  type="text"
                  placeholder={
                    errors.name ? errors.name.message : "Enter your name"
                  }
                  autoComplete="off"
                  {...register("name", {
                    required: "Name is required.",
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: "Name should contain only characters.",
                    },
                  })}
                />
              </div>

              <div className="group relative mt-6">
                <label className="absolute form--label">User Name</label>
                <input
                  className={`form--input ${
                    errors.username ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder={
                    errors.username
                      ? errors.username.message
                      : "Enter your username"
                  }
                  autoComplete="off"
                  {...register("username", {
                    required: "username is required.",
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message:
                        "username should contain only characters and number.",
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
