import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { NURSE_USER, GET_PATIENT_LIST } from "../GraphQL/Queries";
import { DNA } from "react-loader-spinner";
const NurseHome = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    id: "",
    address: "",
    role: "",
  });
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { user_id, user } = useContext(AuthContext);
  const [getProfile, { loading, error }] = useLazyQuery(NURSE_USER, {
    variables: {
      id: user_id,
    },
    onCompleted: (res) => {
      console.log(res);
      setProfile(res.user);
    },
  });
  const [getPatients] = useLazyQuery(GET_PATIENT_LIST, {
    onCompleted: (res) => {
      console.log(res);
      setPatients(res.patients);
    },
  });
  useEffect(() => {
    if (!user_id) {
      navigate("/login");
    }
    getProfile();
    getPatients();
  }, []);
  return (
    <div>
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
        <div className="w-10/12 m-auto">
          <h1 className="text-3xl p-4">Nurse Details</h1>
          <div className="flex justify-between items-center w-3/6 border-2 border-slate-300 rounded-md bg-slate-100 m-auto p-5">
            <div className="group p-6 grid z-10">
              <p className="xl">
                Name : {profile.firstName} {profile.lastName}
              </p>
              <p className="xl">Nurse ID : {profile.id}</p>
              <p className="xl">Role: {profile.role}</p>
              <p className="xl">Address : {profile.address}</p>
            </div>
          </div>
          <h1 className="text-3xl p-4">Patients List</h1>
          <div className="user-courses mt-5 ml-5 flex flex-col justify-center items-center">
            {patients.length == 0 ? (
              <h4>No patients found</h4>
            ) : (
              <div className="cards grid grid-cols-4 w-5/6 m-auto">
                {patients.map((patient, i) => (
                  <div
                    key={i}
                    class=" bg-white rounded-3xl shadow-xl mt-5 ml-5"
                  >
                    <div class="flex rounded-3xl shadow-sm bg-slate-100  flex-col">
                      <div class="group p-6 grid z-10">
                        <p className="xl">
                          Name: {patient.firstName} {patient.lastName}
                        </p>
                        <p className="xl">Phone: {patient.phone}</p>
                        <p className="xl">Address: {patient.address}</p>
                        <p className="xl">Email: {patient.email}</p>
                        <button
                          className="rounded-lg px-4 py-2 mt-5 ml-5 max-h-12 bg-gray-800 text-blue-100 hover:bg-blue-600 duration-300"
                          onClick={() => {
                            navigate(`patient/${patient.id}`);
                          }}
                        >
                          Check Vitals
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseHome;
