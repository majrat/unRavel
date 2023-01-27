import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../Navbar/Navbar'

const NewTrip = (props) => {
  let navigate = useNavigate()
  let location = useLocation()

  const newTrip = {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tripDate: newTrip.tripDate,
      joinBefore: newTrip.joinBefore,
      grpId: newTrip.grpId,
      locationId: newTrip.locationId,
      type: newTrip.type,
      modeOfTravel: newTrip.modeOfTravel,
      stay: newTrip.stay,
      food: newTrip.food,
    },
  })

  const onSubmit = (data) => {
    // props.updateUser(data)
    // navigate('/signup/2')
    console.log(data)
  }
  return (
    <>
    <Navbar/>
      <div className="grid grid-cols-12 overflow-hidden mt-16">
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="col-span-5 justify-center items-center flex flex-col"
          >
        <div className='text-center'>
          <p className="text-gray-700">Invite the community</p>
          <p className="text-gray-700">Explore the world together</p>
        </div>
          <img
            className="w-96 rounded-md"
            src="/42070-travel-is-fun.gif"
            alt="bg_img"
            />
        </motion.div>
        <div className="col-span-7">
          <h1>Create new Trip</h1>
          {/* <Header {...props} router={{ location }} /> */}
          <form
            className="pb-20 px-16 pt-6 justify-center flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="group relative">
                <label className="absolute form--label">Group Name</label>
                <input
                  className={`form--input ${
                    errors.grpName ? 'input-error' : ''
                  }`}
                  type="text"
                  placeholder={
                    errors.locationId
                      ? errors.newTrip.message
                      : 'select a place'
                  }
                  autoComplete="off"
                  {...register('name', {
                    required: 'Name is required.',
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: 'Name should contain only characters.',
                    },
                  })}
                />
              </div>

              <div className="mt-6">
                <p className="mb-3">Group Description</p>
                <textarea
                  className={`h-40 w-full ${
                    errors.grpDesc ? 'input-error' : ''
                  }`}
                  type="text"
                  placeholder={
                    errors.grpDesc
                      ? errors.grpDesc.message
                      : 'eg: A group focused on party trips....'
                  }
                  autoComplete="off"
                  {...register('username', {
                    required: 'username is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message:
                        'username should contain only characters and number.',
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
    </>
  )
}

export default NewTrip
