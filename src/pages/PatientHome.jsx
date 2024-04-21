import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PATIENT_USER } from "../GraphQL/Queries";
import { ADD_MY_VITAL } from "../GraphQL/Mutations";
import { AuthContext } from "../context/authContext";
import VitalCard from "../components/VitalCard";
import { DNA, ThreeCircles } from "react-loader-spinner";

export default function PatientHome() {
  const [addToggle, setAddToggle] = useState(false);
  const [checkCovid, setCheckCovid] = useState(false);
  const [barText, setBarText] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    address: "",
    vitals: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm();

  const { user_id } = useContext(AuthContext);
  const [getProfile, { loading }] = useLazyQuery(PATIENT_USER, {
    variables: {
      id: user_id,
    },
    onCompleted: (res) => {
      console.log(res);
      setData(res.user);
    },
  });
  useEffect(() => {
    // if(!user_id){
    //     navigate("/login")
    // }
    console.log("calling useEffect!");
    getProfile();
  }, [addToggle]);

  const addVitalClicked = () => {
    setAddToggle(true);
  };

  const checkCovidClicked = () => {
    setCheckCovid(true);
  };
  const [addVital, { loading1, error1 }] = useMutation(ADD_MY_VITAL, {
    onCompleted: (res) => {
      console.log(res.enterMyVitals);
      setAddToggle(false);
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
  const checkCovidHandler = (formdata) => {
    console.log(formdata);
    setCheckCovid(false);
    Object.keys(formdata).forEach((key, value) => {
      formdata[key] = value & 1;
    });
    var payload = { input: [formdata] };
    setBarText("checking symptoms.....");
    setVitalState("loading");
    axios
      .post(
        "https://comp308-003-group9-w24-backend.onrender.com/predictCovid",
        payload
      )
      .then((result) => {
        let probability = result.data[0];
        setVitalState("loaded");
        if (probability > 0.5) {
          setVitalMessage(
            "Your Symptoms indicate you might have Covid , please get tested"
          );
        } else {
          setVitalMessage("Your symptoms are okay");
        }
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
        setVitalState("loaded");
        setVitalMessage("Some Error happened");
      });
  };
  const submitVital = (formdata) => {
    formdata.patientId = data.patientId;
    console.log(formdata);
    addVital({
      variables: {
        user_id: user_id,
        ...formdata,
      },
    });

    formdata = {
      bloodPressure: parseFloat(formdata.bloodPressure),
      temperature: parseFloat(formdata.bodyTemperature),
      heartRate: parseFloat(formdata.heartRate),
      respiratoryRate: parseFloat(formdata.respiratoryRate),
      weight: parseFloat(formdata.weight),
    };
    setBarText("checking vitals.....");
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
          {vitalState !== "none" && (
            <div className="absolute mt-3 right-10 w-1/3 z-10  bg-slate-200 h-18 rounded-md ease-in-out duration-300">
              {vitalState === "loading" && (
                <div className="loading p-4 flex items-center justify-start">
                  <span>
                    <ThreeCircles
                      visible={true}
                      height="50"
                      width="50"
                      color="#4fa94d"
                      ariaLabel="three-circles-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </span>
                  <p className="ml-3">{barText}</p>
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
          <div className="flex flex-col sm:flex-row  justify-between items-center w-full sm:w-3/6 border-2 border-slate-300 rounded-md bg-slate-100 m-auto p-5">
            <div className="group p-6 grid z-10">
              <p className="text-xl">
                Name : {data.firstName} {data.lastName}
              </p>
              <p className="text-xl">Patient ID : {data.id}</p>
              <p className="text-xl">Address : {data.address}</p>
            </div>
            <button
              className="flex items-center justify-center rounded-lg px-4 py-2 w-full sm:w-auto  bg-gray-800 text-blue-100 hover:bg-blue-600 duration-300 my-2 sm:my-0 sm:mr-4"
              onClick={() => addVitalClicked()}
            >
              Add Vital
            </button>
            <button
              className="flex items-center justify-center rounded-lg px-4 py-2 w-full sm:w-auto  bg-gray-800 text-blue-100 hover:bg-blue-600 duration-300 my-2 sm:my-0 sm:mr-4"
              onClick={() => checkCovidClicked()}
            >
              Check Covid
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
                      <small className="red">{errors.heartRate?.message}</small>
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
                        {...register("weight", { required: "field required" })}
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
                        <option value="DAILY" selected>
                          Daily
                        </option>
                        <option value="CLINICAL">Clinical</option>
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
          <div>
            {checkCovid && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                <div className="bg-white p-8 rounded-lg shadow-lg z-10 w-1/3">
                  <button
                    className="absolute top-0 right-0 m-4"
                    onClick={() => setCheckCovid(false)}
                  >
                    Close
                  </button>
                  <form
                    onSubmit={handleSubmit1((data) => checkCovidHandler(data))}
                  >
                    <h3 className="text-xl font-bold mb-4">
                      please select your symptoms
                    </h3>

                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">Do you have shortness of breath?</p>
                      <input
                        {...register1("shortnessOfBreath")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="text-red-500">
                        {errors1.shortnessOfBreath?.message}
                      </small>
                    </label>

                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">
                        Have you experienced fever or chills recently ?
                      </p>
                      <input
                        {...register1("feverOrChills")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">
                        {errors1.feverOrChills?.message}
                      </small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">Have you experienced dry cough ?</p>
                      <input
                        {...register1("dryCough")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">{errors1.dryCough?.message}</small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">
                        Have you experienced sore throught ?
                      </p>
                      <input
                        {...register1("soreThroat")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">
                        {errors1.soreThroat?.message}
                      </small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">
                        Do you have congestion or a runny nose ?
                      </p>
                      <input
                        {...register1("congestionOrRunnyNose")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">
                        {errors1.congestionOrRunnyNose?.message}
                      </small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">Have you experienced headaches?</p>
                      <input
                        {...register1("Headache")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">{errors1.Headache?.message}</small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">Have you experienced fatigue?</p>
                      <input
                        {...register1("Fatigue")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">{errors1.Fatigue?.message}</small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">
                        Have you experienced muscle or body aches?
                      </p>
                      <input
                        {...register1("muscleOrBodyAches")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">
                        {errors1.muscleOrBodyAches?.message}
                      </small>
                    </label>
                    <label className="flex justify-between items-center my-4 w-full">
                      <p className="w-2/3">
                        Have you experienced loss of taste or smell ?
                      </p>
                      <input
                        {...register1("lossOfTasteOrSmell")}
                        type="checkbox"
                        className="border rounded-md px-3 py-2 w-1/3"
                      />
                      <small className="red">
                        {errors1.lossOfTasteOrSmell?.message}
                      </small>
                    </label>

                    {/* Repeat similar labels for other fields */}

                    <div className="flex justify-between mt-24">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setCheckCovid(false)}
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
          <h1 className="text-3xl p-4">Your Vitals</h1>
          <div className="mt-auto">
            {data.vitals.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full m-auto">
                {data.vitals.map((vital, i) => (
                  <VitalCard key={i} vital={vital} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
