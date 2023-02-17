import unravel_logo from "/unravel.svg";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const navigation = [
  { name: "Search", to: "/", current: false },
  { name: "Locations", to: "/locations", current: false },
  { name: "Favourites", to: "/", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const authorized = useSelector((state) => state.authorizer.authorized);
  const [user, setUser] = useState("");

  const getUser = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          const req = await axios
            .get("http://localhost:8080/api/user", {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .catch(function (error) {
              if (error?.response) {
                Swal.fire({
                  icon: "error",
                  title: error?.response.data,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            });
          if (req?.data) {
            setUser(req?.data);
          }
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
  };

  const logUserOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="justify-center flex">
      <Disclosure
        as="nav"
        className="bg-secondaryColor top-0 shadow-xl shadow-primaryColor/30 mt-3 w-11/12 fixed z-50 rounded-lg"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-accentColor hover:bg-primaryColor hover:text-lightColor focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lightColor">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img
                        className="block h-8 w-auto lg:hidden hover:shadow-lg rounded-lg transition-all hover:shadow-primaryColor"
                        src={unravel_logo}
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block hover:shadow-lg rounded-lg transition-all hover:shadow-primaryColor"
                        src={unravel_logo}
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      <a
                        href="https://travel.cyclic.app/"
                        className={classNames(
                          "text-accentColor nav-btn hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                      >
                        Shop
                      </a>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            "text-accentColor nav-btn hover:bg-accentColor hover:text-lightColor",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            className="text-accentColor nav-btn hover:bg-accentColor hover:shadow-lg hover:text-lightColor
                            px-3 py-2 rounded-md text-sm font-medium"
                          >
                            <span>Create</span>
                          </Menu.Button>
                        </div>
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-lightColor py-1 shadow-lg ring-1 ring-primaryColor ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={authorized ? "/add/location" : "/signin"}
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor cursor-pointer hover:text-lightColor"
                                )}
                              >
                                New Location
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={authorized ? "/create/group" : "/signin"}
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                New Group
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={authorized ? "/create/trip" : "/signin"}
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                New Trip
                              </Link>
                            )}
                          </Menu.Item>
                          {/* <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={authorized ? '/create/blog' : '/signin'}
                                className={classNames(
                                  active ? 'bg-primaryColor' : '',
                                  'block px-4 py-2 text-sm text-accentColor cursor-pointer hover:text-lightColor'
                                )}
                              >
                                New Blog
                              </Link>
                            )}
                          </Menu.Item> */}
                        </Menu.Items>
                      </Menu>
                    </div>
                  </div>
                </div>
                {authorized ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/*TODO: <button
                      type="button"
                      className="rounded-full bg-lightColor p-1 text-accentColor hover:text-lightColor hover:bg-accentColor focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondaryColor"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                    {/* Profile dropdown */}

                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-secondaryColor text-sm focus:outline-none focus:ring-2 focus:ring-lightColor focus:ring-offset-2 focus:ring-offset-accentColor">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 object-cover rounded-full"
                            src={user?.profile_photo}
                            alt="dp"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-lightColor py-1 shadow-lg ring-1 ring-primaryColor ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <span
                              href="#"
                              className={classNames(
                                "block px-4 py-2 text-lg text-accentColor cursor-default"
                              )}
                            >
                              Hi, {user.first_name}
                            </span>
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                My Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/user/group"
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                My Groups
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/user/trips"
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                My Trips
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={logUserOut}
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor cursor-pointer hover:text-lightColor"
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    className="text-accentColor hover:bg-accentColor hover:shadow-lg hover:text-lightColor px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                <a
                  href="https://travel.cyclic.app/"
                  className={classNames(
                    "text-accentColor cursor-pointer hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  Shop
                </a>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    to={item.to}
                    className={classNames(
                      item.current
                        ? "bg-accentColor text-lightColor shadow-lg"
                        : "text-accentColor cursor-pointer hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button
                      className="text-accentColor nav-btn hover:bg-accentColor hover:shadow-lg hover:text-lightColor
                            px-3 py-2 rounded-md text-base font-medium"
                    >
                      <span>Create</span>
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-lightColor py-1 shadow-lg ring-1 ring-primaryColor ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={authorized ? "/create/group" : "/signin"}
                          className={classNames(
                            active ? "bg-primaryColor" : "",
                            "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                          )}
                        >
                          New Group
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={authorized ? "/create/trip" : "/signin"}
                          className={classNames(
                            active ? "bg-primaryColor" : "",
                            "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                          )}
                        >
                          New Trip
                        </Link>
                      )}
                    </Menu.Item>
                    {/* <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={authorized ? '/create/blog' : '/signin'}
                                className={classNames(
                                  active ? 'bg-primaryColor' : '',
                                  'block px-4 py-2 text-sm text-accentColor cursor-pointer hover:text-lightColor'
                                )}
                              >
                                New Blog
                              </Link>
                            )}
                          </Menu.Item> */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={authorized ? "/add/location" : "/signin"}
                          className={classNames(
                            active ? "bg-primaryColor" : "",
                            "block px-4 py-2 text-sm text-accentColor cursor-pointer hover:text-lightColor"
                          )}
                        >
                          New Location
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
