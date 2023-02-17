import { TileLayer, MapContainer } from "react-leaflet";

import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/constants";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function NewLocation() {
  const [positionInfos, setPositionInfos] = useState({
    address: "",
    spot: "",
  });
  const handleChange = (e) => {
    setPositionInfos({ ...positionInfos, [e.target.name]: e.target.value });
    console.log(positionInfos);
  };

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
    const getCities = async () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedData = {
        spot: positionInfos.spot,
        country: countries.find(
          (country) => country.isoCode === selectedCountry
        )?.name,
        state:
          states.find((state) => state.isoCode === selectedState)?.name || "",
        city: selectedCity,
      };
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .post(`${config.VITE_SERVER_API}/add_location`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              ...updatedData,
            })
            .then((res) => {
              navigate("/");
              Swal.fire({
                icon: "success",
                title: res.data.success,
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err.message,
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
          title: err.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ x: "100vw" }}
        animate={{ x: 0 }}
        transition={{ stiffness: 100 }}
        className="absolute z-10 h-full w-full px-10 sm:px-32 pt-20 bg-accentColor/50"
      >
        <h1 className="">Add New Location</h1>
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <div className="pb-6">
              <div>
                <label
                  className="text-gray-800 font-bold text-lg underline"
                  htmlFor="email"
                >
                  Spot
                </label>
              </div>
              <div>
                <input
                  className="form--input bg-secondaryColor"
                  type="text"
                  name="spot"
                  value={positionInfos.spot}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="pb-6">
              {isLoading && (
                <p className="loading">Loading countries. Please wait...</p>
              )}
              <p className="text-gray-800 font-bold text-lg underline">
                Country:{" "}
              </p>
              <select
                className="p-3 w-full bg-secondaryColor rounded-md"
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
              <p className="text-gray-800 font-bold text-lg underline">
                State:
              </p>
              <select
                className="p-3 w-full bg-secondaryColor rounded-md"
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
              <p className="text-gray-800 font-bold text-lg underline">City:</p>
              <select
                className="p-3 w-full bg-secondaryColor rounded-md"
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
          <button className="btn mt-6 btn--primary" type="submit">
            Register
          </button>
        </form>
      </motion.div>
      <div>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
        <MapContainer center={[33.778175, 76.576172]} zoom={10}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </>
  );
}
