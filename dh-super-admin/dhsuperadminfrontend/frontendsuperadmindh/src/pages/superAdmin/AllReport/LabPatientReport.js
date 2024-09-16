import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import moment from "moment";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import BranchSelector from "../../../components/BranchSelector";
import ReportCardPage from "./ReportCardPage";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";

const LabPatientReport = () => {
  const [patientDetails, setPatientDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  // console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  const branch = useSelector((state) => state.branch);
  // console.log("User State:", user);
  const [keyword, setkeyword] = useState("");

  const goBack = () => {
    window.history.go(-1);
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getPatientLabTestReport/${branch.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        setPatientDetails(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [branch.name]);

  console.log(patientDetails);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const filteredPatients = patientDetails.filter((patient) => {
    const fullName =
      `${patient.patient_name} ${patient.assigned_doctor_name}`.toLowerCase();
    const formattedDate = moment(patient.created_date).format("YYYY-MM-DD");
    return (
      fullName.includes(searchQuery.toLowerCase()) &&
      (!dateFilter || formattedDate === dateFilter)
    );
  });

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/BloodTest/${id}`);
  };

  // ***********This for Excel sheet**********
  const exportToExcel = () => {
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
    link.download = "table_data.csv";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };
  const [sorted, setSorted] = useState();
  const [inp, setInp] = useState("");

  const handleSearch = () => {
    let newArr = sorted.filter((patient) => {
      let searchWork = inp.toLowerCase();
      for (let prop in patient) {
        let word = patient[prop].toString().toLowerCase();
        if (word.includes(searchWork)) {
          return true;
        }
      }
      return false;
    });
    setSorted(newArr);
  };

  const handleSort = () => {
    let newArr = [...sorted].sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
    setSorted(newArr);
  };

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  return (
    <>
      <Container>
        <Header />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-1 p-0">
                <Sider />
              </div>
              <div className="col-lg-11 col-11 ps-0">
                <IoArrowBackSharp
                  className="fs-1 text-black d-print-none"
                  onClick={goBack}
                />
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div>
                <div className="container mt-3">
                  <div className="container-fluid">
                    <div className="row mt-3">
                      {/* <div className="col-1"></div> */}

                      <div className="col-12">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                          <div class="container d-flex justify-content-center">
                            <h2 className=""> Lab Reports Dashboard</h2>
                          </div>
                        </nav>

                        <ReportCardPage />
                        <div className="container-fluid mt-4">
                          <h2 style={{ color: "#213555" }}>
                            List of All Report
                          </h2>
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-xxl-4 col-xl-4 col-lg-4 col-sm-6 col-6">
                                <input
                                  type="text"
                                  placeholder="Search Patient Name or UHID"
                                  className="input p-1 rounded border-none w-100"
                                  value={keyword}
                                  onChange={handleKeywordChange}
                                />
                              </div>
                              <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-6 col-6">
                                <input
                                  type="date"
                                  value={dateFilter}
                                  onChange={(e) =>
                                    setDateFilter(e.target.value)
                                  }
                                  className="form-control w-100"
                                />
                              </div>
                            </div>
                          </div>
                          {loading ? (
                            <Lottie
                              options={defaultOptions}
                              height={300}
                              width={400}
                              style={{ background: "transparent" }}
                            ></Lottie>
                          ) : (
                            <>
                              <div className="res-table">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th className="sticky">Test ID</th>
                                      <th className="sticky">Patient UHID </th>
                                      <th className="sticky">Patient Name </th>
                                      <th className="sticky"> Age </th>
                                      <th className="sticky"> Gender </th>
                                      <th className="sticky">Branch Name </th>
                                      <th className="sticky">
                                        Assigned Doctor Name
                                      </th>
                                      <th className="sticky">Lab Name</th>
                                      <th className="sticky">Created Date</th>
                                      <th className="sticky">Patient Tests </th>
                                      <th className="sticky">Tests Status </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {patientDetails
                                      ?.filter((val) => {
                                        if (keyword === "") {
                                          return true;
                                        } else if (
                                          val.patient_name
                                            .toLowerCase()
                                            .includes(trimmedKeyword) ||
                                          val.patient_uhid
                                            .toLowerCase()
                                            .includes(trimmedKeyword)
                                        ) {
                                          return val;
                                        }
                                      })
                                      ?.filter((i) => {
                                        if (dateFilter === "") {
                                          return true;
                                        } else if (
                                          i.created_date?.split("T")[0] ===
                                          dateFilter
                                        ) {
                                          return i;
                                        }
                                      })
                                      .map((patient, index) => (
                                        <>
                                          <tr key={patient.testid}>
                                            <td>{patient.testid}</td>
                                            <td>{patient.patient_uhid}</td>
                                            <td>{patient.patient_name}</td>
                                            <td>{patient.age}</td>
                                            <td>{patient.gender}</td>
                                            <td>{patient.branch_name}</td>

                                            <td>
                                              {patient.assigned_doctor_name}
                                            </td>
                                            <td>{patient.lab_name}</td>
                                            <td>
                                              {
                                                patient.created_date?.split(
                                                  " "
                                                )[0]
                                              }{" "}
                                              {moment(
                                                patient.created_date?.split(
                                                  " "
                                                )[1],
                                                "HH:mm:ss.SSSSSS"
                                              ).format("hh:mm A")}
                                            </td>
                                            <td>{patient.test}</td>
                                            {patient.test_status === "done" && (
                                              <td>
                                                <h6 className="text-capitalize text-success fw-bold">
                                                  {patient.test_status}
                                                </h6>
                                              </td>
                                            )}

                                            {patient.test_status ===
                                              "pending" && (
                                              <td>
                                                <h6 className="text-capitalize text-danger fw-bold">
                                                  {patient.test_status}
                                                </h6>
                                              </td>
                                            )}
                                          </tr>
                                        </>
                                        // Wrap the entire row inside a conditional statement based on test status
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                          <div>
                            <exportToExcel />
                            <button
                              type="button"
                              class="btn btn-primary text-light py-2 px-4"
                              onClick={exportToExcel}
                            >
                              Download
                            </button>
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

export default LabPatientReport;
const Container = styled.div`
  .res-table {
    max-height: 30rem;
    overflow: auto;
  }

  th {
    background-color: #004aad;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  td {
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #004aad;
    color: white;
    z-index: 1;
  }
`;
