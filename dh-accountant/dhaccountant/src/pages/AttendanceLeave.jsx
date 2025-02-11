import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import cogoToast from "cogo-toast";
import Header from "../components/Header";
import Sider from "../components/Sider";
import BranchDetails from "../components/BranchDetails";
// import ApplyLeave from "../components/btModal/ApplyLeave";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import MarkAttendance from "./MarkAttendance";
import ApplyLeave from "./ApplyLeave";

const AttendanceLeave = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = user.token;
  console.log(token);
  const { refreshTable } = useSelector((state) => state.user);
  console.log(
    `User Name: ${user.name}, User ID: ${user.id}, branch: ${user.branch}`
  );
  console.log("User State:", user);
  const branch = user.branch;
  const employeeName = user.name;
  const employeeId = user.id;
  console.log(branch, employeeId);
  const [attendRepo, setAttendRepo] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leavesData, setLeaveData] = useState([]);
  const [Attendance, setAttendance] = useState([]);

  const getAttendance = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getAttendancebyempId/${branch}/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendance(response?.data?.data);
      console.log(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAttendance();
  }, [refreshTable]);

  const getLeaves = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-leaves/${branch}/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveData(response?.data?.data);
      console.log(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaves();
  }, [refreshTable]);

  const generateDaysInMonth = (fromDate, toDate) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      return dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    });
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);

    const formattedDate = currentDate.toISOString().split("T")[0];
    setFormattedDate(formattedDate);

    if (fromDate && toDate) {
      const filteredDaysArray = daysArray.filter((day) => {
        const date = new Date(year, month, parseInt(day, 10));
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
      setDaysInMonth(filteredDaysArray);
    } else {
      setDaysInMonth(daysArray);
    }

    setMonthName(monthName);
  };

  useEffect(() => {
    generateDaysInMonth(fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    generateDaysInMonth();
  }, [currentDate]);

  console.log(attendRepo);

  console.log(formattedDate.slice(0, 7));
  console.log(attendRepo[0]?.date);
  console.log(`${formattedDate.slice(0, 7)}-${daysInMonth[0]}`);
  const filter = daysInMonth.map((day) => {
    return attendRepo.find(
      (item) =>
        item.date.split("T")[0] === `${formattedDate.slice(0, 7)}-${day}`
    );
  });

  console.log(filter[5]?.login);
  console.log(attendRepo[0]?.date.split("T")[0] >= fromDate);
  console.log(toDate);
  const fitlerByDuration = attendRepo?.filter((item) => {
    return (
      item.date.split("T")[0] >= fromDate && item.date.split("T")[0] <= toDate
    );
  });

  console.log(fitlerByDuration);

  const goBack = (event) => {
    event.preventDefault(); // Prevent default action to avoid page refresh
    navigate(-1); // This goes back to the previous page
  };

  // Helper function to format a single date string in the desired format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <Container>
        <div className="header">
          <Header />
        </div>
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-1 p-0" id="hd">
                <Sider />
              </div>
              <div
                className="col-xxl-11 col-xl-11 col-lg-11 col-md-10 col-sm-10"
                id="set"
              >
                <div className="container-fluidr">
                  <div className="row flex-nowrap ">
                    <div>
                      <BranchDetails />
                    </div>
                  </div>
                </div>

                <div className="container-fluid mt-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-3">
                      {/* <button className="btn btn-success" onClick={goBack}>
                        <IoMdArrowRoundBack /> Back
                      </button> */}
                    </div>
                    <div className="col-9">
                      <MarkAttendance />
                    </div>
                  </div>

                  <div className="container-fluid">
                    <div className="row mt-3">
                      <div className="col-12 col-lg-11 col-md-11 mx-lg-4">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary navhead">
                          <div class="container d-flex justify-content-center">
                            <h2 className="">Attendance and Leave Details</h2>
                          </div>
                          <div className="navheadCon">
                            <ApplyLeave />
                          </div>
                        </nav>
                      </div>
                      <div className="container">
                        {/* <div className="container-fluid mx-md-4"> */}
                        <div className="main">
                          <div className="d-flex justify-content-between mb-2 mt-4"></div>

                          <div className="mt-5">
                            <div className="mt-5 text-center">
                              <h4>Attendance details</h4>
                            </div>
                            <div
                              className="table-container"
                              style={{ maxHeight: "20rem", overflow: "auto" }}
                            >
                              <table className="table table-bordered">
                                <thead className="table-head">
                                  <tr>
                                    <th>Sr. no.</th>
                                    <th>Date</th>
                                    <th>Login Time</th>
                                    <th>Logout Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Attendance?.map((item, index) => {
                                    return (
                                      <tr
                                        className="table-row"
                                        key={item?.attendance_id}
                                      >
                                        <td>{index + 1}</td>
                                        <td>
                                          {item?.date
                                            ? moment(item?.date).format(
                                                "DD/MM/YYYY"
                                              )
                                            : ""}{" "}
                                        </td>
                                        <td>
                                          {item?.allday_shift_login_time
                                            ? moment(
                                                item?.allday_shift_login_time,
                                                "HH:mm:ss.SSSSSS"
                                              ).format("hh:mm A")
                                            : ""}{" "}
                                        </td>
                                        <td>
                                          {" "}
                                          {item?.allday_shift_logout_time
                                            ? moment(
                                                item?.allday_shift_logout_time,
                                                "HH:mm:ss.SSSSSS"
                                              ).format("hh:mm A")
                                            : ""}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="mt-5 text-center">
                              <h4>Leave details</h4>
                            </div>
                            <div
                              className=""
                              style={{ maxHeight: "20rem", overflow: "auto" }}
                            >
                              <div className="table-container">
                                <table className="table table-bordered">
                                  <thead className="table-head">
                                    <tr>
                                      <th>Sr. no.</th>
                                      <th>Leave Date</th>
                                      <th>Leave Reason</th>
                                      <th>Leave Status</th>
                                      <th>Created at</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {leavesData?.map((item, index) => {
                                      // Split the leave_dates string into an array of date strings
                                      const leaveDatesArray =
                                        item?.leave_dates.split(",");

                                      // Format each date in the array using the formatDate function
                                      const formattedLeaveDates =
                                        leaveDatesArray
                                          .map((dateString) =>
                                            formatDate(dateString)
                                          )
                                          .join(", "); // Join the formatted dates back into a single string
                                      return (
                                        <tr className="table-row" key={item.id}>
                                          <td>{index + 1}</td>
                                          <td>{formattedLeaveDates}</td>
                                          <td>{item.leave_reason}</td>
                                          <td>{item.leave_status}</td>
                                          <td>
                                            {item.created_at?.split("T")[0]
                                              ? moment(
                                                  item.created_at?.split("T")[0]
                                                ).format("DD/MM/YYYY")
                                              : ""}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AttendanceLeave;
const Container = styled.div`
  .table {
    overflow-x: auto;
    th {
      background-color: #201658;
      color: white;
      min-width: 7rem;
    }
    td {
      font-weight: bold;
      min-width: 7rem;
    }
  }
  .table::-webkit-scrollbar {
    width: 0;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .attend-reject {
    color: red;
  }

  .attend-approve {
    color: green;
  }

  /* .navhead {
    margin-left: 7.5rem;
    @media screen and (max-width: 768px) {
      margin-left: 10rem;
    }
    @media screen and (min-width: 769px) and (max-width: 1024px) {
      margin-left: 14rem;
    }
  }
  .navheadCon {
    @media screen and (max-width: 768px) {
      margin-left: 10rem;
    }
    @media screen and (min-width: 769px) and (max-width: 1024px) {
      margin-left: 14rem;
    }
  } */
  .branch {
    @media screen and (max-width: 768px) {
      margin-left: 5rem;
    }
    @media screen and (min-width: 769px) and (max-width: 1024px) {
      margin-left: 5rem;
    }
    @media screen and (min-width: 1025px) and (max-width: 1280px) {
      margin-left: 5rem;
    }
    @media screen and (min-width: 1281px) and (max-width: 1500px) {
      margin-left: 3rem;
    }
  }

  #set {
    margin-left: -4.5rem;
    padding-left: 150px; /* Width of sidebar */
    padding-top: 90px; /* Height of header */
    flex-grow: 1;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      margin-left: -1rem;
    }
    @media screen and (min-width: 1020px) and (max-width: 1500px) {
      margin-left: -1.1rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 0.1rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
      margin-left: 0.1rem;
    }

    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      margin-left: 0rem;
    }
  }

  #hd {
    padding-top: 60px; /* Height of header */
    min-height: 100vh;
    position: fixed;

    @media screen and (max-width: 768px) {
      height: 68rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      height: 58rem;
    }
  }
  .header {
    position: fixed;
    min-width: 100%;
    z-index: 100;
  }
`;
