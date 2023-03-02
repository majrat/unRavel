import axios from "axios";
import config from "../../../utils/constants";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getCurrentGroup } from "../../../helpers/groupHelper";
import { auth } from "../../../services/firebase";

const Group = ({ user }) => {
  const [group, setGroup] = useState("");
  const [members, setMembers] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [userFollowingGroups, setUserFollowingGroups] = useState([]);

  const location = useLocation();
  let link_group_id;
  if (location?.state !== null) {
    link_group_id = location?.state;
  }

  const followGroup = async (selectedGroupId) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch(`${config.VITE_SERVER_API}/follow/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              selectedGroupId,
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response?.data,
        });
      }
    }
  };

  const unFollowGroup = async (selectedGroupId) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .delete(`${config.VITE_SERVER_API}/follow/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              data: { groupId: selectedGroupId },
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response?.data,
        });
      }
    }
  };

  const joinGroup = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch(`${config.VITE_SERVER_API}/join/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              link_group_id,
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response.data,
        });
      }
    }
  };

  function getUserFollowingGroups() {
    setUserFollowingGroups(user?.connections?.following?.groups);
  }

  useEffect(() => {
    getCurrentGroup(link_group_id).then((data) => {
      setGroup(data);
      setMembers(data?.members);
    });
  }, [reRender, link_group_id]);

  useEffect(() => {
    getUserFollowingGroups();
  }, [user, reRender]);

  return (
    <>
      <div className="absolute z-10 mt-24 w-full">
        <div className="grid h-96 grid-cols-12 sm:mx-16 mx-5 mt-1">
          <div className="sm:hidden sm:mt-0 mt-1 col-span-12 bg-lightColor/50 backdrop-blur-md rounded">
            <div className="flex justify-between px-4">
              {userFollowingGroups?.find(
                (followingGroup) => followingGroup === group?._id
              ) === group?._id ? (
                <div
                  onClick={() => unFollowGroup(group?._id)}
                  className="w-28 h-8 my-4 text-center cursor-pointer bg-lightColor/60 rounded"
                >
                  <span>following</span>
                  <span className="m-2 ">
                    {group?.followers?.length ? group?.followers.length : 0}
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => followGroup(group?._id)}
                  className="w-28 h-8 my-4 text-center cursor-pointer bg-primaryColor/60 rounded"
                >
                  <span>+ follow</span>
                  <span className="m-2">
                    {group?.followers?.length ? group?.followers?.length : 0}
                  </span>
                </div>
              )}
              <div
                onClick={() => joinGroup()}
                className="w-28 h-8 my-4 text-center cursor-pointer bg-accentColor/60 rounded"
              >
                <span>Join</span>
                <span className="m-2">
                  {group?.members?.length ? group?.members?.length : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 pt-6 sm:pt-0 col-span-12 bg-secondaryColor/50 backdrop-blur-md rounded">
            <div className="flex justify-center">
              <img
                className="rounded-full w-32 h-36 object-cover sm:m-6 sm:mx-0 mx-6"
                src={group?.group_profile || "/profile-setup.gif"}
                alt="user_profile"
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
              <span className="text-center w-40 text-gray-600">
                since {moment(group?.created_date).format("YYYY")}
              </span>
            </div>
            <div className="sm:hidden rounded-md bg-secondaryColor/60 backdrop-blur-xl my-4 ">
              <p className="mt-8 text-center text-xl font-semibold text-gray-600">
                Members
              </p>
              <div className="px-10 mx-3 rounded-md py-2 mb-6 shadow-xl text-gray-600 bg-lightColor/20 h-64 overflow-y-scroll">
                {members.map((member, i) => (
                  <div key={member?._id} className="flex py-1">
                    <p className="mt-1 mr-9">{i + 1}.</p>
                    <img
                      src={member?.profile_photo || "/profile-setup.gif"}
                      alt="dp"
                      className="rounded-full mr-6 w-9 h-9"
                    />
                    <p className="mt-1 mr-9 truncate">
                      {member?.first_name + " " + member?.last_name}
                    </p>
                    {group?.group_admin === member?._id ? (
                      <p className="mt-1 ml-auto">Admin</p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sm:col-span-8 hidden sm:block sm:mt-0 mt-1 col-span-12 bg-lightColor/50 backdrop-blur-md rounded">
            <div className="flex justify-between px-4">
              {userFollowingGroups?.find(
                (followingGroup) => followingGroup === group?._id
              ) === group?._id ? (
                <div
                  onClick={() => unFollowGroup(group?._id)}
                  className="w-28 h-8 my-4 text-center cursor-pointer bg-lightColor/60 rounded"
                >
                  <span>following</span>
                  <span className="m-2 ">
                    {group?.followers?.length ? group?.followers.length : 0}
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => followGroup(group?._id)}
                  className="w-28 h-8 my-4 text-center cursor-pointer bg-primaryColor/60 rounded"
                >
                  <span>+ follow</span>
                  <span className="m-2">
                    {group?.followers?.length ? group?.followers?.length : 0}
                  </span>
                </div>
              )}
              <div
                onClick={() => joinGroup(group?._id)}
                className="w-28 h-8 my-4 text-center cursor-pointer bg-accentColor/60 rounded"
              >
                <span>Join</span>
                <span className="m-2">
                  {group?.members?.length ? group?.members?.length : 0}
                </span>
              </div>
            </div>
            <div className="rounded-md bg-secondaryColor/60 backdrop-blur-xl my-4 ">
              <p className="mt-8 text-center text-xl font-semibold text-gray-600">
                Members
              </p>
              <div className="px-10 mx-3 rounded-md py-2 mb-6 shadow-xl text-gray-600 bg-lightColor/20 h-64 overflow-y-scroll">
                {members.map((member, i) => (
                  <div key={member?._id} className="flex py-1">
                    <p className="mt-1 mr-9">{i + 1}.</p>
                    <img
                      src={member?.profile_photo || "/profile-setup.gif"}
                      alt="dp"
                      className="rounded-full mr-6 w-9 h-9"
                    />
                    <p className="mt-1 mr-9 truncate">
                      {member?.first_name + " " + member?.last_name}
                    </p>
                    {group?.group_admin === member?._id ? (
                      <p className="mt-1 ml-auto">Admin</p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        className="object-center h-screen object-cover w-screen blur-md z-0"
        src={group?.group_profile || "/group_default_profile.jpg"}
        alt=""
      />
    </>
  );
};

export default Group;
