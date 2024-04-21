import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PATIENT_USER } from "../GraphQL/Queries";
import { ADD_MY_VITAL } from "../GraphQL/Mutations";
import Navbar from "../components/Navbar";
import VitalCard from "../components/VitalCard";
import { DNA } from "react-loader-spinner";
const PatientDetails = () => {
  const [addToggle, setAddToggle] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    address: "",
    vitals: [],
  });
  const [tips, setTips] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { patientId } = useParams();
  console.log(patientId);
  const [getProfile, { loading, error }] = useLazyQuery(PATIENT_USER, {
    variables: {
      id: patientId,
    },
    onCompleted: (res) => {
      console.log(res);
      setData(res.user);
    },
  });

  useEffect(() => {
    getProfile();
  }, []);

  const addVitalClicked = () => {
    setAddToggle(true);
  };

  const [addVital] = useMutation(ADD_MY_VITAL, {
    onCompleted: (res) => {
      console.log(res.addVitalToUser);
      var state = { ...data };
      console.log(state.vitals);
      state.vitals.push(res.addVitalToUser);
      console.log(state.vitals);
      //setData(state);
      setData((currentData) => {
        // Creating a deep copy of the vitals array to ensure immutability
        const updatedVitals = [...currentData.vitals, res.addVitalToUser];
        // Returning a new state object with the updated vitals array
        return { ...currentData, vitals: updatedVitals };
      });
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log(graphQLErrors);
      }
      if (networkError) {
        console.log("network Error" + networkError);
      }
    },
  });

  const [vitalState, setVitalState] = useState("none");
  const [vitalMessage, setVitalMessage] = useState("");

  const submitVital = (formdata) => {
    formdata.patientId = data.patientId;
    console.log(formdata);
    addVital({
      variables: {
        user_id: patientId,
        ...formdata,
      },
    });
    setAddToggle(false);
    formdata = {
      bloodPressure: parseFloat(formdata.bloodPressure),
      temperature: parseFloat(formdata.bodyTemperature),
      heartRate: parseFloat(formdata.heartRate),
      respiratoryRate: parseFloat(formdata.respiratoryRate),
      weight: parseFloat(formdata.weight),
    };

    setVitalState("loading");

    var arr = { input: [formdata] };
    console.log(arr);
    axios
      .post("https://comp308-003-group9-w24-backend.onrender.com/predict", arr)
      .then((result) => {
        console.log(result.data[0]);
        result = result.data;
        if (result[0][0] > 0.525) {
          setVitalMessage(
            "Your Vitals show you are at risk. Please send a alert to a nurse"
          );
          setVitalState("loaded");
        } else if (result[0][2] > 0.29) {
          setVitalMessage(
            "Your Vitals shows that you needed to take better care of yourself. Maybe play a game on our site"
          );
          setVitalState("loaded");
        } else {
          setVitalState("loaded");
          setVitalMessage("Vitals are okay.");
        }
      })
      .catch((err) => {
        console.log(err);
        setVitalState("loaded");
        setVitalMessage("Some Error happened");
      });
  };

  const closeToast = () => {
    setVitalState("none");
    setVitalMessage("");
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center w-screen h-screen">
          <DNA
            visible={true}
            height="300"
            width="300"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        <div className="w-10/12 m-auto p-5">
          <div>
            {vitalState !== "none" && (
              <div className="absolute mt-3 right-10 w-1/3 z-10  bg-slate-200 h-18 rounded-md ease-in-out duration-300">
                {vitalState === "loading" && (
                  <div className="loading p-4">
                    {/* <img className="spinner" src={spinner} alt="loading..." /> */}
                    Checking Vitals....
                  </div>
                )}
                {vitalState === "loaded" && (
                  <div className="message p-4">
                    <div>
                      <button
                        onClick={() => closeToast()}
                        className="close float-right cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                    {vitalMessage}
                  </div>
                )}
              </div>
            )}
            <h1 className="text-3xl p-4">Patient Details</h1>
            <div className="flex justify-between items-center w-3/6 border-2 border-slate-300 rounded-md bg-slate-100 m-auto p-5">
              <div className="group p-6 grid z-10 ">
                <p className="text-xl">
                  Name : {data.firstName} {data.lastName}
                </p>
                <p className="text-xl">Patient ID : {data.id}</p>
                <p className="text-xl">Address : {data.address}</p>
              </div>
              <button
                className="rounded-lg px-6 py-6 w-1/6 max-h-16 bg-gray-800 text-blue-100 hover:bg-blue-600 duration-300"
                onClick={() => addVitalClicked()}
              >
                Add Vital
              </button>
            </div>
            <div>
              {addToggle && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                  <div className="bg-white p-8 rounded-lg shadow-lg z-10">
                    <button
                      className="absolute top-0 right-0 m-4"
                      onClick={() => setAddToggle(false)}
                    >
                      Close
                    </button>
                    <form onSubmit={handleSubmit((data) => submitVital(data))}>
                      <h3 className="text-xl font-bold mb-4">Add Vital</h3>

                      <label className="block mb-4">
                        Body Temperature
                        <input
                          {...register("bodyTemperature", {
                            required: "Field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        />
                        <small className="text-red-500">
                          {errors.bodyTemperature?.message}
                        </small>
                      </label>

                      <label className="block mb-4">
                        Blood Pressure
                        <input
                          {...register("bloodPressure", {
                            required: "field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        />
                        <small className="red">
                          {errors.bloodPressure?.message}
                        </small>
                      </label>

                      <label className="block mb-4">
                        Heart Rate
                        <input
                          {...register("heartRate", {
                            required: "field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        />
                        <small className="red">
                          {errors.heartRate?.message}
                        </small>
                      </label>

                      <label className="block mb-4">
                        Respiratory Rate
                        <input
                          {...register("respiratoryRate", {
                            required: "field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        />
                        <small className="red">
                          {errors.respiratoryRate?.message}
                        </small>
                      </label>

                      <label className="block mb-4">
                        Weight
                        <input
                          {...register("weight", {
                            required: "field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        />
                        <small className="red">{errors.weight?.message}</small>
                      </label>

                      <label className="block mb-4">
                        Entry Type
                        <select
                          {...register("entryType", {
                            required: "field required",
                          })}
                          type="text"
                          className="border rounded-md px-3 py-2 mt-1 w-full"
                        >
                          <option value="DAILY">Daily</option>
                          <option value="CLINICAL" selected>
                            Clinical
                          </option>
                        </select>
                        <small className="red">{errors.weight?.message}</small>
                      </label>

                      {/* Repeat similar labels for other fields */}

                      <div className="flex justify-between mt-24">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => setAddToggle(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            <h1 className="text-3xl p-4">Vitals</h1>
            <div className="m-auto">
              {data.vitals.length > 0 && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-5/6 p-4 m-auto ">
                  {data.vitals.map((vital, i) => (
                    <VitalCard key={i} vital={vital} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDetails;
