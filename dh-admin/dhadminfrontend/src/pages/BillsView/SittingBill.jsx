import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../animation/loading-effect.json";

const SittingBill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(false);
  console.log(user);
  const [appointmentList, setAppointmentList] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [keyword, setkeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getAppointList = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getSittingBill/${user.branch_name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        setAppointmentList(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

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

  console.log(appointmentList);

  const uniqueDoctor = [
    ...new Set(appointmentList?.map((item) => item.doctor_name)),
  ];

  console.log(uniqueDoctor);

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = appointmentList.filter((lab) => {
    if (doctor && trimmedKeyword) {
      return (
        lab.doctor_name === doctor &&
        (lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
          lab.uhid.toLowerCase().includes(trimmedKeyword))
      );
    } else if (doctor) {
      return lab.doctor_name === doctor;
    } else if (trimmedKeyword) {
      return (
        lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
        lab.uhid.toLowerCase().includes(trimmedKeyword)
      );
    } else {
      return true; // Show all data when no filters are applied
    }
  });

  const totalOpdAmount = searchFilter.reduce((total, item) => {
    return total + Number(item.sitting_amount);
  }, 0);

  const billPerPage = 10;

  const totalPages = Math.ceil(searchFilter.length / billPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * billPerPage;
    const endIndex = startIndex + billPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedAppointments = filterAppointDataByMonth();

  console.log(displayedAppointments);

  useEffect(() => {
    setCurrentPage(0);
  }, [doctor, trimmedKeyword]);

  return (
    <>
      <Container>
        <div className="">
          <div className="row">
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
              <div className="">
                {/* <label>Patient Name :</label> */}
                <input
                  type="text"
                  placeholder="Search Patient Name or Contact Number or UHID"
                  className="w-100"
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </div>
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
            <h4>Total OPD amount this month :- {totalOpdAmount}/-</h4>
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
            {displayedAppointments?.length > 0 ? (
              <>
                <div class="table-responsive rounded mt-4">
                  <table class="table table-bordered rounded shadow">
                    <thead className="table-head">
                      <tr>
                        <th className="table-sno">Bill ID</th>
                        <th>Bill Date</th>
                        <th className="table-small">Patient UHID</th>
                        <th className="table-small">Patient Name</th>
                        <th>Assigned Doctor</th>
                        <th>Treatment</th>
                        <th className="table-small">Sitting Amount</th>
                        <th>Payment Status</th>
                        <th>View Bill</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAppointments?.map((item) => (
                        <>
                          <tr className="table-row">
                            <td className="table-sno">{item.sb_id}</td>
                            <td className="table-small">
                              {item.date?.split(" ")[0]}
                            </td>
                            <td className="table-small">
                              <Link
                                className="fw-bold"
                                to={`/patient-profile/${item.uhid}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#004aad",
                                }}
                              >
                                {item.uhid}
                              </Link>
                            </td>
                            <td className="table-small">{item.patient_name}</td>
                            <td>{item.doctor_name}</td>
                            <td>{item.treatment}</td>
                            <td className="table-small">
                              {item.sitting_amount}
                            </td>
                            <td>
                              {item.payment_status ? item.payment_status : "-"}
                            </td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() =>
                                  navigate(
                                    `/ViewSittingBill/${item.tp_id}/${item.sitting_number}/${item.treatment}/${item.appointment_id}/${item.uhid}`
                                  )
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        </>
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
            ) : (
              <>
                <h1>No Bill Found</h1>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default SittingBill;
const Container = styled.div``;

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
