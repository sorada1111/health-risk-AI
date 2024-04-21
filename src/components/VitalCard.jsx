const VitalCard = ({ vital }) => (
    <div className="bg-slate-100 m-6 py-6 px-12 rounded-xl flex flex-col justify-start shadow-lg border-2 border-slate-50">
       
            <p className="text-lg font-semibold text-gray-900 mb-2">Date: {vital.createdAt}</p>
            <p className="text-base text-gray-800">Blood Pressure: {vital.bloodPressure}</p>
            <p className="text-base text-gray-800">Body Temperature: {vital.bodyTemperature}</p>
            <p className="text-base text-gray-800">Heart Rate: {vital.heartRate}</p>
            <p className="text-base text-gray-800">Respiratory Rate: {vital.respiratoryRate}</p>
            <p className="text-base text-gray-800">Weight: {vital.weight}</p>
    </div>
);

export default VitalCard;