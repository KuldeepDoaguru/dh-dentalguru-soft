import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sider from "../../../components/Sider";
import Header from "../../../components/Header";
import { FaSearch } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import BranchSelector from "../../../components/BranchSelector";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const CalenderSetting = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const location = useLocation();
  const [showAddBlockDays, setShowAddBlockDays] = useState(false);
  const [showEditBlockDays, setShowEditBlockDays] = useState(false);
  const [brData, setBrData] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [selected, setSelected] = useState();
  const [upData, setUpData] = useState({
    open_time: "",
    close_time: "",
    appoint_slot_duration: "",
    week_off: "",
  });
  const [holidays, setHolidays] = useState({
    branch_name: branch.name,
    holiday_name: "",
    holiday_date: "",
    holiday_start_time: "",
    holiday_end_time: "",
    notes: "",
  });
  const [upHolidays, setUpHolidays] = useState({
    holiday_name: "",
    holiday_date: "",
    holiday_start_time: "",
    holiday_end_time: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "radio" && checked) {
      // For radio inputs
      setUpData({
        ...upData,
        appoint_slot_duration: value,
      });
    } else if (type === "time") {
      // For time inputs
      const updatedData = {
        ...upData,
        [name]: value,
      };

      if (name === "close_time" && value <= upData.open_time) {
        alert("Close time must be greater than open time.");
      } else {
        setUpData(updatedData);
      }
    } else {
      setUpData({
        ...upData,
        [name]: value,
      });
    }
  };

  console.log(brData);

  const ConvertToIST = (utcDateString) => {
    // Convert the date string to a Date object
    const utcDate = new Date(utcDateString);

    // Convert the UTC date to IST by adding 5 hours and 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format the IST date
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
    };
    const istDateString = new Intl.DateTimeFormat("en-IN", options).format(
      istDate
    );

    return istDateString;
  };

  const handleHoliday = (event) => {
    const { name, value } = event.target;
    if (name === "holiday_end_time" && value <= holidays.holiday_start_time) {
      alert("Holiday end time can not be less than holiday start time");
      setHolidays({
        ...holidays,
        holiday_end_time: "",
      });
    } else {
      setHolidays({
        ...holidays,
        [name]: value,
      });
    }
  };

  const handleHolidayUpdate = (event) => {
    const { name, value } = event.target;
    if (name === "holiday_end_time" && value <= upHolidays.holiday_start_time) {
      alert("Holiday end time can not be less than holiday start time");
      setUpHolidays({
        ...holidays,
        holiday_end_time: "",
      });
    } else {
      setUpHolidays({
        ...upHolidays,
        [name]: value,
      });
    }
  };

  console.log(holidays);

  const openAddBlockDaysPopup = (index, item) => {
    // setSelectedItem(item);
    console.log("open pop up");
    setShowAddBlockDays(true);
  };

  const openEditBlockDaysPopup = (id, item) => {
    console.log(id);
    setSelected(item);
    setUpHolidays({
      holiday_name: item.holiday_name,
      holiday_date: item.holiday_date,
      holiday_start_time: item.holiday_start_time,
      holiday_end_time: item.holiday_end_time,
      notes: item.notes,
    });
    console.log("open pop up");
    setShowEditBlockDays(true);
  };

  const closeUpdatePopup = () => {
    setShowAddBlockDays(false);
    setShowEditBlockDays(false);
    setHolidays({
      branch_name: branch.name,
      holiday_name: "",
      holiday_date: "",
      holiday_start_time: "",
      holiday_end_time: "",
      notes: "",
    });
  };

  const goBack = () => {
    window.history.go(-1);
  };

  const getBranchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getBranchDetailsByBranch/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setBrData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBranchDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/updateBranchCalenderSetting/${branch.name}`,
        upData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      getBranchDetails();
      cogoToast.success("branch details updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchDetails();
  }, []);

  // Convert UTC date to IST date
  const convertToIST = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format the date to YYYY-MM-DD for input field
    const year = istDate.getUTCFullYear();
    const month = `0${istDate.getUTCMonth() + 1}`.slice(-2); // months are zero-based
    const day = `0${istDate.getUTCDate() + 1}`.slice(-2);

    return `${year}-${month}-${day}`;
  };

  // const convertToIST = (utcDateString) => {
  //   const utcDate = new Date(utcDateString);
  //   const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  //   const istDate = new Date(utcDate.getTime() + istOffset);
  //   return istDate;
  // };

  console.log(selected);

  useEffect(() => {
    if (selected) {
      console.log("UTC Date:", selected.holiday_date);
      // Format the date and time fields correctly
      // const istDate = convertToIST(selected.holiday_date);
      // const formattedDate = istDate.toISOString().split("T")[0];
      const formattedDate = convertToIST(selected.holiday_date);
      // const formattedDate =  new Date(selected.holiday_date).toISOString().split("T")[0];
      const formattedStartTime = selected.holiday_start_time.slice(0, 5);
      const formattedEndTime = selected.holiday_end_time.slice(0, 5);
      console.log("Formatted Date:", formattedDate);
      setUpHolidays({
        ...upHolidays,
        holiday_name: selected.holiday_name || "",
        holiday_date: formattedDate || "",
        holiday_start_time: formattedStartTime || "",
        holiday_end_time: formattedEndTime || "",
        notes: selected.notes || "",
      });
    }
  }, [selected]);

  console.log(selected);
  console.log(upData);

  const getHolidayList = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getHolidays/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setHolidayList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addHolidays = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/addBlockDays",
        holidays,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(response);
      cogoToast.success("Holiday Added Successfully");
      setHolidays({
        branch_name: branch.name,
        holiday_name: "",
        holiday_date: "",
        holiday_start_time: "",
        holiday_end_time: "",
        notes: "",
      });
      closeUpdatePopup();
      getHolidayList();
    } catch (error) {
      console.log(error);
      cogoToast.error(error.response.data);
    }
  };

  const updateHolidetails = async (e) => {
    e.preventDefault();
    console.log(selected);
    try {
      const response = await axios.put(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/updateHolidays/${selected.holiday_id}`,
        upHolidays,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Holiday Added Successfully");
      closeUpdatePopup();
      getHolidayList();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selected);

  const deleteHoliday = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels the action
    }
    try {
      const response = await axios.delete(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/deleteHolidays/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Holiday Deleted Successfully");
      getHolidayList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHolidayList();
  }, [branch.name]);

  console.log(brData[0]?.week_off);

  console.log(holidayList);
  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

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
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                    <div>
                      {/* <Link to="/superadmin-add-branch">
                          <button className="btn btn-success">
                            Add Branch
                          </button>
                        </Link> */}
                    </div>
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                  <div className="banner-mid mt-2">
                    <div>
                      <h3 className="text-light text-center">
                        Clinic Settings
                      </h3>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Current Timing :{" "}
                      <span>
                        Opening Time -{" "}
                        {moment(brData[0]?.open_time, "HH:mm:ss.SSSSSS").format(
                          "hh:mm A"
                        )}
                      </span>{" "}
                      To{" "}
                      <span>
                        {" "}
                        Closing Time -{" "}
                        {moment(
                          brData[0]?.close_time,
                          "HH:mm:ss.SSSSSS"
                        ).format("hh:mm A")}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Current Appointment Slot :{" "}
                      <span>{brData[0]?.appoint_slot_duration}</span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Current Week-off Day : <span>{brData[0]?.week_off}</span>
                    </h6>
                  </div>
                  <form onSubmit={updateBranchDetails}>
                    <div className="container calender-time">
                      <h6 className="fw-bold mx-2">Change Clinic Timing:</h6>
                      <input
                        type="time"
                        className="p-1 rounded"
                        value={upData.open_time}
                        onChange={handleChange}
                        name="open_time" // Add name attribute
                      />{" "}
                      <p className="mx-2">To</p>
                      <input
                        type="time"
                        className="p-1 rounded"
                        value={upData.close_time}
                        onChange={handleChange}
                        name="close_time" // Add name attribute
                      />
                    </div>
                    <div className="appointment-slot-time">
                      <div>
                        {" "}
                        <p className="fw-bold">Appointment Slot Time:</p>
                      </div>
                      <div className="d-flex mx-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="flexRadioDefault1" // Add id attribute
                            name="appoint_slot_duration" // Update name attribute
                            value="10 min"
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1" // Use htmlFor instead of for
                          >
                            10 min
                          </label>
                        </div>
                        <div className="form-check mx-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="flexRadioDefault2" // Add id attribute
                            name="appoint_slot_duration" // Update name attribute
                            value="15 min"
                            checked={upData.appoint_slot_duration === "15 min"} // Check based on state
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2" // Use htmlFor instead of for
                          >
                            15 min
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="flexRadioDefault3" // Add id attribute
                            name="appoint_slot_duration" // Update name attribute
                            value="30 min"
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault3" // Use htmlFor instead of for
                          >
                            30 min
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Set week-off Day :</h6>
                      <select
                        name="week_off"
                        id=""
                        onChange={handleChange}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        {weekdays.map((item) => (
                          <>
                            <option value={item}>{item}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-success mx-2">Change</button>
                    </div>
                  </form>

                  <div className="container-fluid mt-3">
                    <div className="calender-time mb-2">
                      <div>
                        <h6 className="text-dark fw-bold">
                          Block Days On Calender :
                        </h6>
                      </div>
                      <div>
                        <button
                          className="btn btn-info mx-2"
                          onClick={() => openAddBlockDaysPopup()}
                        >
                          Add Block Days
                        </button>
                      </div>
                    </div>
                    <div class="table-responsive rounded">
                      <table class="table table-bordered rounded shadow">
                        <thead className="table-head">
                          <tr>
                            <th className="table-sno sticky">Holiday Name</th>
                            <th className="table-small sticky">Date</th>
                            <th className="sticky">Start Time</th>
                            <th className="sticky">End Time</th>
                            <th className="table-small sticky">Notes</th>
                            <th className="table-small sticky">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidayList?.map((item) => (
                            <>
                              <tr className="table-row">
                                <td>{item.holiday_name}</td>
                                <td className="table-sno">
                                  {/* {item.holiday_date.split("T")[0]} */}
                                  {ConvertToIST(item.holiday_date)}
                                </td>
                                <td className="table-small">
                                  {item.holiday_start_time?.split(".")[0]}
                                </td>
                                <td className="table-small">
                                  {item.holiday_end_time?.split(".")[0]}
                                </td>
                                <td className="table-small">{item.notes}</td>

                                <td>
                                  <button
                                    className="btn btn-warning"
                                    onClick={() =>
                                      openEditBlockDaysPopup(
                                        item.holiday_id,
                                        item
                                      )
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger mx-1"
                                    onClick={() =>
                                      deleteHoliday(item.holiday_id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ***************************************************************************************************** */}
          {/* other pop-up */}
          {/* pop-up for adding lab */}
          <div
            className={`popup-container${showAddBlockDays ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Add Block Day</h4>
              <form className="d-flex flex-column" onSubmit={addHolidays}>
                <div className="row g-2">
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Name
                    </label>
                    <input
                      type="text"
                      placeholder="holiday name"
                      className="form-control rounded p-2"
                      name="holiday_name"
                      value={holidays.holiday_name}
                      onChange={handleHoliday}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Date
                    </label>
                    <input
                      type="date"
                      placeholder="select date"
                      className="form-control rounded p-2"
                      name="holiday_date"
                      value={holidays.holiday_date}
                      onChange={handleHoliday}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Start Time
                    </label>
                    <input
                      type="time"
                      placeholder="Add start time"
                      className="form-control rounded p-2"
                      name="holiday_start_time"
                      value={holidays.holiday_start_time}
                      onChange={handleHoliday}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday End Time
                    </label>
                    <input
                      type="time"
                      placeholder="Add end time"
                      className="form-control rounded p-2"
                      name="holiday_end_time"
                      value={holidays.holiday_end_time}
                      onChange={handleHoliday}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Add Notes"
                      className="form-control rounded p-2"
                      name="notes"
                      value={holidays.notes}
                      onChange={handleHoliday}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-start">
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

          {/* ***************************************************************************************************** */}
          {/* other pop-up */}
          {/* pop-up for adding lab */}
          <div
            className={`popup-container${showEditBlockDays ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Edit Drugs Details</h4>
              <form className="d-flex flex-column" onSubmit={updateHolidetails}>
                <div className="row g-2">
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Name
                    </label>
                    <input
                      type="text"
                      placeholder="holiday name"
                      className="form-control rounded p-2"
                      name="holiday_name"
                      value={upHolidays.holiday_name}
                      onChange={handleHolidayUpdate}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Date
                    </label>
                    <input
                      type="date"
                      placeholder="select date"
                      className="form-control rounded p-2"
                      name="holiday_date"
                      value={upHolidays.holiday_date}
                      onChange={handleHolidayUpdate}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday Start Time
                    </label>
                    <input
                      type="time"
                      placeholder="Add start time"
                      className="form-control rounded p-2"
                      name="holiday_start_time"
                      value={upHolidays.holiday_start_time}
                      onChange={handleHolidayUpdate}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Holiday End Time
                    </label>
                    <input
                      type="time"
                      placeholder="Add end time"
                      className="form-control rounded p-2"
                      name="holiday_end_time"
                      value={upHolidays.holiday_end_time}
                      onChange={handleHolidayUpdate}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Add Notes"
                      className="form-control rounded p-2"
                      name="notes"
                      value={upHolidays.notes}
                      onChange={handleHolidayUpdate}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-start">
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
        </div>
      </Container>
    </>
  );
};

export default CalenderSetting;
const Container = styled.div`
  .banner-mid {
    background-color: #004aad;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .calender-time {
    display: flex;
    margin-top: 1rem;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .appointment-slot-time {
    display: flex;
    margin-top: 1rem;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

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
    z-index: 2;
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
  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
  .table-responsive {
    height: 20rem;
  }
`;
