import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="intro">{label}</p>
        <p className="label">{`${payload[0].value}`}</p>
        <p className="desc"></p>
      </div>
    );
  }

  return null;
};

const NewRegPatient = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [appointmentList, setAppointmentList] = useState([]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const getAppointList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getAppointmentData/${branch.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        setAppointmentList(response.data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getAppointList();
  }, [branch.name]);

  // console.log(appointmentList);

  const getDate = new Date();
  const year = getDate.getFullYear();
  const month = String(getDate.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate(); // Last day of the current month
  const formattedDate = `${year}-${month}`;

  // Group appointments by date and count appointments for each day
  const dailyAppointments = appointmentList?.reduce((acc, appointment) => {
    // console.log(acc);

    const date = appointment.created_at?.split(" ")[0];
    acc[date] = acc[date] ? acc[date] + 1 : 1;
    return acc;
  }, {});

  console.log(dailyAppointments);
  // Create an array containing data for all days of the month
  const data = Array.from({ length: lastDay }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    const date = `${formattedDate}-${day}`;
    // console.log(date);
    // console.log(dailyAppointments[date]);
    return {
      date,
      Patients: dailyAppointments[date] || 0,
    };
  });

  // console.log(data);

  return (
    <>
      <Container>
        <div className="container-fluid mt-4" id="main">
          {loading ? (
            <Lottie options={defaultOptions} height={300} width={400}></Lottie>
          ) : (
            <>
              <BarChart
                width={380}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 0,
                    transform: "translate(-10,0)",
                    dy: 5,
                    fill: "#666",
                    fontWeight: "bold",
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Patients" fill="#40407a" />
              </BarChart>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default NewRegPatient;
const Container = styled.div`
  #main {
    background-color: #f8a5c2;
    width: 100%;
    border-radius: 5px;
    padding: 2rem;
    box-shadow: 0px 2px 18px #bdbaba;
    display: flex;
    justify-content: center;
  }
`;
