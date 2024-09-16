import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import BranchDetails from "../components/BranchDetails";

const SittingReport = () => {
  const user = useSelector((state) => state.user);
  console.log("User State:", user);
  const token = user.token;
  console.log(token);
  const [treatAmount, setTreatAmount] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewTreatAmount, setViewTreatAmount] = useState([]);

  const getTreatmentAmt = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getSittingBillData/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTreatAmount(data.result);
      setViewTreatAmount(data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTreatmentAmt();
  }, []);

  const handleRefresh = (e) => {
    e.preventDefault();
    setFromDate("");
    setToDate("");
    setViewTreatAmount(treatAmount);
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

    if (!validateDateRange()) {
      return;
    }

    // const filteredData = treatAmount.filter((item) => {
    //   const date = moment(item.date).format("DD-MM-YYYY");
    //   return moment(date).isBetween(fromDate, toDate, null, "[]");
    // });

    const filteredData = treatAmount.filter((item) => {
      const itemDate = moment(item.date, "DD-MM-YYYY HH:mm:ss").format(
        "YYYY-MM-DD"
      );
      console.log(
        `Checking item date: ${itemDate}, from: ${fromDate}, to: ${toDate}`
      );
      return moment(itemDate).isBetween(fromDate, toDate, null, "[]");
    });
    setViewTreatAmount(filteredData);
  };

  //   const handleDownload = (e) => {
  //     e.preventDefault();
  //     // if (!fromDate || !toDate) {
  //     //   alert("Please select Date");
  //     //   return;
  //     // }

  //     if (!validateDateRange()) {
  //       return;
  //     }

  //     const filteredData = treatAmount.filter((item) => {
  //       const date = moment(item.date).format("DD-MM-YYYY");
  //       return moment(date).isBetween(fromDate, toDate, null, "[]");
  //     });

  //     const formattedData = filteredData.map((item) => ({
  //       Branch: item.branch_name,
  //       TPID: item.tp_id,
  //       UHID: item.uhid,
  //       "Patient Name": item.patient_name,
  //       DOB: item.dob,
  //       Age: item.age,
  //       Contact: item.mobileno,
  //       Gender: item.gender,
  //       "Doctor Name": item.doctor_name,
  //       "Doctor ID": item.doctor_id,
  //       "Sitting No.": item.sitting_number,
  //       Treatment: item.treatment,
  //       "Teeth No.": item.teeth_number,
  //       "Teeth QTY": item.teeth_qty,
  //       "Treatment Cost": item.treatment_cost,
  //       "Cost Per QTY": item.cost_per_qty,
  //       Discount: item.discount,
  //       "Final Cost": item.final_cost,
  //       "Sitting Amt": item.sitting_amount,
  //       "Paid Amt": item.paid_amount,
  //       "Pending Amt": item.pending_amount,
  //       "Pay Direct": item.pay_direct,
  //       "Pay By Security Amt": item.pay_security_amount,
  //       "Pending Sitting Amt": item.pending_sitting_amount,
  //       "Payment Mode": item.payment_mode,
  //       "Payment Status": item.payment_status,
  //       Note: item.note,
  //       Date: moment(item.date, "DD-MM-YYYY HH:mm:ss").format(
  //         "DD-MM-YYYY h:mm A"
  //       ),
  //       // Add more fields as needed
  //     }));

  //     const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, worksheet, "Report");
  //     XLSX.writeFile(wb, "SittingData.xlsx");
  //   };

  const handleDownload = (e) => {
    e.preventDefault();

    if (!validateDateRange()) {
      return;
    }

    const filteredData = treatAmount.filter((item) => {
      const itemDate = moment(item.date, "DD-MM-YYYY HH:mm:ss").format(
        "YYYY-MM-DD"
      );
      console.log(
        `Checking item date: ${itemDate}, from: ${fromDate}, to: ${toDate}`
      );
      return moment(itemDate).isBetween(fromDate, toDate, null, "[]");
    });

    console.log("Filtered Data for Download:", filteredData);

    const formattedData = filteredData.map((item) => ({
      Branch: item.branch_name,
      TPID: item.tp_id,
      UHID: item.uhid,
      "Patient Name": item.patient_name,
      DOB: item.dob,
      Age: item.age,
      Contact: item.mobileno,
      Gender: item.gender,
      "Doctor Name": item.doctor_name,
      "Doctor ID": item.doctor_id,
      "Sitting No.": item.sitting_number,
      Treatment: item.treatment,
      "Teeth No.": item.teeth_number,
      "Teeth QTY": item.teeth_qty,
      "Treatment Cost": item.treatment_cost,
      "Cost Per QTY": item.cost_per_qty,
      Discount: item.discount,
      "Final Cost": item.final_cost,
      "Sitting Amt": item.sitting_amount,
      "Paid Amt": item.paid_amount,
      "Pending Amt": item.pending_amount,
      "Pay Direct": item.pay_direct,
      "Pay By Security Amt": item.pay_security_amount,
      "Pending Sitting Amt": item.pending_sitting_amount,
      "Payment Mode": item.payment_mode,
      "Payment Status": item.payment_status,
      Note: item.note,
      Date: moment(item.date, "DD-MM-YYYY HH:mm:ss").format(
        "DD-MM-YYYY h:mm A"
      ),
    }));

    console.log("Formatted Data for Excel:", formattedData);

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Report");
    XLSX.writeFile(wb, "SittingData.xlsx");
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
                            <h2 className="">Sitting Bill Reports</h2>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <div class="mt-4">
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
                    <div className="container-fluid mt-1 rounded">
                      <div class="table-responsive rounded mb-5">
                        <table class="table table-bordered rounded shadow">
                          <thead className="table-head">
                            <tr>
                              <th className="sticky">Sr.No</th>
                              <th className="sticky">Branch</th>
                              <th className="sticky">TPID</th>
                              <th className="sticky">UHID</th>
                              <th className="sticky">Patient Name</th>
                              <th className="sticky">DOB</th>
                              <th className="sticky">Age</th>
                              <th className="sticky">Contact</th>
                              <th className="sticky">Gender</th>
                              <th className="sticky">Doctor Name</th>
                              <th className="sticky">Doctor ID</th>
                              <th className="sticky">Sitting No.</th>
                              <th className="sticky">Treatment</th>
                              <th className="sticky">Teeth No.</th>
                              <th className="sticky">Teeth QTY</th>
                              <th className="sticky">Treatment Cost</th>
                              <th className="sticky">Cost Per QTY</th>
                              <th className="sticky">Discount</th>
                              <th className="sticky">Final Cost</th>
                              <th className="sticky">Sitting Amt</th>
                              <th className="sticky">Paid Amt</th>
                              <th className="sticky">Pending Amt</th>
                              <th className="sticky">Pay Direct</th>
                              <th className="sticky">Pay By Security Amt</th>
                              <th className="sticky">Pending Sitting Amt</th>
                              <th className="sticky">Payment Mode</th>
                              <th className="sticky">Payment Status</th>
                              <th className="sticky">Note</th>
                              <th className="sticky">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewTreatAmount?.map((item, index) => (
                              <>
                                <tr className="table-row">
                                  <td>{index + 1}</td>
                                  <td>{item.branch_name}</td>
                                  <td>{item.tp_id}</td>
                                  <td>{item.uhid}</td>
                                  <td>{item.patient_name}</td>
                                  <td>{item.dob}</td>
                                  <td>{item.age}</td>
                                  <td>{item.mobileno}</td>
                                  <td>{item.gender}</td>
                                  <td>{item.doctor_name}</td>
                                  <td>{item.doctor_id}</td>
                                  <td>{item.sitting_number}</td>
                                  <td>{item.treatment}</td>
                                  <td>{item.teeth_number}</td>
                                  <td>{item.teeth_qty}</td>
                                  <td>{item.treatment_cost}</td>
                                  <td>{item.cost_per_qty}</td>
                                  {/* <td>{item.date?.split("T")[0]}</td> */}
                                  <td>{item.discount}</td>
                                  <td>{item.final_cost}</td>
                                  <td>{item.sitting_amount}</td>
                                  <td>{item.paid_amount}</td>
                                  <td>{item.pending_amount}</td>
                                  <td>{item.pay_direct}</td>
                                  <td>{item.pay_security_amount}</td>
                                  <td>{item.pending_sitting_amount}</td>
                                  <td>{item.payment_mode}</td>
                                  <td>{item.payment_status}</td>
                                  <td>{item.note}</td>
                                  <td>
                                    {moment(
                                      item.date,
                                      "DD-MM-YYYY HH:mm:ss"
                                    ).format("DD-MM-YYYY h:mm A")}
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
          </div>
        </div>
      </Container>
    </>
  );
};

export default SittingReport;
const Container = styled.div`
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
