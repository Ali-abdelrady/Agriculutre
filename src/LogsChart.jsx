import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { db, onValue, ref } from "./services/firebase";

function LogsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "sensorLogs");
    onValue(logsRef, (snapshot) => {
      const raw = snapshot.val();
      if (raw) {
        const formatted = Object.entries(raw).map(([timestamp, values]) => ({
          time: timestamp.slice(11, 16), // just HH:mm
          ...values,
        }));
        setData(formatted);
      }
    });
  }, []);

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-bold mb-4 text-center">
        Sensor Logs Analysis
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          <Line type="monotone" dataKey="moisture" stroke="#82ca9d" />
          <Line type="monotone" dataKey="humidity" stroke="#ffc658" />
          <Line type="monotone" dataKey="waterLevel" stroke="#00bcd4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LogsChart;
