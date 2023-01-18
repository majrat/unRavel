import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import Header from "./Header";

const ThirdStep = (props) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Header />
      <form className="p-24 items-center flex-col flex" onSubmit={handleSubmit}>
        <div className="justify-start">
          <div className="pb-6">
            {isLoading && (
              <p className="loading">Loading countries. Please wait...</p>
            )}
            <p className="text-gray-700 text-lg font-medium mr-7">Country: </p>
            <select
              className="p-3 w-full"
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
            <p className="text-gray-700 text-lg font-medium mr-14">State:</p>
            <select
              className="p-3 w-full"
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
            <p className="text-gray-700 text-lg font-medium mb-3">City:</p>
            <select
              className="p-3 w-full"
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
    </>
  );
};

export default ThirdStep;
