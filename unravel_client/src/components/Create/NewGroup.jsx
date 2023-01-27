import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { getIdToken, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../services/firebase'
import Swal from 'sweetalert2'

const NewGroup = (props) => {
  let navigate = useNavigate()
  let location = useLocation()

  const group = {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grpName: group.grpName,
      grpDesc: group.grpDesc,
    },
  })

  const onSubmit = async (data) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user)
          console.log(token)
          await axios
            .post('http://localhost:8080/api/user/create_group', {
              headers: {
                authorization: `Bearer ${token}`,
              },
              ...data,
            })
            .then(() => {
              navigate('/')
              console.log('success')
            })
            .catch((err) => alert(err.message))
          console.log(data)
        }
      })
    } catch (err) {
      if (err.response) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data,
        })
        console.log('error', err.response.data)
      }
    }
  }
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 overflow-hidden mt-16">
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="col-span-5 justify-center items-center flex flex-col"
        >
          <div className="text-center">
            <p className="text-gray-700">Create the community</p>
            <p className="text-gray-700">Explore the world together</p>
          </div>
          <img
            className="w-96 rounded-md"
            src="/42070-travel-is-fun.gif"
            alt="bg_img"
          />
        </motion.div>
        <div className="col-span-7">
          <h1>Create new Group</h1>
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
                    errors.grpName
                      ? errors.grpName.message
                      : 'Give your group a unique name'
                  }
                  autoComplete="off"
                  {...register('grpName', {
                    required: 'Group name is required.',
                    pattern: {
                      value: /^[a-zA-Z ]+$/,
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
                  {...register('grpDesc', {
                    required: 'username is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9 ]+$/,
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

export default NewGroup
