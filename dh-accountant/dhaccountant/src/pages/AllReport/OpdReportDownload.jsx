import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import Header from "../../components/Header";
import Sider from "../../components/Sider";
import BranchDetails from "../../components/BranchDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";

const OpdReportDownload = () => {
  const user = useSelector((state) => state.user);
  console.log("User State:", user);
  const token = user.token;
  console.log(token);
  const [opdAmount, setOpdAmount] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getOpdAmt = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getAppointmentData/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpdAmount(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOpdAmt();
  }, []);

  const [filterOpdBills, setFilterForOpdBills] = useState([]);
  const [viewPatBill, setViewPatBill] = useState([]);

  const filterdata = () => {
    const filterBills = opdAmount?.filter((item) => {
      return item.treatment_provided === "OPD";
    });
    setFilterForOpdBills(filterBills);
    setViewPatBill(filterBills);
  };

  console.log(viewPatBill);
  useEffect(() => {
    filterdata();
  }, [opdAmount]);

  const handleRefresh = (e) => {
    e.preventDefault();
    setFromDate("");
    setToDate("");
    setViewPatBill(filterOpdBills);
  };

  const validateDateRange = () => {
    if (!fromDate || !toDate) {
      alert("Please select Date");
      return false;
    }
    const start = moment(fromDate);
    const end = moment(toDate);
    const diff = end.diff(start, "days");
    if (diff > 30) {
      alert("The date range should not exceed 30 days");
      return false;
    }
    return true;
  };

  const handleView = (e) => {
    e.preventDefault();
    // if (!fromDate || !toDate) {
    //   alert("Please select Date");
    //   return;
    // }

    if (!validateDateRange()) {
      return;
    }

    const filteredData = filterOpdBills.filter((item) => {
      const date = moment(item.appointment_dateTime).format("YYYY-MM-DD");
      return moment(date).isBetween(fromDate, toDate, null, "[]");
    });
    setViewPatBill(filteredData);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    // if (!fromDate || !toDate) {
    //   alert("Please select Date");
    //   return;
    // }

    if (!validateDateRange()) {
      return;
    }

    const filteredData = filterOpdBills.filter((item) => {
      const date = moment(item.appointment_dateTime).format("YYYY-MM-DD");
      return moment(date).isBetween(fromDate, toDate, null, "[]");
    });

    const formattedData = filteredData.map((item) => ({
      "Appointment ID": item.appoint_id,
      "Appointment Date": moment(item.appointment_dateTime).format(
        "YYYY-MM-DD h:mm A"
      ),
      "Patient UHID": item.uhid,
      "Patient Name": item.patient_name,
      Contact: item.mobileno,
      "Doctor Name": item.assigned_doctor_name,
      "Doctor ID": item.assigned_doctor_id,
      "Consultation Fee": item.opd_amount,
      "Payment Mode": item.payment_Mode,
      "Payment Status": item.payment_Status,
      // Add more fields as needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Report");
    XLSX.writeFile(wb, "opdReport.xlsx");
  };

  const goBack = () => {
    window.history.go(-1);
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
                  <div className="">
                    <BranchDetails />
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  {/* <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button> */}
                  <div className="container-fluid">
                    <div className="row mt-3">
                      {/* <div className="col-1"></div> */}

                      <div className="col-12">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                          <div class="container d-flex justify-content-center">
                            <h2 className="">OPD Income Reports</h2>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <div class=" mt-4">
                    <div className="d-flex justify-content-center mb-2">
                      <form>
                        <div className="d-flex justify-content-between">
                          <div>
                            <input
                              type="date"
                              name=""
                              id=""
                              className="p-2 rounded"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                          </div>
                          <div className="mx-2">To</div>
                          <div>
                            <input
                              type="date"
                              name=""
                              id=""
                              className="p-2 rounded"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                          <button
                            className="btn btn-info mx-2"
                            onClick={(e) => handleView(e)}
                          >
                            View Report
                          </button>
                          <button
                            className="btn btn-primary mx-2"
                            onClick={(e) => handleRefresh(e)}
                          >
                            Clear
                          </button>
                          <button
                            className="btn btn-warning mx-2"
                            onClick={(e) => handleDownload(e)}
                          >
                            Download Report
                          </button>
                        </div>
                      </form>
                    </div>

                    <div class="table-responsive rounded">
                      <table class="table table-bordered rounded shadow">
                        <thead className="table-head">
                          <tr>
                            <th className="sticky">Appointment ID</th>
                            <th className="sticky">Appointment Date</th>
                            <th className="sticky">Patient UHID</th>
                            <th className="sticky">Patient Name</th>
                            <th className="sticky">Contact</th>
                            <th className="sticky">Doctor Name</th>
                            <th className="sticky">Doctor ID</th>
                            <th className="sticky">Consultation Fee</th>
                            <th className="sticky">Payment Mode</th>
                            <th className="sticky">Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewPatBill?.map((item) => (
                            <>
                              <tr className="table-row">
                                <td>{item.appoint_id}</td>
                                <td>
                                  {item.appointment_dateTime
                                    ? moment(
                                        item?.appointment_dateTime,
                                        "YYYY-MM-DDTHH:mm"
                                      ).format("DD/MM/YYYY hh:mm A")
                                    : ""}
                                </td>
                                <td>{item.uhid}</td>
                                <td>{item.patient_name}</td>
                                <td>{item.mobileno}</td>
                                <td>{item.assigned_doctor_name}</td>
                                <td>{item.assigned_doctor_id}</td>
                                <td>{item.opd_amount}</td>
                                <td>{item.payment_Mode}</td>
                                <td>{item.payment_Status}</td>
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
        </div>
      </Container>
    </>
  );
};

export default OpdReportDownload;
const Container = styled.div`
  overflow-x: hidden;
  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .table-responsive {
    height: 30rem;
    overflow: auto;
  }

  th {
    background-color: #201658;
    color: #fff;
    font-weight: bold;
    position: sticky;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
  .set {
    @media screen and (max-width: 1050px) {
      width: 85%;
      margin-left: 3rem;
    }
    @media screen and (min-width: 768px) and (max-width: 900px) {
      width: 85%;
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
