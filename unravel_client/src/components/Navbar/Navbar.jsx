import unravel_logo from "/unravel.svg";
import { auth } from "../../services/firebase";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "../Search/Search";
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { setShowSearch } from "../../features/showSearch/showSearchSlice";
import { getAllTrips } from "../../helpers/tripsHelper";
import { getAllGroups } from "../../helpers/groupHelper";

const navigation = [
  { name: "Locations", to: "/locations", current: false },
  // { name: "Favourites", to: "/", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ user }) {
  const [trips, setTrips] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [groups, setGroups] = useState([]);
  const authorized = useSelector((state) => state.authorizer.authorized);
  const dispatch = useDispatch();
  function handleSearchModal() {
    dispatch(setShowSearch());
  }
  const showSearch = useSelector((state) => state.search.showSearch);

  const logUserOut = async () => {
    await signOut(auth);
  };

  function getGroupsIds() {
    setGroupIds(groups.map((group) => group._id));
  }
  useEffect(() => {
    getAllGroups().then((data) => setGroups(data));
  }, []);
  useEffect(() => {
    getAllTrips(groupIds).then((data) => setTrips(data));
  }, [groupIds]);
  useEffect(() => {
    getGroupsIds();
  }, [groups]);

  return (
    <>
      {showSearch && trips.length !== 0 && <Search details={trips} />}
      <div className="justify-center flex">
        <Disclosure
          as="nav"
          className="bg-secondaryColor w-[96vw] top-0 shadow-xl shadow-primaryColor/30 mt-3 fixed z-50 rounded-lg"
        >
          {({ open }) => (
            <>
              <div className="px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-accentColor hover:bg-primaryColor hover:text-lightColor focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lightColor">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div
                    className={`flex flex-1 items-center justify-evenly sm:ml-0 ${
                      !authorized && "ml-14"
                    } sm:items-stretch sm:justify-start`}
                  >
                    <div className="flex flex-shrink-0">
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
                        <p
                          onClick={handleSearchModal}
                          className={classNames(
                            "text-accentColor nav-btn hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                            "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                          )}
                        >
                          Search
                        </p>
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
                              src={user?.profile_photo || "/profile-setup.gif"}
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
                  <p
                    onClick={handleSearchModal}
                    className={classNames(
                      "text-accentColor cursor-pointer hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    Search
                  </p>
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      className={classNames(
                        item.current
                          ? "bg-accentColor text-lightColor shadow-lg"
                          : "text-accentColor cursor-pointer hover:bg-accentColor hover:shadow-lg hover:text-lightColor",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      <Link to={item.to}>{item.name}</Link>
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
    </>
  );
}
