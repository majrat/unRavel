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

{
  /*     <p>Search</p>
        <p>Shop</p>
        <p>Locations</p>
        <p>Create</p>
        <p>Favourites</p> */
}

const navigation = [
  { name: "Search", href: "#", current: false },
  { name: "Shop", href: "#", current: false },
  { name: "Locations", href: "#", current: false },
  { name: "Favourites", href: "#", current: false },
  { name: "Create", href: "#", current: false },
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
              if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              }
            });
          if (req.data) {
            setUser(req.data);
          }
        }
      });
    } catch (err) {
      console.error("User might be logged out --" + err);
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
        className="bg-secondaryColor top-0 shadow-xl shadow-primaryColor/30 mt-3 w-11/12 fixed z-10 rounded-lg"
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
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src={unravel_logo}
                      alt="Your Company"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src={unravel_logo}
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-accentColor text-lightColor shadow-lg"
                              : "text-accentColor hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                {authorized ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button
                      type="button"
                      className="rounded-full bg-lightColor p-1 text-accentColor hover:text-lightColor hover:bg-accentColor focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondaryColor"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}

                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-secondaryColor text-sm focus:outline-none focus:ring-2 focus:ring-lightColor focus:ring-offset-2 focus:ring-offset-accentColor">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
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
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-primaryColor" : "",
                                  "block px-4 py-2 text-sm text-accentColor hover:text-lightColor"
                                )}
                              >
                                Settings
                              </a>
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
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-accentColor text-lightColor shadow-lg"
                        : "text-accentColor hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
