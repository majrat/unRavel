import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebase";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

export default function EditGroup() {
  const [group, setGroup] = useState("");
  const [reRender, setReRender] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupProfile, setGroupProfile] = useState("");

  const location = useLocation();
  let link_group_id;
  if (location?.state !== null) {
    link_group_id = location?.state;
  }
  console.log(link_group_id);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const groupUpdate = async (e) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          // setProfilePhoto(e.target.logo.files[0]);

          e.preventDefault();
          // console.log(token);
          await axios
            .patch("http://localhost:8080/api/user/group", {
              name,
              link_group_id,
              description,
              groupProfile,
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // refreshPage();
              Swal.fire({
                icon: "success",
                title: "Edits saved",
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
              // console.log("success");
            })
            .catch((error) =>
              Swal.fire({
                icon: "error",
                title: "something went wrong",
                showConfirmButton: false,
                timer: 1500,
              })
            );
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

  async function getCurrentGroup() {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .get("http://localhost:8080/api/user/group", {
              headers: {
                authorization: `Bearer ${token}`,
              },
              params: link_group_id,
            })
            .then((res) => {
              if (res?.data) {
                setGroup(res?.data);
                setName(res?.data?.name);
                setDescription(res?.data?.description);
              } else {
                Swal.fire({
                  title: "No groups found in the database",
                  text: "No groups data found. Database empty",
                  icon: "warning",
                  allowOutsideClick: false,
                  confirmButtonColor: "#3085d6",
                });
              }
            });
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User might be logged out --" + err,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  function converToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const onUpload = async (e) => {
    const base64 = await converToBase64(e.target.files[0]);
    setGroupProfile(base64);
    setReRender(!reRender);
  };
  console.log(group);

  useEffect(() => {
    getCurrentGroup();
  }, [reRender, groupProfile]);

  return (
    <>
      <Navbar />
      <div className="absolute z-10 w-full">
        <p className="Oswald-font mt-24 pt-1 bg-primaryColor/50 backdrop-blur-md sm:mx-16 mx-5 rounded text-center pb-2 text-lightColor ">
          <span className="font-bold link-warning cursor-pointer">Edit</span>
          {" " + group?.name}
        </p>
        <form
          className="grid h-96 grid-cols-12 sm:mx-16 mx-5 mt-1"
          onSubmit={groupUpdate}
        >
          <div className="sm:col-span-4 col-span-12 pt-6 sm:pt-0 bg-secondaryColor/50 backdrop-blur-md rounded">
            <div className="flex justify-center relative">
              <img
                className="rounded-full w-32 h-40 object-cover sm:m-6 sm:mx-0 mx-6"
                src={
                  groupProfile || group?.group_profile || "/profile-setup.gif"
                }
                alt="dp"
              />
              <input
                accept="image/*"
                onChange={onUpload}
                type="file"
                name="group_profile"
                className="absolute sm:bottom-6 bottom-1 inset-x-1/2 file:rounded-full file:bg-primaryColor cursor-pointer text-truncate hover:file:bg-secondaryColor xl:w-44 w-20"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-semibold text-lg">
                {group?.name}
              </p>
            </div>
            <p className="text-lg text-center text-gray-600 mt-4">
              Description
            </p>
            {group?.description === undefined || null ? (
              <p className="text-gray-600 text-center mx-3 mb-4">---</p>
            ) : (
              <p className="text-gray-600 text-center mx-3 mb-4">
                {group?.description}
              </p>
            )}
            <div className="flex justify-evenly">
              <p className="text-gray-600 m-3">
                <span className="font-light">Followers:</span>{" "}
                <span className="font-semibold text-lg">
                  {group?.followers?.length}
                </span>
              </p>
              <p className="text-gray-600 m-3">
                <span className="font-light">members:</span>{" "}
                <span className="font-semibold text-lg">
                  {group?.members?.length}
                </span>
              </p>
            </div>
            <div className="flex justify-center mt-4 mb-10">
              <span className="bottom-1 text-center w-40 text-gray-600 absolute">
                since {moment(group?.created_date).format("YYYY")}
              </span>
            </div>
          </div>
          <div className="sm:col-span-8 col-span-12 sm:mt-0 mt-1 bg-lightColor/50 backdrop-blur-md rounded">
            <div className="flex justify-between m-3">
              <button
                className="text-lightColor bg-primaryColor/50 hover:bg-primaryColor/80 hover:rounded-3xl transition-all rounded py-1 px-10 cursor-pointer"
                aria-hidden="true"
                type="submit"
              >
                Save
              </button>
              <Link to="/user/group">
                <p
                  className="text-lightColor bg-primaryColor/50 hover:bg-primaryColor/80 hover:rounded-3xl transition-all rounded py-1 px-10 cursor-pointer"
                  aria-hidden="true"
                >
                  Cancel
                </p>
              </Link>
            </div>
            <div className="sm:m-8 m-4">
              <p className="sm:flex sm:m-5 sm:justify-between">
                <span className="font-light">Name: </span>{" "}
                <input
                  className="font-semibold pl-4 sm:w-96 w-full sm:mt-0 mt-2 h-12 sm:text-lg bg-accentColor/60 placeholder:text-secondaryColor text-secondaryColor rounded"
                  type="text"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={handleName}
                />
              </p>

              <p className="sm:flex sm:m-5 mt-5 sm:justify-between">
                <span className="font-light">Description:</span>{" "}
                <textarea
                  className="bg-accentColor/60 sm:w-96 mt-2 sm:mt-0 w-full text-secondaryColor h-40 placeholder:text-secondaryColor rounded pl-4 font-semibold sm:text-lg"
                  type="text"
                  name="bio"
                  placeholder="Enter your bio"
                  value={description}
                  onChange={handleDescription}
                />
              </p>

              {/* <div className="sm:m-5 m-2">
              <span className="font-light">Friends:</span>{" "}
              <div className="flex overflow-x-auto sm:h-24 w-full shadow-inner rounded bg-accentColor/60 mt-5">
                {groups.map((group) => (
                  <div className="mx-7 text-center">
                    <img
                      className="rounded-full mt-6 w-16"
                      src="/profile-setup.gif"
                      alt=""
                    />
                    <p className="mb-4 mt-2 w-11 text-xs truncate">name</p>
                  </div>
                ))}
              </div>
            </div> */}
            </div>
          </div>
        </form>
      </div>
      <img
        className="object-center h-screen object-cover w-screen blur-md z-0"
        src={group?.group_profile || "/group_default_profile.jpg"}
        alt=""
      />
    </>
  );
}
