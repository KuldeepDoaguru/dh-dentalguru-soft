import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";

const MostTakenTreat = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  console.log(user.token);
  const [appointmentList, setAppointmentList] = useState([]);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
        height: 1000,
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getAppointList = async () => {
    // console.log(user.branch_name);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getTreatmentDetails/${branch.name}`,
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

  useEffect(() => {
    getAppointList();
  }, [branch.name]);

  console.log(appointmentList);

  useEffect(() => {
    const getDate = new Date();
    const year = getDate.getFullYear();
    const month = String(getDate.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${year}-${month}`;

    console.log(
      appointmentList[1]?.appointment_dateTime?.split("T")[0]?.slice(0, 7)
    );
    console.log(formattedDate);

    // const formatByBranch = appointmentList?.filter(
    //   (item) => item.branch_name === user.branch_name // Additional filter by some other property
    // );

    // console.log(formatByBranch);
    const filterForMonthlyAppointments = appointmentList?.filter((item) =>
      item.appointment_dateTime?.split("T")[0]?.includes(formattedDate)
    );

    console.log(filterForMonthlyAppointments);

    if (filterForMonthlyAppointments.length > 0) {
      const treatments = filterForMonthlyAppointments.map((item) =>
        item.treatment_name ? item.treatment_name : item.treatment_provided
      );
      const series = treatments.reduce((acc, val) => acc.concat(val), []);
      const uniqueTreatments = [...new Set(series)];
      console.log(uniqueTreatments);
      const treatmentCounts = uniqueTreatments.map(
        (treatment) => series.filter((t) => t === treatment).length
      );

      console.log(treatmentCounts);

      setChartData({
        series: treatmentCounts,
        options: {
          chart: {
            width: 380,
            type: "pie",
          },
          labels: uniqueTreatments,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      });
    }
  }, [appointmentList, user.branch_name]); // Added branch as a dependency
  console.log(chartData.options);
  console.log(chartData.series);
  return (
    <Container>
      <div className="d-flex justify-content-center align-items-center pt-5">
        {loading ? (
          <Lottie options={defaultOptions} height={300} width={400}></Lottie>
        ) : (
          <>
            <div id="chart">
              {appointmentList.length > 0 ? (
                <>
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="pie"
                    width={480}
                  />
                </>
              ) : (
                <>
                  {/* <p>No Data</p> */}
                  <ReactApexChart
                    options={{
                      // Define options for the blank chart
                      chart: {
                        width: 380,
                        type: "pie",
                        foreColor: "#000000",
                      },
                    }}
                    series={[0]}
                    type="pie"
                    width={380}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default MostTakenTreat;
const Container = styled.div``;
