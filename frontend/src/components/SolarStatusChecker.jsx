import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SolarStatusChecker = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("http://localhost:3000/status");
        // Log data for debugging
        console.log("Fetched data:", res.data);
        setData(res.data);
        toast.success("Data loaded successfully!");
      } catch (err) {
        console.error("Error fetching status:", err);
        toast.error("Failed to load solar panel status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  if (!data || !data.status) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg w-4/5 sm:w-3/4 lg:w-2/3 p-6 text-center">
          <p className="text-red-500">Failed to load data. Please try again later.</p>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg w-4/5 sm:w-3/4 lg:w-2/3 p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">🔋 Real-Time Solar Panel Status</h2>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
        <table className="min-w-full table-auto mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Actual Power (W)</th>
              <th className="px-4 py-2 text-left">Predicted Power (W)</th>
              <th className="px-4 py-2 text-left">Deviation (%)</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-t ${data?.status?.includes("Anomaly") ? "bg-red-200" : "bg-green-100"}`}>
              <td className="px-4 py-2">{data.actual_power}</td>
              <td className="px-4 py-2">{data.predicted_power}</td>
              <td className="px-4 py-2">{data.deviation}</td>
              <td className="px-4 py-2">{data.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SolarStatusChecker;
