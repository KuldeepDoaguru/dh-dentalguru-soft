import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import HeaderAdmin from "./HeaderAdmin";
import SiderAdmin from "./SiderAdmin";
import animationData from "../animation/loading-effect.json";
import Lottie from "react-lottie";

const AdminPatientLIst = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const branch = user.branch_name;
  const [patList, setPatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ptype, setPtype] = useState("");
  const [keyword, setkeyword] = useState("");
  const complaintsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page

  const getPatByBranch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getPatientDetailsByBranch/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(data);
      setPatList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPatByBranch();
  }, []);

  console.log(patList);

  // const searchFilter = patList.filter((lab) =>
  //   lab.patient_name.toLowerCase().trim().includes(keyword.toLowerCase().trim())
  // );
  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  console.log(ptype);

  const uniqueDoctor = [...new Set(patList?.map((item) => item.patient_type))];

  const searchFilter = patList?.filter((lab) => {
    if (ptype && trimmedKeyword) {
      return (
        lab.patient_type === ptype &&
        (lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
          lab.uhid.toLowerCase().includes(trimmedKeyword) ||
          lab.mobileno.includes(trimmedKeyword))
      );
    } else if (ptype) {
      return lab.patient_type === ptype;
    } else if (trimmedKeyword) {
      return (
        lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
        lab.uhid.toLowerCase().includes(trimmedKeyword) ||
        lab.mobileno.includes(trimmedKeyword)
      );
    } else {
      return true;
    }
  });

  console.log(searchFilter);

  const totalPages = Math.ceil(searchFilter?.length / complaintsPerPage);

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
  }, [ptype, trimmedKeyword]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const displayedAppointments = filterAppointDataByMonth();

  return (
    <>
      <Container>
        <HeaderAdmin />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-md-1 col-1 p-0">
                <SiderAdmin />
              </div>
              <div
                className="col-lg-11 col-md-11 col-11 ps-0 mx-2 "
                style={{ marginTop: "5rem" }}
              >
                {/* <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div> */}
                <div className="container-fluid mt-3 response">
                  <h2 className="text-center">Patient Details List</h2>
                  <div className="">
                    <div className="d-flex justify-content-between align-items-center">
                      {/* <label>Patient Name :</label> */}
                      <input
                        type="text"
                        placeholder="Search Patient Name or UHID or mobile number"
                        className=""
                        value={keyword}
                        onChange={(e) =>
                          setkeyword(e.target.value.toLowerCase())
                        }
                      />
                      <p
                        className="fw-bold mx-2"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Total Patient : {patList.length}
                      </p>
                      <div className="d-flex justify-content-center align-item-center">
                        <div>
                          <h5>Filter by patient type :</h5>
                        </div>
                        <div>
                          <select
                            name=""
                            id=""
                            value={ptype}
                            onChange={(e) => setPtype(e.target.value)}
                            className="form-control mx-2"
                          >
                            <option value="">-select-</option>
                            {uniqueDoctor?.map((item) => (
                              <>
                                <option value={item}>{item}</option>
                              </>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* <button
                        className="btn btn-success"
                        // onClick={() => openAddEmployeePopup()}
                      >
                        Add Employee
                      </button> */}
                    </div>
                  </div>
                  {loading ? (
                    <Lottie
                      options={defaultOptions}
                      height={300}
                      width={400}
                    ></Lottie>
                  ) : (
                    <>
                      {displayedAppointments?.length === 0 ? (
                        <div className="mb-2 fs-4 fw-bold text-center">
                          No patient details list available
                        </div>
                      ) : (
                        <>
                          <div class="table-responsive mt-4">
                            <table class="table table-bordered">
                              <thead className="table-head">
                                <tr>
                                  <th className="thead sticky">Patient UHID</th>
                                  <th className="thead sticky">Name</th>
                                  <th className="thead sticky">Mobile</th>
                                  <th className="thead sticky">Gender</th>
                                  <th className="thead sticky">Email</th>
                                  <th className="thead sticky">
                                    Date of Birth
                                  </th>
                                  {/* <th className="thead sticky">Marital Status</th> */}
                                  <th className="thead sticky">Patient Type</th>
                                  <th className="thead sticky">Address</th>
                                  {/* <th className="thead sticky">Adhaar Number</th> */}
                                  <th
                                    className="sticky"
                                    style={{ minWidth: "10rem" }}
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayedAppointments?.map((item) => (
                                  <>
                                    <tr className="table-row">
                                      <td className="thead">
                                        <Link
                                          to={`/patient-profile/${item.uhid}`}
                                          style={{ textDecoration: "none" }}
                                        >
                                          {item.uhid}
                                        </Link>
                                      </td>
                                      <td className="thead">
                                        {item.patient_name}
                                      </td>
                                      <td className="thead">{item.mobileno}</td>
                                      <td className="thead">{item.gender}</td>
                                      <td className="thead">{item.emailid}</td>
                                      <td className="thead">{item.dob}</td>
                                      {/* <td className="thead">{item.maritalstatus}</td> */}
                                      <td className="thead">
                                        {item.patient_type}
                                      </td>
                                      <td className="thead">{item.address}</td>
                                      {/* <td className="thead">{item.adharno}</td> */}
                                      <td
                                        className=""
                                        style={{ minWidth: "10rem" }}
                                      >
                                        <div className="d-flex">
                                          <Link
                                            to={`/patient-profile/${item.uhid}`}
                                          >
                                            <button className="btn btn-warning">
                                              View Details
                                            </button>
                                          </Link>
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <PaginationContainer>
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                    />
                  </PaginationContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminPatientLIst;
const Container = styled.div`
  th {
    background-color: #1abc9c;
    color: white;
    text-align: center;
    white-space: nowrap;
  }
  td {
    text-align: center;
    white-space: nowrap;
  }

  .thead {
    min-width: 8rem;
  }

  /* .table-responsive {
    height: 30rem;
    overflow: auto;
  } */

  th {
    background-color: #1abc9c;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #1abc9c;
    color: white;
    z-index: 1;
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
    width: 30%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    @media (min-width: 1279px) and (max-width: 1600px) {
      width: 45%;
    }
    @media (min-width: 1024px) and (max-width: 1279px) {
      width: 60%;
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 100%;
    }
  }

  input:focus {
    border-color: #1abc9c;
  }
  .response {
    @media (min-width: 1024px) and (max-width: 1279px) {
      width: 95%;
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 90%;
      margin-left: 3rem;
    }
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
    border: 1px solid black;
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
  }

  .pagination li.active a {
    background-color: #007bff;
    color: white;
    border: 1px solid #007bff;
  }

  .pagination li.disabled a {
    color: #ddd;
    cursor: not-allowed;
    border-radius: 5px;
    background-color: #3a4e69;
    border: 1px solid #3a4e69;
  }

  .pagination li a:hover:not(.active) {
    background-color: #ddd;
    border-radius: 5px;
    border: 1px solid #004aad;
  }
`;
