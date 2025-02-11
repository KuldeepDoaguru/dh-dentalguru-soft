import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import ReactPaginate from "react-paginate";
import HeaderAdmin from "./HeaderAdmin";
import SiderAdmin from "./SiderAdmin";
import animationData from "../animation/loading-effect.json";
import Lottie from "react-lottie";

const StaffLeave = () => {
  const user = useSelector((state) => state.user.currentUser);

  const branch = user.branch_name;

  const [leaveData, setLeaveData] = useState([]);
  const [afterAction, setAfterAction] = useState(false);
  const [keyword, setkeyword] = useState("");
  const complaintsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLeaveList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getLeaveList/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setLeaveData(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaveList();
  }, []);

  const handleLeaveApprove = async (id, employee_id) => {
    if (employee_id === user.employee_ID) {
      alert(`You can not approved your leave`);

      return;
    }
    try {
      const response = await axios.put(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/approveLeave/${id}`,
        {
          status: "Approved",
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Leave Approved");
      setAfterAction(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveReject = async (id) => {
    try {
      const response = await axios.put(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/approveLeave/${id}`,
        {
          status: "Rejected",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.warn("Leave Rejected");
      setAfterAction(true);
      getLeaveList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (afterAction) {
      getLeaveList();
      setAfterAction(false);
    }
  }, [afterAction]);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const searchFilter = leaveData.filter((item) => {
    const lowerKeyword = keyword.toLowerCase().trim();
    return (
      item.employee_name.toLowerCase().trim().includes(lowerKeyword) ||
      item.employee_ID.toLowerCase().trim().includes(lowerKeyword)
    );
  });

  const totalPages = Math.ceil(searchFilter.length / complaintsPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedAppointments = filterAppointDataByMonth();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
                style={{ marginTop: "6rem" }}
              >
                {/* <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div> */}
                <div className="container-fluid mt-3 response">
                  <div className="container-fluid">
                    <h3>Employee Leave Management</h3>
                    {/* <label>Employee Name :</label> */}
                    <input
                      type="text"
                      placeholder="search employee name or emp_id"
                      className=""
                      value={keyword}
                      onChange={(e) => setkeyword(e.target.value.toLowerCase())}
                    />
                    {loading ? (
                      <Lottie
                        options={defaultOptions}
                        height={300}
                        width={400}
                      ></Lottie>
                    ) : (
                      <>
                        {displayedAppointments.length === 0 ? (
                          <div className="mb-2 fs-4 fw-bold text-center">
                            No employeee leave available
                          </div>
                        ) : (
                          <>
                            <div class="table-responsive rounded">
                              <table class="table table-bordered rounded shadow mt-2">
                                <thead className="table-head">
                                  <tr>
                                    <th className="table-sno sticky">
                                      Employee ID
                                    </th>
                                    <th className="sticky">Branch</th>
                                    <th className="table-small sticky">
                                      Employee Name
                                    </th>
                                    <th className="table-small sticky">
                                      Leave Dates
                                    </th>
                                    <th className="table-small sticky">
                                      Leave Reason
                                    </th>
                                    <th className="table-small sticky">
                                      Applied Date
                                    </th>
                                    <th className="table-small sticky">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {displayedAppointments.map((item) => (
                                    <>
                                      <tr className="table-row">
                                        <td className="table-sno">
                                          {item.employee_ID}
                                        </td>
                                        <td className="table-small">
                                          {item.branch_name}
                                        </td>
                                        <td className="table-small">
                                          {item.employee_name}
                                        </td>
                                        <td className="table-small">
                                          {item.leave_dates}
                                        </td>
                                        <td>{item.leave_reason}</td>
                                        <td>{item.created_at.split("T")[0]}</td>
                                        <td>
                                          {item.leave_status !== "pending" ||
                                          item.leave_status === null ? (
                                            <button
                                              className={`btn ${
                                                item.leave_status === "Approved"
                                                  ? "btn-warning"
                                                  : "btn-danger"
                                              }`}
                                            >
                                              {item.leave_status
                                                ? item.leave_status.toUpperCase()
                                                : "Unknown"}
                                            </button>
                                          ) : (
                                            <>
                                              {" "}
                                              <div className="d-flex">
                                                <button
                                                  className="btn btn-success"
                                                  onClick={() =>
                                                    handleLeaveApprove(
                                                      item.id,
                                                      item.employee_ID
                                                    )
                                                  }
                                                >
                                                  Approve
                                                </button>
                                                <button
                                                  className="btn btn-danger ms-2"
                                                  onClick={() =>
                                                    handleLeaveReject(item.id)
                                                  }
                                                >
                                                  Reject
                                                </button>
                                              </div>
                                            </>
                                          )}
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
        </div>
      </Container>
    </>
  );
};

export default StaffLeave;
const Container = styled.div`
  .table-responsive {
    height: 30rem;
    overflow: auto;
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
    border-color: #007bff; /* Change border color on focus */
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
