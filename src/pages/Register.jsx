import React, { useContext, useState } from "react";
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import { REGISTER_USER_MUTATION } from "../GraphQL/Mutations";
import { DNA } from "react-loader-spinner";
function Register(props) {
  //   const context = useContext(AuthContext);
  let navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  // Initialization for useForm including all fields
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    dob: "",
    phone: "",
    address: "",
  };

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  // Note: Removed unused context variable since we're not logging in directly after registration
  const [signup, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    update(proxy, result) {
      // After successful registration, redirect the user to the login page
      navigate("/login");
    },
    onError(err) {
      // Handle errors, such as displaying them to the user
      setErrors(err.graphQLErrors);
    },
    variables: values,
  });

  function registerUser() {
    signup();
  }

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <section className="flex flex-col items-center justify-center pt-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="px-2 py-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
            Create an account
          </h1>
          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
            onSubmit={handleSubmit}
          >
            {/* Simplified for brevity */}
            <InputField
              label="First Name"
              id="firstName"
              type="text"
              required
              placeholder="Emelia"
              onChange={onChange}
              value={values.firstName}
            />
            <InputField
              label="Last Name"
              id="lastName"
              type="text"
              required
              placeholder="Smith"
              onChange={onChange}
              value={values.lastName}
            />
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="emelia@example.com"
              required
              onChange={onChange}
              value={values.email}
            />
            {/* Password */}
            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={onChange}
              value={values.password}
            />
            {/* Role - Since this is a select, consider customizing InputField for select or creating a new component */}
            <div className="md:col-span-2">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                onChange={onChange}
                value={values.role}
              >
                <option value="">Select your role</option>
                <option value="Patient">Patient</option>
                <option value="Nurse">Nurse</option>
              </select>
            </div>

            {/* Date of Birth */}
            <InputField
              label="Date of Birth"
              id="dob"
              type="date"
              required
              onChange={onChange}
              value={values.dob}
            />

            {/* Phone */}
            <InputField
              label="Phone"
              id="phone"
              type="tel"
              placeholder="+1234567890"
              required
              onChange={onChange}
              value={values.phone}
            />

            {/* Address */}
            <div className="md:col-span-2">
              <InputField
                label="Address"
                id="address"
                type="text"
                placeholder="1234 Main St"
                required
                onChange={onChange}
                value={values.address}
              />{" "}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create an account
              </button>
            </div>
          </form>
          <h5 className="mt-6 text-white justify-center">
            Already Registered?{" "}
            <a href="/login" className="underline">
              Sign In
            </a>
          </h5>
        </div>
      </div>
    </section>
  );
}
export default Register;
