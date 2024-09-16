import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaMoneyBill } from "react-icons/fa";
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/user/userSlice";
import moment from "moment";

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [testCounts, setTestCounts] = useState({
    today: 0,
    yesterday: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });

  const currentUser = useSelector((state) => state.auth.user);
  const token = currentUser?.token;

  useEffect(() => {
    const getTestCounts = async () => {
      try {
        const response = await axios.get(
          "https://dentalhouse.lab.vimubds5.a2hosted.com/api/lab/get-patient-details",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data.result;
          const doneTests = data.filter((item) => item.test_status === "done");

          const todayCount = doneTests.filter((item) =>
            isToday(item.created_date)
          ).length;
          const yesterdayCount = doneTests.filter((item) =>
            isYesterday(item.created_date)
          ).length;
          const weeklyCount = doneTests.filter((item) =>
            isWithinLastNDays(item.created_date, 7)
          ).length;
          const monthlyCount = doneTests.filter((item) =>
            isWithinThisMonth(item.created_date)
          ).length;
          const yearlyCount = doneTests.filter((item) =>
            isWithinThisYear(item.created_date)
          ).length;

          setTestCounts({
            today: todayCount,
            yesterday: yesterdayCount,
            weekly: weeklyCount,
            monthly: monthlyCount,
            yearly: yearlyCount,
          });
        } else {
          console.error("Failed to fetch test counts");
        }
      } catch (error) {
        console.error("Error fetching test counts:", error);
        if (error?.response?.status === 401) {
          navigate("/");
          dispatch(logoutUser());
        }
      }
    };

    getTestCounts();
    const interval = setInterval(() => {
      getTestCounts();
    }, 3000);

    return () => clearInterval(interval);
  }, [token, navigate, dispatch]);

  // const isToday = (date) =>
  //   new Date(date).toDateString() === new Date().toDateString();

  // const isYesterday = (date) =>
  //   new Date(date).toDateString() ===
  //   new Date(Date.now() - 86400000).toDateString();

  //   const isWithinLastNDays = (date, days) => {
  //     const targetDate = new Date(date);
  //     const now = new Date();
  //     return targetDate >= new Date(now.setDate(now.getDate() - days));
  //   };

  // const isWithinThisMonth = (date) => {
  //   const now = new Date();
  //   const targetDate = new Date(date);
  //   return (
  //     targetDate.getFullYear() === now.getFullYear() &&
  //     targetDate.getMonth() === now.getMonth()
  //   );
  // };

  // const isWithinThisYear = (date) => {
  //   const now = new Date();
  //   const targetDate = new Date(date);
  //   return targetDate.getFullYear() === now.getFullYear();
  // };

  const isToday = (date) =>
    moment(date, "DD-MM-YYYY HH:mm:ss").isSame(moment(), "day");

  const isYesterday = (date) =>
    moment(date, "DD-MM-YYYY HH:mm:ss").isSame(
      moment().subtract(1, "days"),
      "day"
    );

  const isWithinLastNDays = (date, days) =>
    moment(date, "DD-MM-YYYY HH:mm:ss").isAfter(
      moment().subtract(days, "days")
    );

  const isWithinThisMonth = (date) =>
    moment(date, "DD-MM-YYYY HH:mm:ss").isSame(moment(), "month");

  const isWithinThisYear = (date) =>
    moment(date, "DD-MM-YYYY HH:mm:ss").isSame(moment(), "year");

  return (
    <CardContainer>
      <div className="d-flex justify-content-around mt-5">
        <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
          <div className="card">
            <div className="card-body d-flex justify-content-center flex-column mb-3">
              <div className="text-light fs-1">
                <FaMoneyBill />
              </div>
              <div className="cardtext">
                <h5 className="card-title text-light">Today Test</h5>
                <p className="card-text text-light fw-semibold">
                  {testCounts.today}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
          <div className="card">
            <div className="card-body d-flex justify-content-center flex-column mb-3">
              <div className="text-light fs-1">
                <SiMoneygram />
              </div>
              <div className="cardtext">
                <h5 className="card-title text-light">Yesterday Test</h5>
                <p className="card-text text-light fw-semibold">
                  {testCounts.yesterday}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
          <div className="card">
            <div className="card-body d-flex justify-content-center flex-column mb-3">
              <div className="text-light fs-1">
                <MdOutlineNextWeek />
              </div>
              <div className="cardtext">
                <h5 className="card-title text-light">Weekly Test</h5>
                <p className="card-text text-light fw-semibold">
                  {testCounts.weekly}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
          <div className="card">
            <div className="card-body d-flex justify-content-center flex-column mb-3">
              <div className="text-light fs-1">
                <GiMoneyStack />
              </div>
              <div className="cardtext">
                <h5 className="card-title text-light">Monthly Test</h5>
                <p className="card-text text-light fw-semibold">
                  {testCounts.monthly}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
          <div className="card">
            <div className="card-body d-flex justify-content-center flex-column mb-3">
              <div className="text-light fs-1">
                <GiTakeMyMoney />
              </div>
              <div className="cardtext">
                <h5 className="card-title text-light">Yearly Test</h5>
                <p className="card-text text-light fw-semibold">
                  {testCounts.yearly}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  .card {
    background: #213555;
    height: 9.5rem;
    border: none;
    box-shadow: 1px 2px 8px black;
    &:hover {
      background: #264679;
    }
  }

  .icon {
    font-size: 40px;
    color: white;
  }
  .card-body {
    text-align: center;
    padding: 5px;
  }
  .card-link {
    text-decoration: none;
    font-size: small;
  }

  .cardtext {
    h5 {
      color: white;
    }
    p {
      color: white;
    }
  }
`;
