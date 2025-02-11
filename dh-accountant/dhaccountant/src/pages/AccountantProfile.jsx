import React, { useState } from "react";
import styled from "styled-components";
// import Card from "../Card";
import { useLocation, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
// import BranchSelector from "../../BranchSelector";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import Header from "../components/Header";
import Sider from "../components/Sider";
import moment from "moment";

const AccountantProfile = () => {
  //   const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = user.token;
  console.log(token);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = user.branch;
  //   console.log(`User Name: ${branch?.name}`);
  const { eid } = useParams();
  const location = useLocation();
  const [empData, setEmpData] = useState([]);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [empProfilePicture, setEmpProfilePicture] = useState(null);
  const [inEmpData, setInEmpData] = useState({
    branch: "",
    empName: "",
    empMobile: "",
    empGender: "",
    empEmail: "",
    empDesignation: "",
    empSalary: "",
    empAddress: "",
    status: "",
    morningShiftStartTime: "",
    morningShiftEndTime: "",
    eveningShiftStartTime: "",
    eveningShiftEndTime: "",
    allDayShiftStartTime: "",
    allDayShiftEndTime: "",
    working_days: "",
    password: "",
    empRole: [],
    availability: "",
  });

  const handleEmpProfilePicture = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      // Read the selected file as data URL
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setEmpProfilePicture({
          file: selectedFile,
          imageUrl: reader.result,
        });
      };
    }
  };

  console.log(empProfilePicture);
  console.log(inEmpData);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setInEmpData((prevEmpData) => ({
        ...prevEmpData,
        [name]: checked
          ? [...prevEmpData[name], value]
          : prevEmpData[name].filter((item) => item !== value),
      }));
    } else {
      setInEmpData((prevEmpData) => ({
        ...prevEmpData,
        [name]: value,
      }));
    }
  };

  const handleCheckChange = (event) => {
    const { name, checked } = event.target;

    setInEmpData((prevEmpData) => ({
      ...prevEmpData,
      empRole: checked
        ? [...prevEmpData.empRole, name]
        : prevEmpData.empRole.filter((role) => role !== name),
    }));
  };

  console.log(eid);
  const goBack = () => {
    window.history.go(-1);
  };

  const openEditEmployeePopup = (index, item) => {
    // setSelectedItem(item);
    console.log("open pop up");
    setShowEditEmployee(true);
  };

  const closeUpdatePopup = () => {
    setShowEditEmployee(false);
  };

  const getEmployeeData = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getEmployeeDetails/${branch}/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setEmpData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    getEmployeeData();
  }, []);

  console.log(empData);

  //   const editEmployeeData = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const formData = new FormData();
  //       // Append user.data fields to formData
  //       for (const key in inEmpData) {
  //         formData.append(key, inEmpData[key]);
  //       }
  //       formData.append("empProfilePicture", empProfilePicture?.file);
  //       console.log(inEmpData, empProfilePicture);

  //       const response = await axios.put(
  //         `https://dentalguruadmin.doaguru.com//api/v1/admin/editEmployeeDetails/${branch?.name}/${user.id}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       console.log(response);
  //       cogoToast.success("data updated successfuly");
  //       closeUpdatePopup();
  //       //   getEmployeeData();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  return (
    <>
      <Container>
        <div className="header">
          <Header />
        </div>
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div
                className="col-xxl-1 col-xl-1 col-lg-1 col-md-2 col-sm-2 p-0"
                id="hd"
              >
                <Sider />
              </div>
              <div
                className="col-xxl-11 col-xl-11 col-lg-11 col-md-10 col-sm-10"
                id="set"
              >
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    {/* <BranchSelector /> */}
                  </div>
                </div>
                <div className="container-fluid mt-4">
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                  {/* <Card /> */}
                </div>
                <div className="container shadow mt-5 bg-body rounded">
                  <div className="row">
                    <div className="col-lg-12 col-md-11 col-12">
                      <div className="text-start p-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            {" "}
                            <h3>Employee Profile</h3>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <img
                        src={empData[0]?.employee_picture}
                        alt="doctor-profile"
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-lg-8">
                      <div className="row g-3">
                        <div className="col-lg-4">
                          <label className="text-color">Employee ID</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.employee_ID}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Employee Name</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.employee_name}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Email</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0 ptext">
                              {empData[0]?.employee_email}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Gender</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.gender}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Mobile Number</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.employee_mobile}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Address</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.address}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Designation</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {empData[0]?.employee_designation}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Salary</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.salary}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Status</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.employee_status}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Availability</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">{empData[0]?.availability}</p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            Morning Shift Start Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {/* {empData[0]?.morning_shift_start_time
                                ? empData[0]?.morning_shift_start_time
                                : " - "} */}
                              {moment(
                                empData[0]?.morning_shift_start_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("h:mm A")}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            Morning Shift End Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {/* {empData[0]?.morning_shift_end_time
                                ? empData[0]?.morning_shift_end_time
                                : " - "} */}
                              {moment(
                                empData[0]?.morning_shift_end_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("h:mm A")}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            Evening Shift Start Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {/* {empData[0]?.evening_shift_start_time
                                ? empData[0]?.evening_shift_start_time
                                : " - "} */}
                              {moment(
                                empData[0]?.evening_shift_start_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("h:mm A")}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            Evening Shift End Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {/* {empData[0]?.evening_shift_end_time
                                ? empData[0]?.evening_shift_end_time
                                : " - "} */}
                              {moment(
                                empData[0]?.evening_shift_end_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("h:mm A")}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            All Day Shift Start Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {
                                empData[0]?.allday_shift_start_time?.split(
                                  "."
                                )[0]
                              }
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">
                            All Day Shift End Time
                          </label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {empData[0]?.allday_shift_end_time?.split(".")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Working Days</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {empData[0]?.working_days
                                ? empData[0]?.working_days
                                : " - "}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <label className="text-color">Employee Role</label>
                          <div className="shadow-none p-1 bg-light rounded">
                            <p className="m-0">
                              {empData[0]?.employee_role
                                ? empData[0]?.employee_role
                                : " - "}
                            </p>
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

        {/* ***************************************************************************************************** */}
        {/* other pop-up */}
        {/* pop-up for adding lab */}
        <div className={`popup-container${showEditEmployee ? " active" : ""}`}>
          <div className="popup">
            <h4 className="text-center">Edit Employee Details</h4>
            <hr />
            <form className="d-flex flex-column">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.employee_name}
                        name="empName"
                        value={inEmpData.empName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Mobile
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.employee_mobile}
                        name="empMobile"
                        value={inEmpData.empMobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Gender
                      </label>
                      <select
                        name="empGender"
                        id=""
                        class="form-control w-100"
                        value={inEmpData.empGender}
                        onChange={handleInputChange}
                      >
                        <option value="">select-option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Email
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.employee_email}
                        name="empEmail"
                        value={inEmpData.empEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Designation
                      </label>
                      <select
                        name="empDesignation"
                        id=""
                        class="form-select"
                        aria-label="Default select example"
                        value={inEmpData.empDesignation}
                        onChange={handleInputChange}
                      >
                        <option value="">select-designation</option>
                        <option value="admin">Admin</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="consultant">Consultant</option>
                        <option value="helper">Helper</option>
                        <option value="lab attendant">Lab Attendent</option>
                        <option value="doctor">Doctor</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Salary
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.salary}
                        name="empSalary"
                        value={inEmpData.empSalary}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Address
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.address}
                        name="empAddress"
                        value={inEmpData.empAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Employee Status
                      </label>
                      <select
                        name="status"
                        id=""
                        class="form-select"
                        aria-label="Default select example"
                        value={inEmpData.status}
                        onChange={handleInputChange}
                      >
                        <option value="">select-status</option>
                        <option value="onboard">Onboard</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="hold">Hold</option>
                        <option value="leave">Leave</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Morning Shift Start Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="morningShiftStartTime"
                        value={inEmpData.morningShiftStartTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Morning Shift End Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="morningShiftEndTime"
                        value={inEmpData.morningShiftEndTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Evening Shift Start Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="eveningShiftStartTime"
                        value={inEmpData.eveningShiftStartTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Evening Shift End Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="eveningShiftEndTime"
                        value={inEmpData.eveningShiftEndTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        All Day Shift Start Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="allDayShiftStartTime"
                        value={inEmpData.allDayShiftStartTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        All Day Shift End Time
                      </label>
                      <input
                        type="time"
                        class="form-control"
                        id="exampleFormControlInput1"
                        name="allDayShiftEndTime"
                        value={inEmpData.allDayShiftEndTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Working Days
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder={empData[0]?.working_days}
                        name="working_days"
                        value={inEmpData.working_days}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        One Time Login Password
                      </label>
                      <input
                        type="password"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder="Employee Password"
                        name="password"
                        value={inEmpData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">
                    Employee Role
                  </label>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="admin"
                      value={inEmpData.empRole}
                      onChange={handleCheckChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Admin
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="receptionist"
                      value={inEmpData.empRole}
                      onChange={handleCheckChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Receptionist
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="consultant"
                      value={inEmpData.empRole}
                      onChange={handleCheckChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Consultant
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="lab attendant"
                      value={inEmpData.empRole}
                      onChange={handleCheckChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Lab Attendent
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="doctor"
                      value={inEmpData.empRole}
                      onChange={handleCheckChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Doctor
                    </label>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Upload Employee Profile Picture
                    </label>
                    <input
                      type="file"
                      class="p-1 w-100 rounded"
                      placeholder="available stock"
                      accept=".pdf, .jpg, .jpeg, .png"
                      name="empProfilePicture"
                      onChange={handleEmpProfilePicture}
                    />
                  </div>
                  <div className="mb-3 mx-2">
                    {empProfilePicture ? (
                      <img
                        src={empProfilePicture.imageUrl}
                        alt="profile"
                        className="imgData"
                      />
                    ) : (
                      <img
                        src={empData[0]?.employee_picture}
                        alt="profile"
                        className="imgData"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success mt-2">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 mx-2"
                  onClick={closeUpdatePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* pop-up for adding lab */}
        {/* ************************************************************************************* */}
      </Container>
    </>
  );
};

export default AccountantProfile;
const Container = styled.div`
  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow: scroll;
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
    height: auto;
    width: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .text-color {
    font-size: 1.2rem;
    font-weight: 600;
    color: #201658;
  }

  p {
    @media screen and (min-width: 1024px) and (max-width: 1280px) {
      font-size: 10px;
    }
    @media screen and (min-width: 1281px) and (max-width: 1492px) {
      font-size: 12px;
    }
  }
  .ptext {
    font-size: 15px;
    @media screen and (min-width: 1024px) and (max-width: 1280px) {
      font-size: 11px;
    }
    @media screen and (min-width: 1281px) and (max-width: 1492px) {
      font-size: 13px;
    }
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .imgData {
    height: 8rem;
    width: auto;
  }

  #set {
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      width: 85%;
      margin-left: 3.5rem;
    }
    @media screen and (min-width: 1021px) and (max-width: 1085px) {
      margin-left: 1.1rem;
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
      margin-left: -1.5rem;
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
