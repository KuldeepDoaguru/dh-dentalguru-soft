import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FcAlarmClock } from "react-icons/fc";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaDotCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

const ClinicActivity = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [showCalender, setShowCalender] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);
  const [patDetails, setPatDetails] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [todayDate, setTodayDate] = useState("");
  const [treatValue, setTreatValue] = useState([]);

  const handleCalender = () => {
    setShowCalender(!showCalender);
  };
  console.log(appointmentList);
  const getAppointList = async () => {
    // console.log(branch.name);
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
      setAppointmentList(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toISOString());
  }, []);

  const getPatdetailsByBranch = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getPatientDetailsByBranch/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(data);
      setPatDetails(data);
    } catch (error) {
      // console.log(error);
    }
  };

  const getTime = new Date();
  const hours = ("0" + (getTime.getHours() - 5)).slice(-2);
  const minutes = ("0" + getTime.getMinutes()).slice(-2);

  // If hours is negative, adjust it to the previous day
  if (hours < 0) {
    // Add 24 to make it positive
    hours = ("0" + (hours + 24)).slice(-2);
  }

  const formattedTime = `${hours}`;

  // console.log(formattedTime);

  const getLife = appointmentList?.map((item) => {
    // Log the values involved in the subtraction
    // console.log("Formatted Time:", typeof formattedTime);
    // console.log(
    //   "Appointment Time:",
    //   item?.appointment_dateTime?.split("T")[1]?.split(":")[0]
    // );

    const difference =
      formattedTime - item?.appointment_dateTime?.split("T")[1]?.split(":")[0];
    // console.log("Difference:", difference); // Log the difference
    return difference.toString();
  });

  // console.log(getLife);
  // console.log(
  //   appointmentList[0]?.appointment_dateTime.split("T")[1]?.split(":")[0]
  // );

  //patient details
  const getPatientDet = patDetails?.map((item) => {
    // Log the values involved in the subtraction
    // console.log("Formatted Time:", typeof formattedTime);
    // console.log(
    //   "Appointment Time:",
    //   item?.regdatetime?.split("T")[1]?.split(":")[0]
    // );

    const difference =
      formattedTime - item?.regdatetime?.split("T")[1]?.split(":")[0];
    console.log("Difference:", difference); // Log the difference
    return difference.toString();
  });

  // console.log(patDetails);
  // console.log(
  //   appointmentList[0]?.appointment_dateTime.split("T")[1]?.split(":")[0]
  // );

  const getTreatmentValues = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getTreatSuggest/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);
      setTreatValue(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(treatValue);

  useEffect(() => {
    getAppointList();
    getPatdetailsByBranch();
    getTreatmentValues();
  }, [branch.name]);

  const ConvertToIST = (utcDateString) => {
    // Convert the date string to a Date object
    const utcDate = new Date(utcDateString);

    // Convert the UTC date to IST by adding 5 hours and 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Get the components of the date
    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(istDate.getDate()).padStart(2, "0");

    // Format the IST date as "YYYY-MM-DD"
    const istDateString = `${year}-${month}-${day}`;

    return istDateString;
  };

  console.log(ConvertToIST);

  const getAppMonth = appointmentList?.filter((item) => {
    return (
      item.appointment_created_at?.split(" ")[0]?.slice(0, 7) ===
      todayDate?.split("T")[0]?.slice(0, 7)
    );
  });

  console.log(getAppMonth);

  console.log(currentDate);
  console.log(appointmentList[0]?.appointment_created_at?.split(" ")[0]);
  console.log(todayDate?.split("T")[0]);
  //filter for day wise Appointment
  const filterAppointment = appointmentList?.filter((item) => {
    if (currentDate) {
      // return item.created_at?.split("T")[0] === currentDate;
      return item.appointment_dateTime?.split("T")[0] === currentDate;
    } else {
      return (
        // item.appointment_dateTime?.split("T")[0] === todayDate?.split("T")[0]
        item.appointment_dateTime?.split("T")[0] === todayDate?.split("T")[0]
      );
    }
  });

  console.log(filterAppointment);

  const getFormattedTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const appointmentTime = new Date(createdAt);

    const timeDifference = Math.abs(currentTime - appointmentTime);
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    return hoursDifference;
  };

  console.log(filterAppointment);
  console.log(appointmentList);
  console.log(currentDate);
  console.log(todayDate?.split("T")[0]);

  const filterTreatmentVal = filterAppointment?.filter((item) => {
    return item.treatment_provided === "OPD";
  });

  console.log(filterTreatmentVal);

  //filter for day wise Treatment
  const filterTreatment = filterTreatmentVal?.filter((item) => {
    if (currentDate) {
      return item.appointment_dateTime?.split("T")[0] === currentDate;
    } else {
      return (
        item.appointment_dateTime?.split("T")[0] === todayDate?.split("T")[0]
      );
    }
  });

  console.log(filterTreatment);

  const formatTodayDate = moment(todayDate?.split("T")[0]).format("DD-MM-YYYY");
  const formatCurrentDate = moment(currentDate).format("DD-MM-YYYY");
  console.log(
    "format today's date",
    formatTodayDate,
    "today date",
    treatValue[0]?.bill_date?.split(" ")[0]
  );
  console.log(
    "format current date",
    formatCurrentDate,
    "current date",
    treatValue[0]?.bill_date?.split(" ")[0]
  );
  // console.log();

  //filter for day wise billing
  const filterBilling = treatValue?.filter((item) => {
    if (currentDate) {
      return (
        item.bill_date?.split(" ")[0] === formatCurrentDate &&
        (item.payment_status === "paid" ||
          item.payment_status === "Paid" ||
          item.payment_status === "Credit")
      );
    }
    return (
      item.bill_date?.split(" ")[0] === formatTodayDate &&
      (item.payment_status === "paid" ||
        item.payment_status === "Paid" ||
        item.payment_status === "Credit")
    );
  });

  console.log(filterBilling);
  console.log(patDetails[0]?.created_at?.split(" ")[0]);
  console.log(currentDate);
  console.log(todayDate?.split("T")[0]);
  //filter for day wise patient registeration
  const filterPatient = patDetails?.filter((item) => {
    if (currentDate) {
      return item.created_at?.split(" ")[0] === currentDate;
    }
    return item.created_at?.split(" ")[0] === todayDate?.split("T")[0];
  });

  console.log(filterPatient);

  const tdate = new Date();

  // Get year, month, and date
  const year = tdate.getFullYear();
  const month = String(tdate.getMonth() + 1).padStart(2, "0"); // Adding 1 to adjust month, padStart ensures 2 digits
  const date = String(tdate.getDate()).padStart(2, "0"); // Ensuring 2 digits

  // Format as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${date}`;

  // console.log(formattedDate);
  return (
    <>
      <Container>
        <div className="container-fluid">
          <div className="clinic-act-heading">
            <div>
              <h5>
                <FcAlarmClock /> Clinic Activity for{" "}
                {currentDate ? currentDate : todayDate?.split("T")[0]}
              </h5>
            </div>
            <div>
              <h5>
                {currentDate ? currentDate : todayDate?.split("T")[0]}
                <IoIosArrowDropdownCircle onClick={handleCalender} />
              </h5>
              {showCalender ? (
                <>
                  <input
                    type="date"
                    name="currentDate"
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="container-fluid mt-2">
          <ul class="nav nav-pills mb-3 ms-3" id="pills-tab" role="tablist">
            {/* <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-python-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-python"
                type="button"
                role="tab"
                aria-controls="pills-python"
                aria-selected="true"
              >
                All
              </button>
            </li> */}
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-java-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-java"
                type="button"
                role="tab"
                aria-controls="pills-java"
                aria-selected="true"
              >
                Appointment
              </button>
            </li>
            <li class="nav-item mx-2" role="presentation">
              <button
                class="nav-link"
                id="pills-treatment-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-treatment"
                type="button"
                role="tab"
                aria-controls="pills-treatment"
                aria-selected="false"
              >
                Treatment
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-billing-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-billing"
                type="button"
                role="tab"
                aria-controls="pills-billing"
                aria-selected="false"
              >
                Billing
              </button>
            </li>
            <li class="nav-item mx-2" role="presentation">
              <button
                class="nav-link"
                id="pills-Patient-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-Patient"
                type="button"
                role="tab"
                aria-controls="pills-Patient"
                aria-selected="false"
              >
                Patient
              </button>
            </li>
          </ul>

          {/* tab button end */}

          <div
            className="tab-content border ms-3 me-3 my-3 mb-5"
            id="pills-tabContent"
          >
            <div
              className="container-fluid pe-5 ps-5 mb-3 py-4 pb-4 tab-pane fade show active"
              id="pills-java"
              role="tabpanel"
              aria-labelledby="pills-java-tab"
            >
              <ul className="appointHeight">
                {filterAppointment?.map((item) => (
                  <>
                    <li>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>
                            <FaDotCircle className="mx-1" /> Appointment of{" "}
                            {item.patient_name} has been scheduled by{" "}
                            {item.appointed_by} at {item.branch_name} Branch
                          </h5>
                        </div>
                        <div>
                          <p className="fw-bold">
                            {moment(item.appointment_created_at).format(
                              "YYYY-MM-DD h:mm:ss A"
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                    <hr />
                  </>
                ))}
              </ul>
            </div>

            <div
              className="container-fluid pe-5 ps-5 mb-3 py-4 pb-4 tab-pane fade"
              id="pills-treatment"
              role="tabpanel"
              aria-labelledby="pills-treatment-tab"
            >
              <ul className="appointHeight">
                {filterAppointment?.map((item) => (
                  <>
                    <li>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>
                            <FaDotCircle className="mx-1" />{" "}
                            {item.treatment_provided} Treatment provided to{" "}
                            patient {item.patient_name} by Dr.{" "}
                            {item.assigned_doctor_name}
                          </h5>
                        </div>
                        <div>
                          <p className="fw-bold">
                            {moment(item.appointment_created_at).format(
                              "YYYY-MM-DD h:mm:ss A"
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                    <hr />
                  </>
                ))}
              </ul>
            </div>

            <div
              className="container-fluid pe-5 ps-5 mb-3 py-4 pb-4 tab-pane fade"
              id="pills-billing"
              role="tabpanel"
              aria-labelledby="pills-billing-tab"
            >
              <ul className="appointHeight">
                {filterBilling?.map((item) => (
                  <>
                    <li>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>
                            <FaDotCircle className="mx-1" /> Patient{" "}
                            {item.patient_name} has paid{" "}
                            {item.paid_amount === "0"
                              ? item.pay_by_sec_amt
                              : item.paid_amount}
                            /- for the Treatment.
                          </h5>
                        </div>
                        <div>
                          <p className="fw-bold">
                            {item.bill_date?.split(" ")[0]}{" "}
                            {moment(
                              item.bill_date?.split(" ")[1],
                              "HH:mm:ss"
                            ).format("hh:mm A")}
                          </p>
                        </div>
                      </div>
                    </li>
                    <hr />
                  </>
                ))}
              </ul>
            </div>

            <div
              className="container-fluid pe-5 ps-5 mb-3 py-4 pb-4 tab-pane fade"
              id="pills-Patient"
              role="tabpanel"
              aria-labelledby="pills-Patient-tab"
            >
              <ul className="appointHeight">
                {filterPatient?.map((item) => (
                  <>
                    <li>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>
                            <FaDotCircle className="mx-1" /> Patient{" "}
                            {item.patient_name} has been registered at{" "}
                            {item.branch_name} Branch.
                          </h5>
                        </div>
                        <div>
                          <p className="fw-bold">
                            {moment(item?.created_at).format(
                              "YYYY-MM-DD hh:mm A"
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                    <hr />
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ClinicActivity;
const Container = styled.div`
  .nav-link {
    color: #004aad;
    background: #e0e0e0;
  }

  .nav-pills .nav-link.active {
    background-color: #004aad;
  }

  ul {
    li {
      list-style-type: none;
    }
  }

  .tab-content {
    height: 100%;
    overflow: auto;
  }

  .appointHeight {
    height: 15rem;
  }
`;
