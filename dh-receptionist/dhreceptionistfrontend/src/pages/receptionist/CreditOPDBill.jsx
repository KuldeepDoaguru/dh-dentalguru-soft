import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/receptionist/Header";
import Sider from "../../components/receptionist/Sider";
import { Link } from "react-router-dom";
import { Table, Input, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import EditPatientDetails from "../../components/receptionist/AllPatients/EditPatientDetails";
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../images/animation/loading-effect.json";
import cogoToast from "cogo-toast";
function CreditOPDBill() {
  const { refreshTable, currentUser } = useSelector((state) => state.user);
  const branch = currentUser.branch_name;
  const token = currentUser?.token;

  //  // Initialize with today's date
  //   const [selectedDate, setSelectedDate] = useState(
  //     new Date().toISOString()?.split("T")[0]
  //   );

  const [appointmentsData, setAppointmentData] = useState([]);

  const [loadingEffect, setLoadingEffect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateAppData, setSelectedDateAppData] = useState([]);

  // const handleDateChange = (increment) => {
  //   return () => {
  //     if (selectedDate) {
  //       const currentDate = new Date(selectedDate);
  //       currentDate.setDate(currentDate?.getDate() + increment);
  //       setSelectedDate(currentDate?.toISOString()?.split("T")[0]);
  //     }
  //   };
  // };

  const getAppointments = async () => {
    setLoadingEffect(true);
    try {
      const response = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/get-appointments/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredPatients = response?.data?.data?.filter(
        (patient) =>
          patient.treatment_provided === "OPD" &&
          patient.payment_Mode === "Credit"
      );
      // const filteredPatients = response?.data?.data?.filter(
      //   (patient) => patient.treatment_provided === "OPD" && patient.appointment_status !=="Cancel"
      // );

      setAppointmentData(filteredPatients.reverse());
      setLoadingEffect(false);
    } catch (error) {
      console.log(error);
      setLoadingEffect(false);
    }
  };

  // if date wise data so use this function
  // useEffect(() => {
  //   const filteredResults = appointmentsData.filter((row) =>
  //     row?.created_at?.includes(selectedDate)
  //   );
  //   setSelectedDateAppData(filteredResults);
  //   handleSearch({ target: { value: searchTerm } });
  // }, [appointmentsData, selectedDate]);

  // useEffect(() => {
  //   handleSearch({ target: { value: searchTerm } });
  // }, [refreshTable, selectedDate]);
  // useEffect(() => {
  //   getAppointments();
  // }, []);

  // // Searching function
  // const handleSearch = (event) => {
  //   const searchTerm = event.target.value.toLowerCase();
  //   setSearchTerm(searchTerm);
  //   setCurrentPage(1); // Reset to the first page when searching

  //   const filteredResults = appointmentsData.filter(
  //     (row) =>
  //       (row.patient_name.toLowerCase()?.includes(searchTerm.trim()) ||
  //         row.mobileno?.includes(searchTerm.trim()) ||
  //         row.uhid?.toLowerCase().includes(searchTerm.trim())) &&
  //       row.created_at?.includes(selectedDate)
  //   );

  //   setFilteredData(filteredResults);
  // };

  useEffect(() => {
    handleSearch({ target: { value: searchTerm } });
  }, [refreshTable]);
  useEffect(() => {
    getAppointments();
  }, []);

  // Searching function
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setCurrentPage(1); // Reset to the first page when searching

    const filteredResults = appointmentsData.filter(
      (row) =>
        row.patient_name.toLowerCase()?.includes(searchTerm.trim()) ||
        row.mobileno?.includes(searchTerm.trim()) ||
        row.uhid?.toLowerCase().includes(searchTerm.trim())
    );

    setFilteredData(filteredResults);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Pagination functions
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = searchTerm
    ? filteredData.slice(indexOfFirstRow, indexOfLastRow)
    : appointmentsData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(appointmentsData.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(appointmentsData.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers?.map((number, index) => {
    // Display the first two page numbers
    if (index < 2) {
      return (
        <Button
          key={number}
          onClick={() => paginate(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </Button>
      );
    }
    // Display an ellipsis for the first middle section
    else if (index === 2 && currentPage > 3) {
      return (
        <Button key={number} disabled>
          ...
        </Button>
      );
    }
    // Display the current page and the two adjacent pages
    else if (
      (index >= currentPage - 1 && index <= currentPage + 1) ||
      (index === 2 && currentPage <= 3)
    ) {
      return (
        <Button
          key={number}
          onClick={() => paginate(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </Button>
      );
    }
    // Display an ellipsis for the last middle section
    else if (
      index === pageNumbers.length - 3 &&
      currentPage < pageNumbers.length - 2
    ) {
      return (
        <Button key={number} disabled>
          ...
        </Button>
      );
    }
    // Display the last two page numbers
    else if (index >= pageNumbers.length - 2) {
      return (
        <Button
          key={number}
          onClick={() => paginate(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </Button>
      );
    }
    return null;
  });
  console.log(appointmentsData);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //   const billUpdateForm = {

  //     payment_Status: "paid",
  //   };

  const updateBillforPaid = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Paid this Bill?"
    );

    if (!isConfirmed) {
      // If the user cancels the deletion, do nothing
      return;
    }
    try {
      const res = await axios.put(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/ChangeStatusToPaidOPDBill/${id}/${branch}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("Bill updated successfully");
      getAppointments();
    } catch (error) {
      console.log(error);
    }
  };
  //   let total = 0;
  //   let credit = 0;
  //   let cash = 0;
  //   let upi = 0;
  //   let card = 0;
  //   let refund = 0;
  //   const calculateTotalAmount = () =>{
  //      // const selectedDateAppData = .filter(
  //       //   (patient) => patient.treatment_provided === "OPD" && patient.appointment_status !=="Cancel"
  //       // );

  //     selectedDateAppData?.forEach((item)=>{
  //       if(!isNaN(item?.opd_amount)){
  //         if(item.appointment_status !=="Cancel" && item?.payment_Mode === "Credit"){
  //           credit +=  parseInt(item?.opd_amount)
  //         }
  //         else if(item.appointment_status !=="Cancel" && item?.payment_Mode === "Cash"){
  //           cash += parseInt(item?.opd_amount)
  //         }
  //         else if(item.appointment_status !=="Cancel" && item?.payment_Mode === "UPI"){
  //           upi += parseInt(item.opd_amount)
  //         }
  //         else if(item.appointment_status !=="Cancel" && item?.payment_Mode === "Card"){
  //           card += parseInt(item?.opd_amount)
  //         }

  //         if(item.payment_Status === "Refund"){
  //           refund += parseInt(item?.opd_amount)
  //         }
  //         if(item.treatment_provided === "OPD" && item.appointment_status !=="Cancel"){
  //           total += parseInt(item?.opd_amount)
  //         }
  //       }

  //     })
  //   }
  //   calculateTotalAmount();
  // console.log(total,credit,upi,card,cash);

  return (
    <Wrapper>
      {/* <div className="header">
        <Header />
      </div> */}

      <div className="row flex-nowrap ">
        {/* <div className="col-lg-1 col-1" id="hd">
          <Sider />
        </div> */}
        <div className="col-lg-12 mt-2" id="">
          <div className="text-center">
            <h3>All Patients Credit OPD Bill</h3>
          </div>
          <div className="row">
            <div className="col-lg-12" id="head">
              <nav class="shadow rounded navbar navbar-light bg-light">
                <h6 className="mx-3 my-1 my-md-0">Search By Patient</h6>
                <div class="container-fluid" id="cont">
                  <div class="navbar1 ">
                    <input
                      className="form-control me-2 rounded-5"
                      type="search"
                      placeholder="Enter Patient Name or Mobile or UHID"
                      aria-label="Search"
                      onChange={handleSearch}
                      value={searchTerm}
                    />
                    {/* <button class="btn btn-outline-success" type="submit">Search</button> */}
                  </div>
                  <div>
                    <Form.Group
                      controlId="rowsPerPageSelect"
                      style={{ display: "flex" }}
                    >
                      <h6 className="d-flex align-items-center">
                        {" "}
                        Rows Per Page :{" "}
                      </h6>
                      <Form.Control
                        as="select"
                        value={rowsPerPage}
                        className="m-2"
                        style={{ width: "auto" }}
                        onChange={handleRowsPerPageChange}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        {/* Add more options as needed */}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  {/* <div className="d-flex align-items-center">
                    <FaArrowCircleLeft
                      style={{
                        fontSize: "35px",
                        padding: "3px",
                        cursor: "pointer",
                      }}
                      onClick={handleDateChange(-1)}
                    />
                    <input
                      type="date"
                      className="form-control "
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <FaArrowCircleRight
                      style={{
                        fontSize: "35px",
                        padding: "3px",
                        cursor: "pointer",
                      }}
                      onClick={handleDateChange(1)}
                    />
                  </div> */}
                  <div>
                    <h5>Total Patients - {appointmentsData.length}</h5>
                  </div>

                  {/* <div class="dropdown" id='drop'>
  
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
  Filter Patient by Bill Status
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Unpaid</a></li>
    <li><a class="dropdown-item" href="#">Partially Paid</a></li>
    <li><a class="dropdown-item" href="#">Paid</a></li>
    <li><a class="dropdown-item" href="#">All</a></li>
  </ul>
</div> */}
                </div>
                {/* <div className="d-flex mx-2 mt-2">
                <h6 className="mx-2">Total - <FaIndianRupeeSign /> {total}</h6>
                <h6 className="mx-2">Cash - <FaIndianRupeeSign /> {cash}</h6>
                <h6 className="mx-2">Credit - <FaIndianRupeeSign /> {credit}</h6>
                <h6 className="mx-2">UPI  -<FaIndianRupeeSign /> {upi}</h6>
                <h6 className="mx-2">Card - <FaIndianRupeeSign /> {card}</h6>
                <h6 className="mx-2">Refund - <FaIndianRupeeSign /> {refund}</h6>
                </div> */}
              </nav>
            </div>

            <div className="col-lg-12">
              <div
                className="widget-area-2 proclinic-box-shadow mt-5"
                id="tableres"
              >
                {loadingEffect ? (
                  <Lottie
                    options={defaultOptions}
                    height={300}
                    width={400}
                    style={{ background: "transparent" }}
                  ></Lottie>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>App. Id</th>
                          <th>UHID</th>
                          <th>Patient Name</th>
                          <th>Phone Number</th>
                          <th>App. Timing</th>
                          <th>Doctor Name</th>
                          <th>Treatment</th>
                          <th>App. Status</th>
                          <th>OPD Amount</th>
                          <th>Payment Mode</th>
                          <th>Transaction Id</th>
                          <th>Payment Status</th>
                          <th>Cancel Date</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {currentRows.length === 0 ? (
                        <div className="no-data-container">
                          <h4>No Data Found</h4>
                        </div>
                      ) : (
                        <tbody>
                          {currentRows?.map((data, index) => (
                            <tr key={index}>
                              <td>{data.appoint_id}</td>
                              <td>
                                <Link to={`/patient_profile/${data.uhid}`}>
                                  {data.uhid}
                                </Link>
                              </td>
                              <td className="text-capitalize">
                                {data.patient_name}
                              </td>
                              <td>{data.mobileno}</td>
                              <td>
                                {moment(
                                  data?.appointment_dateTime,
                                  "YYYY-MM-DDTHH:mm"
                                ).format("DD/MM/YYYY hh:mm A")}
                              </td>

                              <td className="text-capitalize">
                                {data.assigned_doctor_name}
                              </td>
                              <td>{data.treatment_provided}</td>
                              <td
                                className={`text-capitalize ${
                                  data.appointment_status === "Cancel"
                                    ? "text-danger"
                                    : ""
                                }`}
                              >
                                {data.appointment_status}
                              </td>
                              <td>{data.opd_amount}</td>
                              <td className="text-capitalize">
                                {data.payment_Mode}
                              </td>
                              <td>{data.transaction_Id}</td>
                              <td className="text-capitalize">
                                {data.payment_Status}
                              </td>
                              <td className="text-capitalize">
                                {data?.refund_date_time
                                  ? moment(
                                      data?.refund_date_time,
                                      "DD-MM-YYYYTHH:mm"
                                    ).format("DD/MM/YYYY hh:mm A")
                                  : ""}
                              </td>

                              <td>
                                {moment(
                                  data?.created_at,
                                  "YYYY-MM-DDTHH:mm"
                                ).format("DD/MM/YYYY hh:mm A")}
                              </td>
                              <td>
                                {/* {data.payment_Status == "paid" && (
                                    <button className="btn btn-success">
                                      View Reciept
                                    </button>
                                  )} */}

                                {data.payment_Status === "Credit" && (
                                  <button
                                    className="btn btn-warning"
                                    // style={{
                                    //   backgroundColor: "#FFA600",
                                    // }}
                                    onClick={() =>
                                      updateBillforPaid(data.appoint_id)
                                    }
                                  >
                                    Change Status to Paid
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                )}
                <div className="container mt-3 mb-3">
                  <div className="row">
                    <div className="col-lg-10 col-xl-8 col-md-12 col-sm-12 col-8">
                      {" "}
                      <h4
                        style={{
                          color: "black",
                          marginLeft: "5px",
                          marginRight: "5px",
                          fontSize: "1.1rem",
                        }}
                      >
                        {/* Showing Page {currentPage} of {totalPages} from {data?.length} entries */}
                        {searchTerm ? (
                          <>
                            {" "}
                            Showing Page {currentPage} of {totalPages} from{" "}
                            {filteredData?.length} entries (filtered from{" "}
                            {appointmentsData?.length} total entries){" "}
                          </>
                        ) : (
                          <>
                            Showing Page {currentPage} of {totalPages} from{" "}
                            {appointmentsData?.length} entries
                          </>
                        )}
                      </h4>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                      <div className="d-flex justify-content-evenly">
                        <Button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="warning"
                        >
                          Previous
                        </Button>
                        {renderPageNumbers}

                        <Button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={indexOfLastRow >= appointmentsData.length}
                          variant="success"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default CreditOPDBill;
const Wrapper = styled.div`
  overflow: hidden;
  .navbar1 {
    display: flex;
    width: 25%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  #cont {
    display: flex;
    @media screen and (max-width: 768px) {
      /* flex-direction: column; */
      gap: 1rem;
    }
  }
  #drop {
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  #head {
    @media screen and (max-width: 768px) {
      width: 98%;
      /* margin-left: 1.2rem; */
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      margin-left: 1rem;

      margin: auto;
    }
    @media screen and (min-width: 1500px) and (max-width: 2000px) {
      width: 98%;
    }
    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      width: 98%;
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
      margin-left: -2rem;
    }
    @media screen and (min-width: 1020px) and (max-width: 1500px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: -1.9rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
      margin-left: -1rem;
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
  #tableres {
    @media screen and (max-width: 768px) {
      width: auto;
      margin: auto;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      width: auto;
      margin: auto;
    }
    @media screen and (min-width: 1500px) and (max-width: 2000px) {
      width: 98%;
    }
    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      width: 98%;
    }
  }
  th {
    background-color: teal;
    color: white;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }
  .header {
    position: fixed;
    min-width: 100%;
    z-index: 100;
  }
  .table-responsive {
    position: relative;
    min-height: 10rem;
  }

  .loading-container,
  .no-data-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px; /* Adjust as necessary */
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .no-data-container h4 {
    margin: 0;
  }
`;
