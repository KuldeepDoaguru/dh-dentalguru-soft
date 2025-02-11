import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sider from "../Sider";
import BranchDetails from "../BranchDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import animationData from "../../pages/loading-effect.json";
import Lottie from "react-lottie";

const PatientsPaid = () => {
  const user = useSelector((state) => state.user);
  const token = user.token;
  console.log(token);
  console.log(
    `User Name: ${user.name}, User ID: ${user.id}, branch: ${user.branch}`
  );
  console.log("User State:", user);
  const [paidList, setPaidList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const getBillPaidList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/paidBillLIst/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setPaidList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(paidList);
  const filterForPaidBills = paidList?.filter((item) => {
    return item.payment_status === "paid";
  });

  console.log(filterForPaidBills);
  console.log(filterForPaidBills.length);

  useEffect(() => {
    getBillPaidList();
  }, []);

  const filteredItems = filterForPaidBills.filter((row) => {
    const keywordTrimmed = keyword.trim().toLowerCase();
    const patientName = row?.patient_name?.toLowerCase();
    const mobileno = row?.patient_mobile;
    const uhid = row?.uhid?.toLowerCase();
    const doctorName = row?.assigned_doctor_name?.toLowerCase();

    return (
      // (patientName && patientName.includes(keywordTrimmed)) ||
      // (mobileno && mobileno.includes(keywordTrimmed)) ||
      // (uhid && uhid.includes(keywordTrimmed))) &&
      // (selectedDoctor === "" ||doctorName.includes(selectedDoctor.toLowerCase())
      ((patientName && patientName.includes(keywordTrimmed)) ||
        (mobileno && mobileno.includes(keywordTrimmed)) ||
        (uhid && uhid.includes(keywordTrimmed))) &&
      (selectedDoctor === "" ||
        doctorName.includes(selectedDoctor.toLowerCase()))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // const nextPage = () => {
  //   setCurrentPage((prevPage) => prevPage + 1);
  // };

  // const prevPage = () => {
  //   setCurrentPage((prevPage) => prevPage - 1);
  // };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getDoctorsList = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-doctors/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctors(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorsList();
  }, []);

  console.log(doctors);

  return (
    <>
      <Container>
        {/* <div className="header">
          <Header />
        </div>
        <div className="main">
          <div className="container-fluid">
            <div className="row d-flex justify-content-between">
              <div
                className="col-xxl-1 col-xl-1 col-lg-1 col-md-2 col-sm-2 p-0"
                id="hd"
              >
                <Sider />
              </div>
              <div
                className="col-xxl-11 col-xl-11 col-lg-11 col-md-10 col-sm-10"
                id="set"
              > */}
        <div className="container-fluid">
          <div className="row flex-nowrap ">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-12 ps-0">
              {/* <BranchDetails /> */}
              <div className="container mt-3">
                <h2 className="text-center">Patients Paid Data</h2>
                <div className="container mt-5">
                  <div className="row">
                    <div>
                      <h5>Total Patients - {filterForPaidBills.length}</h5>
                    </div>
                    <div className="container-fluid" id="cont">
                      <div className="col-6">
                        <input
                          type="text"
                          placeholder="Search Patient Name / UHID / Mobile No."
                          className="p-1 rounded input"
                          value={keyword}
                          // onChange={(e) =>
                          //   setKeyword(e.target.value.toLowerCase())
                          // }
                          onChange={(e) => {
                            setKeyword(e.target.value.toLowerCase());
                            setCurrentPage(1);
                          }}
                        />
                      </div>

                      <div className="col-6 d-flex justify-content-end">
                        <select
                          className="p-1 rounded input"
                          value={selectedDoctor}
                          onChange={(e) => {
                            setSelectedDoctor(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="">All Doctors</option>
                          {doctors.map((doctor) => (
                            <option
                              key={doctor.sr_id}
                              value={doctor.employee_name}
                            >
                              {doctor.employee_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="table-responsive rounded mt-4">
                    {loading ? (
                      <Lottie
                        options={defaultOptions}
                        height={300}
                        width={400}
                      />
                    ) : (
                      <>
                        <table class="table table-bordered rounded shadow">
                          <thead className="table-head">
                            <tr>
                              <th className="sticky">Bill ID</th>
                              <th className="sticky">Bill Date</th>
                              <th className="sticky">TPID</th>
                              <th className="sticky"> UHID</th>
                              <th className="sticky">Patient Name</th>
                              <th className="sticky">Patient No</th>
                              <th className="sticky">Doctor Name</th>
                              <th className="sticky">Total Amount</th>
                              <th className="sticky">Paid By Direct Amount</th>
                              <th className="sticky">Paid By Secuirty Amt</th>
                              <th className="sticky">Payment Date</th>
                              <th className="sticky">Payment Status</th>
                              <th className="sticky">Action</th>
                            </tr>
                          </thead>
                          {currentItems?.length === 0 ? (
                            <div className="text-center fs-4 nodata">
                              <p> No data found</p>
                            </div>
                          ) : (
                            <tbody>
                              {currentItems?.map((item) => (
                                <>
                                  <tr className="table-row">
                                    <td>{item.bill_id}</td>
                                    <td>
                                      {/* {moment(
                                                item.bill_date?.split("T")[0],
                                                "YYYY-MM-DD"
                                              ).format("DD/MM/YYYY")} */}
                                      {item.bill_date
                                        ? moment(
                                            item.bill_date,
                                            "DD-MM-YYYYTHH:mm:ss"
                                          ).format("DD/MM/YYYY hh:mm A")
                                        : ""}
                                    </td>
                                    <td>{item.tp_id}</td>
                                    <td>
                                      <Link
                                        to={`/patient_profile/${item.uhid}`}
                                      >
                                        {item.uhid}
                                      </Link>
                                    </td>
                                    <td className="text-capitalize">
                                      {item.patient_name}
                                    </td>
                                    <td>{item.patient_mobile}</td>
                                    <td className="text-capitalize">{`Dr. ${item.assigned_doctor_name}`}</td>
                                    <td>{item.total_amount}</td>
                                    <td>{item.paid_amount}</td>
                                    <td>{item.pay_by_sec_amt}</td>
                                    <td>
                                      {/* {moment(
                                                item.payment_date_time?.split(
                                                  "T"
                                                )[0],
                                                "YYYY-MM-DD"
                                              ).format("DD/MM/YYYY")} */}

                                      {item.payment_date_time
                                        ? moment(
                                            item.payment_date_time,
                                            "DD-MM-YYYYTHH:mm:ss"
                                          ).format("DD/MM/YYYY")
                                        : ""}
                                    </td>
                                    <td className="text-capitalize">
                                      {item.payment_status}
                                    </td>
                                    <td>
                                      <Link
                                        // to={`/PatintPaidPaymentPrint/${item.bill_id}`}
                                        to={`/patient-bill/${item.bill_id}/${item.tp_id}`}
                                      >
                                        <button className="btn btn-warning">
                                          View Invoice
                                        </button>
                                      </Link>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </>
                    )}
                  </div>
                  <div className="d-flex justify-content-center mt-3 mb-3">
                    <button
                      className="btn btn-primary mx-2"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      Previous Page
                    </button>
                    <button
                      className="btn btn-primary mx-2"
                      onClick={nextPage}
                      disabled={indexOfLastItem >= filterForPaidBills.length}
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div>
            </div>
          </div>
        </div> */}
      </Container>
    </>
  );
};

export default PatientsPaid;

const Container = styled.div`
  .table-responsive {
    /* height: 30rem; */
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
  .input::placeholder {
    color: #aaa;
    opacity: 1; /* Ensure placeholder is visible */
    font-size: 1rem;
    transition: color 0.3s ease;
  }

  .input:focus::placeholder {
    color: transparent; /* Hide placeholder on focus */
  }

  .input {
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    @media (min-width: 1024px) and (max-width: 1280px) {
      width: 28%;
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 38%;
    }
  }

  .input:focus {
    border-color: #007bff; /* Change border color on focus */
  }

  .nodata {
    white-space: nowrap;
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
  #cont {
    display: flex;
    @media screen and (max-width: 768px) {
      /* flex-direction: column; */
      gap: 1rem;
    }
  }
`;
