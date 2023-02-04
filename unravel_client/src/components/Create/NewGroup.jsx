import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import Swal from "sweetalert2";

const NewGroup = (props) => {
  let navigate = useNavigate();

  const group = {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grpName: group.grpName,
      grpDesc: group.grpDesc,
    },
  });

  const onSubmit = async (data) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          console.log(token);
          await axios
            .post("http://localhost:8080/api/user/create_group", {
              headers: {
                authorization: `Bearer ${token}`,
              },
              ...data,
            })
            .then(() => {
              navigate("/");
              console.log("success");
            })
            .catch((err) => alert(err.message));
          console.log(data);
        }
      });
    } catch (err) {
      if (err.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data,
        });
        console.log("error", err.response.data);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <img src="/create_group_bg.jpg" alt="bg" />
        <div className="mt-24 backdrop-blur-sm bg-accentColor/60 shadow-lg shadow-black/70 rounded-md absolute">
          <motion.div
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ stiffness: 100 }}
            className="justify-center items-center flex flex-col parallax-world-of-ugg"
          >
            <div className="text-center mt-4 text-lightColor">
              <h1>Create new Group</h1>
              <h3 className="mt-4">Explore the world together</h3>
            </div>
          </motion.div>
          <div className="">
            {/* <Header {...props} router={{ location }} /> */}
            <form
              className="pb-20 px-16 pt-6 justify-center flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                transition={{ stiffness: 100 }}
              >
                <div className="mt-1">
                  <label className="">Group Name</label>
                  <input
                    className={`h-10 mt-2 px-5 w-full rounded-md ${
                      errors.grpName ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder={
                      errors.grpName
                        ? errors.grpName.message
                        : "Give your group a unique name"
                    }
                    autoComplete="off"
                    {...register("grpName", {
                      required: "Group name is required.",
                      pattern: {
                        value: /^[a-zA-Z ]+$/,
                        message: "Name should contain only characters.",
                      },
                    })}
                  />
                </div>

                <div className="mt-6">
                  <p className="mb-3">Group Description</p>
                  <textarea
                    className={`h-40 px-5 w-full rounded-md ${
                      errors.grpDesc ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder={
                      errors.grpDesc
                        ? errors.grpDesc.message
                        : "eg: A group focused on party trips...."
                    }
                    autoComplete="off"
                    {...register("grpDesc", {
                      required: "username is required.",
                      pattern: {
                        value: /^[a-zA-Z0-9 ]+$/,
                        message:
                          "username should contain only characters and number.",
                      },
                    })}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button className="btn btn--primary" type="submit">
                    Done
                  </button>
                  {/* <Link className="btn my-5 btn--secondary" to="/signin">
                  Already have an account
                </Link> */}
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGroup;
