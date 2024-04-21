import { gql, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { useState } from "react";
import { LOGIN_MUTATION } from "../GraphQL/Mutations";
import { useForm } from "../utility/hooks";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import { AuthContext } from "../context/authContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const initialState = {
    email: "",
    password: "",
  };
  const [loginError, setLoginError] = useState("");
  function loginUser() {
    handlelogin();
  }
  const { onChange, values } = useForm(loginUser, initialState);
  const navigate = useNavigate();
  // Apollo useMutation hook for the login mutation
  const [handlelogin, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    variables: values,
    onCompleted: (data) => {
      console.log(data);
      console.log("Login token:", data.login.token); // Assuming the returned string is directly accessible here
      console.log("role", data.login.role);
      login(data.login);
      // Here, you can handle storing the token, e.g., in localStorage
      // Redirect or update UI accordingly
      navigate("/");
    },
    onError: (error) => {
      setLoginError(error.message);
      console.error(error); // Handle login error here (e.g., display error message)
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    loginUser(); // Execute the login mutation
  };
  return (
    <section className="flex flex-col items-center pt-6 bg-gray-100 min-h-screen justify-center">
      <div className="w-full max-w-lg flex justify-center items-center bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="px-8 py-4 flex flex-col justify-center items-center">
          <h1 className="text-3xl justify-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
            Sign In
          </h1>
          <form className="mt-4 flex flex-col w-full" onSubmit={handleSubmit}>
            {/* Simplified for brevity */}
            <InputField
              label="Email"
              id="email"
              type="email"
              className="mt-4"
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
              className="mt-4"
              placeholder="••••••••"
              required
              onChange={onChange}
              value={values.password}
            />
            <button
              type="submit"
              className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
            </button>
            {loginError && (
              <div className="mt-2 text-red-500">{loginError}</div>
            )}
          </form>
          <h5 className="mt-6 text-white justify-center">
            not Registered yet ?{" "}
            <a href="/register" className="underline">
              Sign Up
            </a>
          </h5>
        </div>
      </div>
    </section>
  );
}
