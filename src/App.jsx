import { useEffect, useState } from "react";
import { db, onValue, ref, set } from "./services/firebase";
import LogsChart from "./LogsChart";

function App() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [waterLevel, setWaterLevel] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [waterPumpStatus, setWaterPumpStatus] = useState("off");
  useEffect(() => {
    const liveValuesRef = ref(db, "liveValues");
    const unsubscribe = onValue(liveValuesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data);
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setWaterLevel(data.waterLevel);
        setSoilMoisture(data.moisture);
      }
    });

    const pumpRef = ref(db, "controls/pump/status");
    onValue(pumpRef, (snapshot) => {
      const status = snapshot.val();
      if (status) {
        setWaterPumpStatus(status.toLowerCase());
      }
    });

    return () => unsubscribe();
  }, []);

  function toggleWaterPump() {
    const newState = waterPumpStatus == "on" ? "off" : "on";
    set(ref(db, "controls/pump/status"), newState);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Smart Agriculture Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CircularProgress
          title="Temperature"
          value={temperature}
          color="green"
          sign="°C"
        />
        <CircularProgress
          title="Humidity"
          value={humidity}
          color="green"
          sign="°H"
        />
        <CircularProgress title="Water Level" value={waterLevel} color="blue" />
        <CircularProgress
          title="Soil Moisture"
          value={soilMoisture}
          color="yellow"
        />
      </div>
      <button
        onClick={toggleWaterPump}
        className={`mt-6 px-6 py-2 text-white font-bold rounded-lg transition-all ${
          waterPumpStatus === "on" ? "bg-red-700" : "bg-green-600"
        }`}
      >
        {waterPumpStatus === "on"
          ? "Turn OFF Water Pump"
          : "Turn ON Water Pump"}
      </button>
      <LogsChart />
    </div>
  );
}
function CircularProgress({ title, value, color = "blue", sign = "%" }) {
  const strokeColorClass =
    {
      blue: "stroke-blue-500",
      red: "stroke-red-500",
      green: "stroke-green-500",
      yellow: "stroke-yellow-500",
    }[color] || "stroke-blue-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {value} {sign}
        </div>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-300 stroke-black"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeDasharray="250"
            strokeDashoffset="20"
            strokeLinecap="round"
            transform="rotate(90 50 50)"
          />
          <circle
            className={strokeColorClass}
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeDasharray="250"
            strokeDashoffset={`${250 - (250 * value) / 100}`}
            strokeLinecap="round"
            transform="rotate(90 50 50)"
          />
        </svg>
      </div>
      <p className="mt-2 text-lg font-semibold">{title}</p>
    </div>
  );
}
export default App;
