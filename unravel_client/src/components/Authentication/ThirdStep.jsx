import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setTimerActivatorOn } from "../../features/timerAvtivator/timerActivatorSlice";
import Header from "./Header";
import LoginWave from "./Loginwave";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { auth } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { setCurrentUserInfo } from "../../features/currentUser/currentUserSlice";

const ThirdStep = (props) => {
  const dispatch = useDispatch();
  let location = useLocation();
  let navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const getCountries = () => {
      try {
        setIsLoading(true);
        const result = Country.getAllCountries();
        let allCountries = [];
        allCountries = result?.map(({ isoCode, name }) => ({
          isoCode,
          name,
        }));
        const [{ isoCode: firstCountry } = {}] = allCountries;
        setCountries(allCountries);
        setSelectedCountry(firstCountry);
        setIsLoading(false);
      } catch (error) {
        setCountries([]);
        setIsLoading(false);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const getStates = () => {
      try {
        const result = State.getStatesOfCountry(selectedCountry);
        let allStates = [];
        allStates = result?.map(({ isoCode, name }) => ({
          isoCode,
          name,
        }));
        console.log({ allStates });
        const [{ isoCode: firstState = "" } = {}] = allStates;
        setCities([]);
        setSelectedCity("");
        setStates(allStates);
        setSelectedState(firstState);
      } catch (error) {
        setStates([]);
        setCities([]);
        setSelectedCity("");
      }
    };

    getStates();
  }, [selectedCountry]);

  useEffect(() => {
    const getCities = () => {
      try {
        const result = City.getCitiesOfState(selectedCountry, selectedState);
        let allCities = [];
        allCities = result?.map(({ name }) => ({
          name,
        }));
        const [{ name: firstCity = "" } = {}] = allCities;
        setCities(allCities);
        setSelectedCity(firstCity);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState]);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const { user } = props;
      const updatedData = {
        country: countries.find(
          (country) => country.isoCode === selectedCountry
        )?.name,
        state:
          states.find((state) => state.isoCode === selectedState)?.name || "",
        city: selectedCity,
      };
      let email = user.email;
      let password = user.password;
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)
            .then(async () => {
              dispatch(setCurrentUserInfo(auth.currentUser));
              let uid = auth.currentUser.uid;
              await axios.post("http://localhost:8080/api/user", {
                uid,
                ...user,
                ...updatedData,
              });
              dispatch(setTimerActivatorOn());
              Swal.fire({
                icon: "success",
                title: "Verfiy your email address",
                showConfirmButton: false,
                timer: 1500,
              }).then(navigate("/verify_email"));
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err.message,
                showConfirmButton: false,
                timer: 1500,
              });
            });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: err.message,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data,
        });
      }
    }
  };

  return (
    <>
      <div className="sm:grid flex flex-col-reverse sm:flex-none sm:grid-cols-12">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="sm:col-span-5 justify-center items-center flex flex-col"
        >
          <img className="sm:w-36" src="/unravel.svg" alt="icon_img" />
          <p className="text-gray-700">Join the community</p>
          <p className="text-gray-700">Explore the world together</p>
          <img className="sm:w-96" src="/undraw_navigator_a479.svg" alt="bg_img" />
        </motion.div>
        <div className="col-span-7">
          <Header {...props} router={{ location }} />
          <form className="items-center flex-col flex" onSubmit={handleSubmit}>
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="justify-start">
                <div className="pb-6">
                  {isLoading && (
                    <p className="loading">Loading countries. Please wait...</p>
                  )}
                  <p className="text-gray-700 text-lg font-medium sm:mr-7">
                    Country:{" "}
                  </p>
                  <select
                    className="p-3 w-full sm:mr-56"
                    as="select"
                    name="country"
                    value={selectedCountry}
                    onChange={(event) => setSelectedCountry(event.target.value)}
                  >
                    {countries.map(({ isoCode, name }) => (
                      <option value={isoCode} key={isoCode}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pb-6">
                  <p className="text-gray-700 text-lg font-medium sm:mr-14">
                    State:
                  </p>
                  <select
                    className="p-3 w-full sm:mr-56"
                    as="select"
                    name="state"
                    value={selectedState}
                    onChange={(event) => setSelectedState(event.target.value)}
                  >
                    {states.length > 0 ? (
                      states.map(({ isoCode, name }) => (
                        <option value={isoCode} key={isoCode}>
                          {name}
                        </option>
                      ))
                    ) : (
                      <option value="" key="">
                        No state found
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <p className="text-gray-700 text-lg font-medium mb-3">
                    City:
                  </p>
                  <select
                    className="p-3 w-full sm:mr-56"
                    as="select"
                    name="city"
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                  >
                    {cities.length > 0 ? (
                      cities.map(({ name }) => (
                        <option value={name} key={name}>
                          {name}
                        </option>
                      ))
                    ) : (
                      <option value="">No cities found</option>
                    )}
                  </select>
                </div>
              </div>
              <button className="btn mt-6 btn--primary w-full" type="submit">
                Register
              </button>
            </motion.div>
          </form>
        </div>
      </div>
      <LoginWave />
    </>
  );
};

export default ThirdStep;
