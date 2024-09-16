import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Sider from "../../components/Sider";
import { Link } from "react-router-dom";
import BranchSelector from "../../components/BranchSelector";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import ReactPaginate from "react-paginate";
import Lottie from "react-lottie";
import animationData from "../../animation/loading-effect.json";
import moment from "moment";

const Apointment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const branch = useSelector((state) => state.branch);
  const [status, setStatus] = useState("");
  console.log(branch);
  const complaintsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const user = useSelector((state) => state.user);
  const [appointmentList, setAppointmentList] = useState([]);
  const [timeLIneData, setTimeLineData] = useState();
  const [keyword, setkeyword] = useState("");
  const [updateData, setUpdateData] = useState({
    branch: branch.name,
    patientName: "",
    patContact: "",
    assignedDoc: "",
    appointedBy: "",
    appointDateTime: "",
    updatedBy: user.id,
    appointment_status: "",
  });
  const [selectedItem, setSelectedItem] = useState();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const openUpdatePopup = (id) => {
    setSelectedItem(id);
    setShowPopup(true);
  };

  const closeUpdatePopup = () => {
    setShowPopup(false);
  };

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

  useEffect(() => {
    getAppointList();
  }, [branch.name]);

  // useEffect(() => {
  //   setCurrentPage(0);
  // }, [keyword]);

  console.log(appointmentList);
  console.log(status);

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0");
  const date = String(todayDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${date}`;

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const uniqueDoctor = [
    ...new Set(appointmentList?.map((item) => item.assigned_doctor_name)),
  ];

  console.log(uniqueDoctor);

  const searchFilter = appointmentList.filter((lab) => {
    if (status && trimmedKeyword) {
      return (
        (lab.assigned_doctor_name === status &&
          (lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
            lab.patient_uhid.toLowerCase().includes(trimmedKeyword))) ||
        lab.mobileno.toLowerCase().includes(trimmedKeyword)
      );
    } else if (status) {
      return lab.assigned_doctor_name === status;
    } else if (trimmedKeyword) {
      return (
        lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
        lab.patient_uhid.toLowerCase().includes(trimmedKeyword)
      );
    } else {
      return true;
    }
  });

  console.log(searchFilter);

  // const filterforOneMonth = searchFilter?.filter((item) => {
  //   return item.appointment_dateTime?.slice(0, 7) === formattedDate.slice(0, 7);
  // });

  const totalPages = Math.ceil(searchFilter.length / complaintsPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [status, trimmedKeyword]);

  const displayedAppointments = filterAppointDataByMonth();
  console.log(displayedAppointments);

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
                <div className="row d-flex justify-content-between mx-3">
                  <div className="col-12 col-md-12 mt-4">
                    <div className="d-flex justify-content-between">
                      <BranchSelector />
                    </div>

                    <div className="container-fluid mt-3">
                      <h2 className="text-center"> Appointment Details </h2>
                      <div>
                        <div className="row">
                          {/* <label>Employee Name :</label> */}
                          <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
                            <input
                              type="text"
                              placeholder="Search Patient Name or Patient UHID or Mobile Number"
                              className="input w-100"
                              value={keyword}
                              onChange={handleKeywordChange}
                            />
                          </div>
                          <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
                            <div className="d-flex justify-content-end align-items-center mt-3">
                              <div>
                                <button
                                  className="btn btn-info text-white"
                                  style={{
                                    backgroundColor: "#014cb1",
                                    borderColor: "#014cb1",
                                  }}
                                >
                                  Filter by Doctor
                                </button>
                              </div>

                              <div className="mx-2">
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  value={status}
                                  onChange={(e) => setStatus(e.target.value)}
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
                            Total appointments this month :{" "}
                            {searchFilter.length}
                          </h4>
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
                          <div className="table-responsive rounded">
                            <table className="table table-bordered rounded shadow">
                              <thead className="table-head">
                                <tr>
                                  <th className="table-sno">Appointment ID</th>
                                  <th>Patient UHID</th>
                                  <th>Treatment Package ID</th>
                                  <th className="table-small">Patient Name</th>
                                  <th className="table-small">
                                    Contact Number
                                  </th>
                                  <th className="table-small">
                                    Assigned Doctor
                                  </th>
                                  <th className="table-small">Appointed by</th>
                                  <th className="table-small">Updated by</th>
                                  <th className="table-small">
                                    Appointment Date & Time
                                  </th>
                                  <th className="table-small">
                                    Appointment Status
                                  </th>
                                  <th>Cancel Reason</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayedAppointments?.map((item) => (
                                  <tr
                                    className="table-row"
                                    key={item.appoint_id}
                                  >
                                    <td className="table-sno">
                                      {item.appoint_id}
                                    </td>
                                    <td className="table-small">
                                      <Link
                                        className="fw-bold"
                                        to={`/patient-profile/${item.patient_uhid}`}
                                        style={{
                                          textDecoration: "none",
                                          color: "#014cb1",
                                        }}
                                      >
                                        {item.patient_uhid}
                                      </Link>
                                    </td>
                                    <td className="table-small">
                                      {item.tp_id}
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
                                      {moment(
                                        item.appointment_dateTime?.split("T")[0]
                                      ).format("DD-MM-YYYY")}{" "}
                                      {moment(
                                        item.appointment_dateTime?.split(
                                          "T"
                                        )[1],
                                        "HH:mm"
                                      ).format("hh:mm A")}
                                    </td>
                                    <td>{item.appointment_status}</td>
                                    <td>{item.cancel_reason}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <PaginationContainer>
                            <ReactPaginate
                              previousLabel={"previous"}
                              nextLabel={"next"}
                              breakLabel={"..."}
                              pageCount={totalPages}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={5}
                              onPageChange={handlePageChange}
                              containerClassName={"pagination"}
                              activeClassName={"active"}
                            />
                          </PaginationContainer>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Popup for updating appointment details */}
          <div className={`popup-container${showPopup ? " active" : ""}`}>
            <div className="popup">
              <h2>Update Appointment Details</h2>
              <form className="d-flex flex-column">
                <div className="d-flex">
                  <div className="d-flex flex-column input-group mb-3">
                    <label htmlFor="">Select Branch</label>
                    <select type="text" className="rounded p-1">
                      <option value={branch.name}>{branch.name}</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="input-group mb-3">
                    <label htmlFor="">Updated by</label>
                    <input
                      type="text"
                      placeholder="updated by"
                      className="rounded p-1 w-100"
                      name="updatedBy"
                      value={updateData.updatedBy}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group mb-3 mx-2">
                    <label htmlFor="">Appointment Status</label>
                    <input
                      type="text"
                      placeholder="update Patient Name"
                      className="rounded p-1 w-100"
                      name="appointment_status"
                      value={updateData.appointment_status}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-evenly">
                  <button type="submit" className="btn btn-success mt-2">
                    update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={closeUpdatePopup}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Apointment;
const Container = styled.div`
  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
  }

  .popup-container.active {
    display: flex;
    background-color: #00000075;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  th {
    background-color: #004aad;
    color: white;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  label {
    font-weight: bold;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;

    ul {
      display: flex;
      justify-content: space-between;
      gap: 15px;

      li {
        list-style: none;
        background-color: #000;
      }
    }
  }

  input::placeholder {
    color: #aaa;
    opacity: 1; /* Ensure placeholder is visible */
    font-size: 1.2rem;
    transition: color 0.3s ease;
  }

  input:focus::placeholder {
    color: transparent; /* Hide placeholder on focus */
  }

  input {
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    @media (min-width: 1280px) and (max-width: 2000px) {
      width: 50%;
    }
    @media (min-width: 1024px) and (max-width: 1279px) {
      width: 50%;
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 50%;
    }
  }

  input:focus {
    border-color: #007bff; /* Change border color on focus */
  }
`;

const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    display: block;
    padding: 8px 16px;
    border: 1px solid #e6ecf1;
    color: #007bff;
    cursor: pointer;
    /* background-color: #004aad0a; */
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
  }

  .pagination li.active a {
    background-color: #004aad;
    color: white;
    border: 1px solid #004aad;
    border-radius: 5px;
  }

  .pagination li.disabled a {
    color: white;
    cursor: not-allowed;
    border-radius: 5px;
    background-color: #3a4e69;
    border: 1px solid #3a4e69;
  }

  .pagination li a:hover:not(.active) {
    background-color: #004aad;
    color: white;
    border-radius: 5px;
    border: 1px solid #004aad;
  }
`;
