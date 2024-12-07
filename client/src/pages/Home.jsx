import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import UserCard from "../components/UserCard";
import useAuthStore from "../zustandStore/authStore";
import LineGraph from "../components/LineGraph";
import Navbar from "../components/Navbar"

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACK_URL;

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/home/`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("jwtToken")}`,
        },
      });
      console.log("Response data:", response.data)
      setData(response.data);
    } catch (error) {
      console.log(`Error at Home.jsx: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      fetchData();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-primary-bg">
      <Navbar />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Graph Area */}
          <section className="flex flex-col lg:flex-row gap-4 p-6">
            <section className="lg:w-3/4 bg-secondary-bg shadow-lg rounded-lg p-6 flex-grow">
              <LineGraph data={data} />
            </section>

            {/* Right Section */}
            <section className="lg:w-1/4 bg-secondary-bg text-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Sidebar</h2>
            </section>
          </section>

          {/* User Cards Section */}
          <section className="flex w-full gap-4 p-4 overflow-x-auto bg-secondary-bg shadow-inner rounded-lg">
            {data.users.map((user, index) => {
              return <UserCard key={index} user={user.user} />;
            })}
          </section>
        </>
      )}
    </main>
  );
};

export default Home;
