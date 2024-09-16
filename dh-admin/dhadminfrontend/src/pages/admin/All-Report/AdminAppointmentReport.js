import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import SiderAdmin from "../SiderAdmin";
import HeaderAdmin from "../HeaderAdmin";
import animationData from "../../animation/loading-effect.json";
import Lottie from "react-lottie";
import cogoToast from "cogo-toast";

const AdminAppointmentReport = () => {
  const user = useSelector((state) => state.user.currentUser);

  const branch = user.branch_name;

  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [fromDate, setFromDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(false);

  console.log(toDate - fromDate);

  const differenceError = () => {
    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();
    const differenceInMilliseconds = to - from;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    if (differenceInDays >= 30) {
      setError(true);
      cogoToast.error(
        "The difference between the dates should be less than 30 days"
      );
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    differenceError();
  }, [toDate, fromDate]);

  const getAppointList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getAppointmentData/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(response);
      setAppointmentList(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointList();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const todayDate = new Date();

  // Get year, month, and date
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to adjust month, padStart ensures 2 digits
  const date = String(todayDate.getDate()).padStart(2, "0"); // Ensuring 2 digits

  // Format as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${date}`;

  console.log(formattedDate.slice(0, 7));

  const filterAppointDataByMonth = appointmentList?.filter((item) => {
    return (
      item.appointment_dateTime.split("T")[0].slice(0, 7) ===
      formattedDate.slice(0, 7)
    );
  });

  console.log(filterAppointDataByMonth);

  const uniqueDoctor = [
    ...new Set(appointmentList?.map((item) => item.assigned_doctor_name)),
  ];

  console.log(uniqueDoctor);

  const goBack = () => {
    window.history.go(-1);
  };

  const exportToExcel = (e) => {
    e.preventDefault();
    const csvRows = [];
    const table = document.querySelector(".table");

    if (!table) {
      console.error("Table element not found");
      return;
    }

    table.querySelectorAll("tr").forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td, th").forEach((cell) => {
        rowData.push(cell.innerText);
      });
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Appointment-report.csv";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };
  return (
    <>
      <Container>
        <HeaderAdmin />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-1 p-0">
                <SiderAdmin />
              </div>
              <div
                className="col-lg-11 col-11 ps-0"
                style={{ marginTop: "5rem" }}
              >
                <div className="container-fluid mt-3">
                  <div className="container-fluid">
                    <button
                      className="btn btn-success text-white"
                      onClick={goBack}
                    >
                      <IoMdArrowRoundBack /> Back
                    </button>
                    <div className="row mt-3">
                      {/* <div className="col-1"></div> */}

                      <div className="col-12">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                          <div class="container d-flex justify-content-center">
                            <h2 className="">Appointment Reports</h2>
                          </div>
                        </nav>
                      </div>
                      <div className="container">
                        <div class="mt-4">
                          <div className="row">
                            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                              <div className="d-flex justify-content-between mb-2">
                                <form onSubmit={exportToExcel}>
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <input
                                        type="date"
                                        name=""
                                        id=""
                                        required
                                        className="p-2 rounded"
                                        onChange={(e) =>
                                          setFromDate(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="mx-2">To</div>
                                    <div>
                                      <input
                                        type="date"
                                        name=""
                                        id=""
                                        required
                                        className="p-2 rounded"
                                        onChange={(e) =>
                                          setToDate(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="d-flex flex-column">
                                      {appointmentList.length > 0 ? (
                                        <button
                                          className="btn btn-warning mx-2 text-white shadow"
                                          style={{
                                            backgroundColor: "#1abc9c",
                                            borderColor: "#1abc9c",
                                          }}
                                          type="submit"
                                          disabled={error}
                                        >
                                          Download Report
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-warning mx-2 text-white shadow"
                                          style={{
                                            backgroundColor: "#1abc9c",
                                            borderColor: "#1abc9c",
                                          }}
                                          type="button"
                                          disabled
                                        >
                                          Download Report
                                        </button>
                                      )}

                                      {error && (
                                        <>
                                          <small className="text-danger">
                                            The difference between the dates
                                            should be less than 30 days
                                          </small>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                              <div className="d-flex justify-content-end align-items-center mt-3">
                                <div>
                                  <button
                                    className="btn btn-info text-white"
                                    style={{
                                      backgroundColor: "#1abc9c",
                                      borderColor: "#1abc9c",
                                    }}
                                  >
                                    Filter by Doctor
                                  </button>
                                </div>

                                <div className="mx-2">
                                  <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value)}
                                  >
                                    <option value="">Select-</option>
                                    {uniqueDoctor?.map((item) => (
                                      <>
                                        <option value={item}>{item}</option>
                                      </>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4>
                              Total Appointments : {appointmentList.length}
                            </h4>
                          </div>

                          <div className="container-fluid mt-3">
                            {loading ? (
                              <Lottie
                                options={defaultOptions}
                                height={300}
                                width={400}
                                style={{ background: "transparent" }}
                              ></Lottie>
                            ) : (
                              <>
                                <div class="table-responsive rounded">
                                  <table class="table table-bordered rounded shadow">
                                    <thead className="table-head">
                                      <tr>
                                        <th className="table-sno sticky">
                                          Appointment ID
                                        </th>
                                        <th className="sticky">Patient UHID</th>

                                        <th className="table-small sticky">
                                          Patient Name
                                        </th>
                                        <th className="table-small sticky">
                                          Contact Number
                                        </th>
                                        <th className="table-small sticky">
                                          Assigned Doctor
                                        </th>

                                        <th className="table-small sticky">
                                          Appointed by
                                        </th>
                                        <th className="table-small sticky">
                                          Updated by
                                        </th>
                                        <th className="table-small sticky">
                                          Appointment Date & Time
                                        </th>
                                        <th className="table-small sticky">
                                          Appointment Status
                                        </th>
                                        <th className="sticky">
                                          Cancel Reason
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {appointmentList
                                        ?.filter((item) => {
                                          const billDate =
                                            item.appointment_dateTime?.split(
                                              "T"
                                            )[0];
                                          if (fromDate && toDate) {
                                            return (
                                              billDate >= fromDate &&
                                              billDate <= toDate
                                            );
                                          } else {
                                            return true;
                                          }
                                        })
                                        .filter((item) => {
                                          if (doctor) {
                                            return (
                                              item.assigned_doctor_name ===
                                              doctor
                                            );
                                          } else {
                                            return true;
                                          }
                                        })
                                        .map((item) => (
                                          <>
                                            <tr className="table-row">
                                              <td className="table-sno">
                                                {item.appoint_id}
                                              </td>
                                              <td className="table-small">
                                                {item.uhid}
                                              </td>
                                              <td>{item.patient_name}</td>
                                              <td className="table-small">
                                                {item.mobileno}
                                              </td>
                                              <td className="table-small">
                                                {item.assigned_doctor_name}
                                              </td>

                                              <td className="table-small">
                                                {item.appointment_created_by}
                                              </td>
                                              <td className="table-small">
                                                {item.appointment_updated_by}
                                              </td>
                                              <td className="table-small">
                                                {
                                                  item.appointment_dateTime?.split(
                                                    "T"
                                                  )[0]
                                                }{" "}
                                                {
                                                  item.appointment_dateTime?.split(
                                                    "T"
                                                  )[1]
                                                }
                                              </td>
                                              <td>{item.appointment_status}</td>
                                              <td>{item.cancel_reason}</td>
                                            </tr>
                                          </>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
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

export default AdminAppointmentReport;
const Container = styled.div`
  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  th {
    background-color: #1abc9c;
    color: white;
    position: sticky;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }
  .table-responsive {
    height: 30rem;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #1abc9c;
    color: white;
    z-index: 1;
  }

  .second-table {
    height: 30rem;
    overflow: auto;
  }
`;
