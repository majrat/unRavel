import {
  Marker,
  Popup,
  TileLayer,
  MapContainer,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import { Icon } from 'leaflet'
import L from 'leaflet'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import 'leaflet-control-geocoder/dist/Control.Geocoder.js'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Country, State, City } from 'country-state-city'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import Navbar from '../Navbar/Navbar'

function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  console.log(position)
  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export default function NewLocation() {
  // const map = useMap()
  const [positionInfos, setPositionInfos] = useState({
    address: '',
  })
  const handleChange = (e) => {
    setPositionInfos({ ...positionInfos, [e.target.address]: e.target.value })
  }
  const handleSearch = (e) => {
    e.preventDefault()
    console.log(positionInfos.address)
  }
  // useEffect(() => {
  //   // creaet Geocoder nominatim
  //   var geocoder = L.Control.Geocoder.nominatim()
  //   // for every positionInfo
  //   // get the geocordinates of the address in the positionInfo
  //   // use the latitude and longitude to create a marker
  //   // and add it the map
  //   positionInfos.map((positionInfo) => {
  //     const address = positionInfo.address
  //     if (address) {
  //       geocoder.geocode(address, (resultArray) => {
  //         if (resultArray.length > 0) {
  //           const result = resultArray[0]
  //           const latlng = result.center
  //           L.marker(latlng, { Icon }).addTo(map).bindPopup(result.name)
  //           map.fitBounds(result.bbox)
  //         }
  //       })
  //     }
  //   })
  // }, [positionInfos])
  let location = useLocation()
  let navigate = useNavigate()
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    const getCountries = () => {
      try {
        setIsLoading(true)
        const result = Country.getAllCountries()
        let allCountries = []
        allCountries = result?.map(({ isoCode, name }) => ({
          isoCode,
          name,
        }))
        const [{ isoCode: firstCountry } = {}] = allCountries
        setCountries(allCountries)
        setSelectedCountry(firstCountry)
        setIsLoading(false)
      } catch (error) {
        setCountries([])
        setIsLoading(false)
      }
    }
    getCountries()
  }, [])

  useEffect(() => {
    const getStates = () => {
      try {
        const result = State.getStatesOfCountry(selectedCountry)
        let allStates = []
        allStates = result?.map(({ isoCode, name }) => ({
          isoCode,
          name,
        }))
        console.log({ allStates })
        const [{ isoCode: firstState = '' } = {}] = allStates
        setCities([])
        setSelectedCity('')
        setStates(allStates)
        setSelectedState(firstState)
      } catch (error) {
        setStates([])
        setCities([])
        setSelectedCity('')
      }
    }

    getStates()
  }, [selectedCountry])

  useEffect(() => {
    const getCities = () => {
      try {
        const result = City.getCitiesOfState(selectedCountry, selectedState)
        let allCities = []
        allCities = result?.map(({ name }) => ({
          name,
        }))
        const [{ name: firstCity = '' } = {}] = allCities
        setCities(allCities)
        setSelectedCity(firstCity)
      } catch (error) {
        setCities([])
      }
    }

    getCities()
  }, [selectedState])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const updatedData = {
        country: countries.find(
          (country) => country.isoCode === selectedCountry
        )?.name,
        state:
          states.find((state) => state.isoCode === selectedState)?.name || '',
        city: selectedCity,
      }

        // await axios
        //   .post('http://localhost:8080/api/add/location', {
        //     uid,
        //     ...user,
        //     ...updatedData,
        //   })

        .catch((err) => alert(err.message))
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data,
        })
        console.log('error', error.response.data)
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-28 mt-20">
        <h1 className="pb-10">Add New Location</h1>
        <div className="grid grid-cols-12">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ stiffness: 100 }}
            className="col-span-5 justify-center items-center flex flex-col"
          >
            <link
              rel="stylesheet"
              href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
              integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
              crossOrigin=""
            />
            <MapContainer center={[33.778175, 76.576172]} zoom={12}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </motion.div>
          <div className="col-span-7">
            <form
              className="items-center flex-col flex"
              onSubmit={handleSubmit}
            >
              <motion.div
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ stiffness: 100 }}
              >
                <div className="justify-start">
                  <div className="pb-6">
                    {isLoading && (
                      <p className="loading">
                        Loading countries. Please wait...
                      </p>
                    )}
                    <p className="text-gray-700 text-lg font-medium mr-7">
                      Country:{' '}
                    </p>
                    <select
                      className="p-3 w-full"
                      as="select"
                      name="country"
                      value={selectedCountry}
                      onChange={(event) =>
                        setSelectedCountry(event.target.value)
                      }
                    >
                      {countries.map(({ isoCode, name }) => (
                        <option value={isoCode} key={isoCode}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pb-6">
                    <p className="text-gray-700 text-lg font-medium mr-14">
                      State:
                    </p>
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
                    <p className="text-gray-700 text-lg font-medium mb-3">
                      City:
                    </p>
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
              </motion.div>
            </form>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            id="address"
            value={positionInfos.address}
            onChange={handleSearch}
          />
          <button type="submit">search</button>
        </form>
      </div>
    </>
  )
}
