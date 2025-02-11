import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Sider from "../components/Sider";
import BranchDetails from "../components/BranchDetails";
import MakeRefund from "../components/btModal/MakeRefund";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import moment from "moment";
import animationData from "../pages/loading-effect.json";
import Lottie from "react-lottie";

const SecurityAmount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log(user);
  const token = user.token;
  console.log("User State:", user);
  const [patData, setPatData] = useState([]);
  const [securityList, setSecurityList] = useState([]);
  // const [refAmount, setRefAmount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showEditSecAmount, setShowEditSecAmount] = useState(false);
  const [showPaySecAmount, setShowPaySecAmount] = useState(false);
  const [outStanding, setOutStanding] = useState([]);
  const [selected, setSelected] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  // const [refAmount, setRefAmount] = useState();
  // const [filteredSecurityList, setFilteredSecurityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addSecurityAmount, setAddSecurityAmount] = useState({
    branch_name: user.branch,
    date: "",
    appointment_id: "",
    uhid: "",
    patient_name: "",
    patient_number: "",
    assigned_doctor: "",
    amount: "",
    payment_status: "",
    received_by: user.name,
  });

  // const filteredItems = securityList.filter((item) =>
  //   item.patient_name.trim().toLowerCase().includes(keyword)
  // );

  const filteredItems = securityList.filter(
    (row) =>
      row?.patient_name.toLowerCase().includes(keyword.trim()) ||
      row?.patient_number.includes(keyword.trim()) ||
      row?.uhid.toLowerCase().includes(keyword.trim())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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

  const date = new Date();
  console.log(date);

  const [refund, setRefund] = useState({
    refund_date: date,
    refund_by: user.name,
    payment_status: "Refunded",
  });

  const [data, setData] = useState({
    payment_status: "success",
    payment_Mode: "",
    transaction_Id: "",
    notes: "",
    received_by: user.name,
  });
  console.log(data);

  const handlePaySecChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  console.log(data);

  const handleInput = async (event) => {
    const { name, value } = event.target;
    if (name === "appointment_id") {
      try {
        const { data } = await axios.get(
          `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getAppointmentDetailsViaID/${value}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);
        if (data) {
          setAddSecurityAmount((prevData) => ({
            ...prevData,
            uhid: data[0]?.patient_uhid,
            patient_name: data[0]?.patient_name,
            patient_number: data[0]?.mobileno,
            assigned_doctor: data[0]?.assigned_doctor_name,
            appointment_id: value,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // For other input fields, update the state as before
      setAddSecurityAmount((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  console.log(refund);

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setRefund({ ...refund, [name]: value !== "" ? parseFloat(value) : "" });
  // };

  const insertSecurityAmount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/addSecurityAmount",
        addSecurityAmount,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      cogoToast.success("Security Amount Submitted Successfully");
    } catch (error) {
      console.log(error);
      cogoToast.success("failed to submit security amount");
    }
  };

  const getSecurityAmountList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getSecurityAmountDataByBranch/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setSecurityList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(securityList);

  const makePaymentNow = async (id) => {
    try {
      const response = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updateSecurityAmount/${id}`,
        [],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getSecurityAmountList();
    } catch (error) {
      console.log(error);
    }
  };

  const openSecAmountSubPopup = (id) => {
    setShowEditSecAmount(true);
    // getTotaloutstanding(id);
    setSelected(id);
    console.log(id);
  };
  const closeUpdatePopup = () => {
    setShowEditSecAmount(false);
    setShowPaySecAmount(false);
  };

  const openSecurityAmtPay = (id) => {
    setShowPaySecAmount(true);
    setSelected(id);
  };

  useEffect(() => {
    getSecurityAmountList();
  }, []);

  console.log(securityList);
  console.log(selected);
  // alert(selected);

  const filterForSecAmountDef = securityList.filter((item) => {
    return item.sa_id === selected;
  });

  console.log(filterForSecAmountDef);

  const MakeRefund = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updateRefundAmount/${selected}`,
        {
          refund_by: user.name,
          payment_status: "Refunded",
          refund_amount: filterForSecAmountDef[0]?.remaining_amount,
          remaining_amount: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (filterForSecAmountDef[0].patient_number && user?.sharesms === "Yes") {
        refundBillDetailsSms();
      }
      if (
        filterForSecAmountDef[0].patient_number &&
        user?.sharewhatsapp === "Yes"
      ) {
        RefundSendWhatsappTextOnly();
      }
      cogoToast.success("Amount Refunded Successfully");
      getSecurityAmountList();
      closeUpdatePopup();
    } catch (error) {
      console.log(error);
    }
  };

  const paySecurityCash = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...data,
      remaining_amount: filterForSecAmountDef[0]?.amount,
    };
    try {
      const response = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updatePatientSecurityAmt/${selected}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (filterForSecAmountDef[0].patient_number && user?.sharesms === "Yes") {
        billDetailsSms();
      }
      if (
        filterForSecAmountDef[0].patient_number &&
        user?.sharewhatsapp === "Yes"
      ) {
        sendWhatsappTextOnly();
      }
      cogoToast.success("Amount Paid Successfully");
      setData({
        payment_Mode: "",
        transaction_Id: "",
        notes: "",
      });
      getSecurityAmountList();
      closeUpdatePopup();
    } catch (error) {
      console.log(error);
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

  // SMS Whatapps Changes API's

  const formDetails = {
    phoneNumber: filterForSecAmountDef[0]?.patient_number,
    message: `Dear ${filterForSecAmountDef[0]?.patient_name}, UHID ${filterForSecAmountDef[0]?.uhid} you have successfully paid ${filterForSecAmountDef[0]?.amount}/- as security amount`,
  };

  const billDetailsSms = async () => {
    try {
      const { data } = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/sendSMS",
        formDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("bill details sent successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const sendWhatsappTextOnly = async () => {
    try {
      const res = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/sendWhatsapptextonly",
        formDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // cogoToast.success(" sent successfully");
      console.log("Whats app msg successfully");
    } catch (error) {
      console.error("Error sending PDF:", error);
    }
  };

  const refundformDetails = {
    phoneNumber: filterForSecAmountDef[0]?.patient_number,
    message: `Dear ${filterForSecAmountDef[0]?.patient_name}, UHID ${filterForSecAmountDef[0]?.uhid} you have successfully Refunded ${filterForSecAmountDef[0]?.remaining_amount}/- from security amount`,
  };

  const refundBillDetailsSms = async () => {
    try {
      const { data } = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/sendSMS",
        refundformDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("Message sent successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const RefundSendWhatsappTextOnly = async () => {
    try {
      const res = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/sendWhatsapptextonly",
        refundformDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // cogoToast.success(" sent successfully");
      console.log("Whats app msg successfully");
    } catch (error) {
      console.error("Error sending PDF:", error);
    }
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
                <BranchDetails />
                <div className="container">
                  <h2 className="text-center mt-5">Security Amount Details</h2>
                  <hr />

                  <div className="container-fluid">
                    <div>
                      <input
                        type="text"
                        placeholder="Search Patient Name / UHID"
                        className="p-1 rounded input"
                        value={keyword}
                        onChange={(e) => {
                          setKeyword(e.target.value.toLowerCase());
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div class="table-responsive mt-4">
                      {loading ? (
                        <Lottie
                          options={defaultOptions}
                          height={300}
                          width={400}
                        />
                      ) : (
                        <>
                          <table class="table table-bordered">
                            <thead className="table-head">
                              <tr>
                                <th>Date</th>
                                <th>Appointment ID</th>
                                <th>UHID</th>
                                <th>Patient Name</th>
                                <th>Patient Number</th>
                                <th>Assigned Doctor</th>
                                <th>Deposit Security Amount</th>
                                <th>Remaning Security Amount</th>
                                <th>Payment Mode</th>
                                <th>Transaction Id</th>
                                <th>Payment Date</th>
                                <th>Refund Date</th>
                                <th>Payment Status</th>
                                <th>Refund Amount</th>
                                <th>Action</th>
                                <th>Print</th>
                              </tr>
                            </thead>
                            {currentItems?.length === 0 ? (
                              <div className="text-center fs-4 nodata">
                                <p> No data found</p>
                              </div>
                            ) : (
                              <tbody>
                                {currentItems
                                  // ?.filter((val) => {
                                  //   if (keyword === "") {
                                  //     return true;
                                  //   } else if (
                                  //     val.patient_name
                                  //       .toLowerCase()
                                  //       .includes(keyword.toLowerCase().trim())
                                  //   ) {
                                  //     return val;
                                  //   }
                                  // })
                                  .map((item) => (
                                    <>
                                      <tr className="table-row">
                                        <td>
                                          {moment(
                                            item?.date,
                                            "DD-MM-YYYYTHH:mm:ss"
                                          ).format("DD/MM/YYYY")}
                                        </td>
                                        <td>{item.appointment_id}</td>
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
                                        <td>{item.patient_number}</td>
                                        <td className="text-capitalize">{`Dr. ${item.assigned_doctor}`}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.remaining_amount}</td>
                                        <td className="text-capitalize">
                                          {item.payment_Mode}
                                        </td>
                                        <td>{item.transaction_Id}</td>
                                        <td>
                                          {item.payment_date
                                            ? moment(
                                                item?.payment_date,
                                                "DD-MM-YYYYTHH:mm:ss"
                                              ).format("DD/MM/YYYY")
                                            : ""}
                                        </td>
                                        <td>
                                          {item?.refund_date
                                            ? moment(
                                                item?.refund_date,
                                                "DD-MM-YYYYTHH:mm:ss"
                                              ).format("DD/MM/YYYY")
                                            : ""}
                                        </td>
                                        <td>
                                          <div className="d-flex">
                                            <h6 className="text-capitalize">
                                              {item.payment_status}
                                            </h6>
                                          </div>
                                        </td>
                                        <td>{item.refund_amount}</td>
                                        <td>
                                          {/* {item?.remaining_amount === 0 && ( */}
                                          {item.payment_status === "pending" ? (
                                            <>
                                              <button
                                                className="mx-2 btn btn-info"
                                                onClick={() =>
                                                  openSecurityAmtPay(item.sa_id)
                                                }
                                              >
                                                Pay now
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                className={`mx-2 btn btn-warning ${
                                                  item.remaining_amount == 0
                                                    ? "disabled"
                                                    : ""
                                                } `}
                                                onClick={() =>
                                                  openSecAmountSubPopup(
                                                    item.sa_id
                                                  )
                                                }
                                              >
                                                Make Refund
                                              </button>
                                            </>
                                          )}
                                          {/* <button
                                      className={`mx-2 btn btn-warning ${
                                        item.remaining_amount === 0
                                          ? "disabled"
                                          : ""
                                      } `}
                                      onClick={() =>
                                        openSecAmountSubPopup(item.sa_id)
                                      }
                                    >
                                      Make Refund
                                    </button> */}
                                          {/* )} */}
                                        </td>
                                        <td>
                                          {item.payment_status === "pending" ? (
                                            <button
                                              className="btn btn-success"
                                              disabled
                                            >
                                              View Receipt
                                            </button>
                                          ) : (
                                            <Link
                                              to={`/security-amount-reciept/${item.sa_id}`}
                                            >
                                              <button className="btn btn-success">
                                                View Receipt
                                              </button>
                                            </Link>
                                          )}
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
                        disabled={indexOfLastItem >= securityList.length}
                      >
                        Next Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ***************************************************************************************************** */}

          {/* pop-up for refund amount */}
          <div
            className={`popup-container${showEditSecAmount ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Refund Amount</h4>
              <hr />
              <form className="d-flex flex-column" onSubmit={MakeRefund}>
                <div className="container">
                  <div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Security Amount Submitted -{" "}
                        {outStanding.length === 0
                          ? filterForSecAmountDef[0]?.amount
                          : outStanding[0]?.amount}
                      </label>
                    </div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        {/* Total Outstanding - {totalValue} */}
                        Remaning Secuirty Amount -{" "}
                        {filterForSecAmountDef[0]?.remaining_amount}
                      </label>
                    </div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Refund Amount :
                        {/* {outStanding.length === 0
                          ? filterForSecAmountDef[0]?.amount
                          : outStanding[0]?.amount - totalValue} */}
                        {filterForSecAmountDef[0]?.remaining_amount}
                      </label>
                      {/* <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        placeholder="Enter Amount"
                        name="refund_amount"
                        value={
                          outStanding.length === 0
                            ? filterForSecAmountDef[0]?.amount
                            : outStanding[0]?.amount - totalValue
                        }
                        onChange={handleInputChange}
                      /> */}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success mt-2">
                    Refund
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

          {/* pop-up for refund amount */}
          {/* ************************************************************************************* */}

          {/* ***************************************************************************************************** */}

          {/* pop-up for Pay security amount */}
          <div
            className={`popup-container${showPaySecAmount ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Pay Security Amount</h4>
              <hr />
              <form className="d-flex flex-column" onSubmit={paySecurityCash}>
                <div className="container">
                  <div>
                    <div class="mb-3">
                      <label className="form-label" htmlFor="">
                        Payment Mode
                      </label>
                      <select
                        className="form-select"
                        id="payment_Mode"
                        name="payment_Mode"
                        value={data.payment_Mode}
                        required
                        onChange={handlePaySecChange}
                      >
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </div>

                    {data.payment_Mode === "online" && (
                      <div class="mb-3">
                        <label className="form-label" for="form6Example1">
                          Transaction Id
                        </label>
                        <input
                          type="text"
                          id="form6Example1"
                          className="form-control"
                          name="transaction_Id"
                          onChange={handlePaySecChange}
                          value={data.transaction_Id}
                          required
                        />
                      </div>
                    )}

                    <div class="mb-3">
                      <label className="form-label" for="form6Example1">
                        Notes
                      </label>
                      <input
                        type="text"
                        id="form6Example1"
                        className="form-control"
                        name="notes"
                        onChange={handlePaySecChange}
                        value={data.notes}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success mt-2">
                    Pay
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

          <div
            className={`popup-container${showPaySecAmount ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Pay Security Amount</h4>
              <hr />
              <form className="d-flex flex-column" onSubmit={paySecurityCash}>
                <div className="container">
                  <div>
                    <div class="mb-3">
                      <label className="form-label" htmlFor="">
                        Payment Mode
                      </label>
                      <select
                        className="form-select"
                        id="payment_Mode"
                        name="payment_Mode"
                        value={data.payment_Mode}
                        required
                        onChange={handlePaySecChange}
                      >
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </div>

                    {data.payment_Mode === "online" && (
                      <div class="mb-3">
                        <label className="form-label" for="form6Example1">
                          Transaction Id
                        </label>
                        <input
                          type="text"
                          id="form6Example1"
                          className="form-control"
                          name="transaction_Id"
                          onChange={handlePaySecChange}
                          value={data.transaction_Id}
                          required
                        />
                      </div>
                    )}

                    <div class="mb-3">
                      <label className="form-label" for="form6Example1">
                        Notes
                      </label>
                      <input
                        type="text"
                        id="form6Example1"
                        className="form-control"
                        name="notes"
                        onChange={handlePaySecChange}
                        value={data.notes}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success mt-2">
                    Pay
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

          {/* pop-up for Pay security amount */}
          {/* ************************************************************************************* */}
        </div>
      </Container>
    </>
  );
};

export default SecurityAmount;
const Container = styled.div`
  .table-head {
    th {
      background-color: #201658;
      color: white;
      white-space: nowrap;
    }
  }
  td {
    white-space: nowrap;
  }

  button {
    white-space: nowrap;
  }

  .btnbox {
    margin-top: 2rem;
  }

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
    width: 25%;
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
`;
