import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import cogoToast from "cogo-toast";
// import { toggleTableRefresh } from "../redux/slices/UserSlicer";
import moment from "moment";
import { toggleTableRefresh } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { TbRefresh } from "react-icons/tb";
import styled from "styled-components";

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const token = user.token;
  console.log(user);
  const branch_name = user.branch_name;
  const employee_name = user.employee_name;
  const employee_ID = user.employee_ID;
  const employee_designation = user.employee_designation;
  const date = new Date().toISOString().slice(0, 10);
  const time = new Date();
  const [isRotating, setIsRotating] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState([]);

  const getTodayAttendance = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getTodayAttendance/${branch_name}/${employee_ID}/${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodayAttendance(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodayAttendance();
  }, []);
  console.log(todayAttendance);
  const loginTime = moment().format("HH:mm:ss");
  console.log(
    branch_name,
    employee_ID,
    employee_name,
    employee_designation,
    date,
    loginTime
  );
  const handleLogin = async () => {
    // Format current time for login
    try {
      const response = await axios.post(
        "https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/markAttendanceLogin",
        {
          branch_name,
          employee_ID,
          employee_name,
          employee_designation,
          date,
          loginTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        cogoToast.success("Login time recorded successfully");
        getTodayAttendance();
        dispatch(toggleTableRefresh());
        window.location.reload();
      }
    } catch (error) {
      console.error("Error marking login time:", error);
      cogoToast.error(error?.response?.data?.message);
    }
  };

  const refreshPage = () => {
    window.location.reload();

    setTimeout(() => {
      setIsRotating(false);
      window.location.reload();
    }, 1000);
  };

  const handleLogout = async () => {
    // Display a confirmation popup
    const isConfirmed = window.confirm(
      "Are you sure you want to mark attendance Logout?"
    );

    if (!isConfirmed) {
      // If the user cancels the deletion, do nothing
      return;
    }
    const logoutTime = moment().format("HH:mm:ss"); // Format current time for logout
    const availability = "no";
    try {
      const response = await axios.put(
        "https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/markAttendanceLogout",
        {
          branch_name,
          employee_ID,
          employee_name,
          employee_designation,
          date,
          logoutTime,
          availability,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        cogoToast.success("Logout time recorded successfully");
        dispatch(toggleTableRefresh());
      }
    } catch (error) {
      console.error("Error marking logout time:", error);
      cogoToast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Container>
        <div className="container">
          <div className="row d-flex justify-content-end">
            <div className="col-6 d-flex justify-content-end gap-2">
              {todayAttendance?.length == 0 && (
                <button
                  className="btn btn-success shadow"
                  style={{
                    backgroundColor: "#0dcaf0",
                    border: "#0dcaf0",
                  }}
                  onClick={handleLogin}
                >
                  Attendance Login
                </button>
              )}

              {todayAttendance?.length > 0 && (
                <>
                  <button
                    className="btn btn-info"
                    style={{
                      backgroundColor: "#0dcaf0",
                      border: "#0dcaf0",
                    }}
                    onClick={refreshPage}
                  >
                    <TbRefresh className={isRotating ? "rotate" : ""} />
                  </button>
                  <button
                    className="btn btn-success shadow"
                    style={{
                      backgroundColor: "#0dcaf0",
                      border: "#0dcaf0",
                    }}
                    onClick={handleLogout}
                  >
                    Attendance Logout
                  </button>
                </>
              )}
            </div>
            {/* <div className='col-3'>
          
         
        </div> */}
            {/* <div>{message}</div> */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MarkAttendance;
const Container = styled.div`
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: rotate 1s linear infinite;
  }
`;
