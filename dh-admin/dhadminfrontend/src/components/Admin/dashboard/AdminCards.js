import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCards = () => {
  const user = useSelector((state) => state.user.currentUser);

  const [appointmentList, setAppointmentList] = useState([]);
  const [availableEmp, setAvailableEmp] = useState([]);
  const [billTot, setBillTot] = useState();
  const [treatValue, setTreatValue] = useState([]);

  // console.log(branch.name);
  const getAppointList = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getAppointmentData/${user.branch_name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(data);
      setAppointmentList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployeeAvailable = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getAvailableEmp/${user.branch_name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(data);
      setAvailableEmp(data);
    } catch (error) {
      // console.log(error);
    }
  };

  const getTreatmentValues = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getTreatSuggest/${user.branch_name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(data);
      setTreatValue(data);
    } catch (error) {
      // console.log(error);
    }
  };

  // console.log(treatValue);

  useEffect(() => {
    getAppointList();
    getEmployeeAvailable();
    getTreatmentValues();

    const interval = setInterval(() => {
      getAppointList();
      getEmployeeAvailable();
      getTreatmentValues();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getDate = new Date();
  const year = getDate.getFullYear();
  const month = String(getDate.getMonth() + 1).padStart(2, "0");
  const day = String(getDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}`;
  const formateForDay = `${year}-${month}-${day}`;
  const formatChange = `${day}-${month}-${year}`;
  // console.log(formateForDay);

  // console.log(appointmentList);

  //filterForPatAppointToday
  const filterForOpdEarnToday = appointmentList?.filter(
    (item) =>
      item.appointment_created_at?.split(" ")[0] === formateForDay &&
      item.treatment_provided === "OPD" &&
      item.appointment_status !== "Cancel"
  );

  // console.log(filterForOpdEarnToday);
  // console.log(appointmentList);
  const totalPrice = () => {
    try {
      let total = 0;
      filterForOpdEarnToday.forEach((item) => {
        total = total + parseFloat(item.opd_amount);
      });
      // console.log(total);
      return total;
    } catch (error) {
      // console.log(error);
      return 0;
    }
  };

  const totalOpdValue = totalPrice();

  // console.log(availableEmp);
  // console.log(formateForDay);
  //filter for employee availability
  const filterForEmpAVToday = availableEmp?.filter(
    (item) =>
      item.availability === "yes" && item.date?.split("T")[0] === formateForDay
  );

  // console.log(filterForEmpAVToday);

  //filter for available doctor
  // console.log(availableEmp[0]?.date.split("T")[0]);
  const filterForDocAVToday = availableEmp?.filter(
    (item) =>
      item.availability === "yes" &&
      item.date?.split("T")[0] === formateForDay &&
      item.employee_designation === "doctor"
  );

  // console.log(filterForDocAVToday);

  //filter for present employee today
  // console.log(availableEmp[0]?.date.split("T")[0]);
  const filterForEmpPresentToday = availableEmp?.filter(
    (item) =>
      item.availability === "yes" && item.date?.split("T")[0] === formattedDate
  );

  // console.log(filterForEmpPresentToday);

  //filter for today's earning
  // console.log(appointmentList[0]?.appointment_dateTime?.split("T")[0]);
  const filterForEarningToday = treatValue?.filter(
    (item) =>
      item.payment_status === "paid" &&
      item.bill_date?.split(" ")[0] === formatChange
  );

  // console.log(treatValue);

  const totalTreatPrice = () => {
    try {
      let total = 0;
      filterForEarningToday.forEach((item) => {
        total = total + parseFloat(item.paid_amount);
      });
      // console.log(total);
      return total;
    } catch (error) {
      // console.log(error);
      return 0;
    }
  };

  const totalTreatValue = totalTreatPrice();
  // console.log(totalTreatValue);

  const filterForTodayAppoint = appointmentList?.filter(
    (item) => item.appointment_dateTime?.split("T")[0] === formateForDay
  );
  return (
    <>
      <Container>
        <div className="row d-flex justify-content-around">
          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-3 my-3 p-0 mx-2">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <i className="bi bi-people-fill icon"></i>
                </div>
                <div className="cardtext">
                  <h5 className="card-title">Employees Present Today</h5>
                  <p className="card-text">{filterForEmpAVToday.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-3 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <i className="bi bi-people-fill icon"></i>
                </div>
                <div className="cardtext">
                  <h5 className="card-title">Earn OPD Today</h5>
                  <p className="card-text">₹{totalOpdValue}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-3 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <i className="bi bi-people-fill icon"></i>
                </div>
                <div className="cardtext">
                  <h5 className="card-title">Earn Treatment Today</h5>
                  <p className="card-text">₹{totalTreatValue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-3 my-3 p-0 mx-2">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <i className="bi bi-people-fill icon"></i>
                </div>
                <div className="cardtext">
                  <h5 className="card-title">Available Doctors Today</h5>
                  <p className="card-text">{filterForDocAVToday.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-3 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <i className="bi bi-people-fill icon"></i>
                </div>

                <div className="cardtext">
                  <h5 className="card-title">Today's Appointments</h5>
                  <p className="card-text">{filterForTodayAppoint.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminCards;
const Container = styled.div`
  .card {
    background: #1abc9c;
    height: 9.5rem;
    border: none;
    box-shadow: 1px 2px 8px black;
    &:hover {
      background: #3498db;
    }
  }

  .icon {
    font-size: 40px;
    /* align-items: start; */
    color: #000;
    /* display: flex; */
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
      color: #000;
    }
    p {
      color: #000;
    }
  }
`;
