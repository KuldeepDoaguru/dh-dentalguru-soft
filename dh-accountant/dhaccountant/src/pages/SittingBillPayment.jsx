import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { IoMdArrowRoundBack } from "react-icons/io";

function SittingBillPayment() {
  const navigate = useNavigate();
  const { sbid, tpid, uhid } = useParams();
  const [loading, setLoading] = useState(false);
  // const { refreshTable, currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  // const token = currentUser?.token;
  // const {currentBranch} = useSelector((state) => state.branch);
  // const branch = currentUser.branch_name;
  const user = useSelector((state) => state.user);
  const token = user?.token;
  const branch = user.branch;
  console.log(branch);
  const [branchData, setBranchData] = useState([]);
  const [allSitting, setAllSitting] = useState([]);
  const [billAmount, setBillAmount] = useState([]);
  const [saAmt, setSaAmt] = useState([]);
  const [patientData, setPatientData] = useState([]);
  console.log(token);
  const [data, setData] = useState({
    paid_amount: "",
    pending_sitting_amount: "",
    pay_direct: "",
    pay_security_amount: "",
    payment_option: "",
    payment_mode: "",
    reference_number: "",
    payment_status: "paid",
    note: "",
  });

  console.log(data);
  console.log(sbid, tpid, uhid);

  const goBack = () => {
    window.history.go(-1);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setData({ ...data, [name]: value });
  };

  const getPatient = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-Patient-by-id/${branch}/${uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setPatientData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const branchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getBranchDetailsByBranch/${branch}`
      );
      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const secuirtyAmtBytpuhid = async () => {
    try {
      const res = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getSecurityAmountDataByTPUHID/${tpid}/${uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setSaAmt(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBillDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getSittingBillDueBySittingId/${branch}/${sbid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBillAmount(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSittingBill = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getPaidSittingBillbyTpid/${tpid}/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllSitting(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    branchDetails();
    getBillDetails();
    secuirtyAmtBytpuhid();
    getAllSittingBill();
    getPatient();
  }, []);

  console.log(branchData);
  console.log(billAmount);
  console.log(allSitting);

  const totalDirPaidAmount = () => {
    try {
      let total = 0;
      allSitting.forEach((item) => {
        total = total + parseFloat(Number(item.pay_direct));
      });
      console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalDirPaidValue = totalDirPaidAmount();
  console.log(totalDirPaidValue);

  const totalSecPaidAmount = () => {
    try {
      let total = 0;
      allSitting.forEach((item) => {
        total = total + parseFloat(Number(item.pay_security_amount));
      });
      console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalSecPaidValue = totalSecPaidAmount();
  console.log(totalSecPaidValue);

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0");
  const date = String(todayDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${date}`;

  console.log(formattedDate);
  console.log(saAmt);

  // If dueAmt is negative, meaning there is an overpayment, we set totalPaidAmount to 0
  const remainingSecurityAmountCheck = () => {
    if (saAmt[0]?.remaining_amount >= billAmount[0]?.sitting_amount) {
      return saAmt[0]?.remaining_amount - billAmount[0]?.sitting_amount;
    }
  };

  const remainingSecurityAmount = remainingSecurityAmountCheck();
  console.log(remainingSecurityAmount);

  const updateRemainingSecurity = async () => {
    // console.log(remainingSecurityAmount);
    try {
      //   console.log(remainingSecurityAmount);
      const response = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updateRemainingSecurityAmount/${tpid}/${uhid}`,
        {
          remaining_amount: remainingSecurityAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("update remaining Successfully amt");
      //   console.log(remainingSecurityAmount);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formDetails = {
    paid_amount: billAmount[0]?.sitting_amount,
    pending_sitting_amount: 0,
    pay_direct:
      data.payment_option === "paydirect" ? billAmount[0]?.sitting_amount : "",
    pay_security_amount:
      data.payment_option === "security" ? billAmount[0]?.sitting_amount : "",
    payment_mode:
      data.payment_option === "security"
        ? "security amount"
        : data.payment_mode,
    reference_number: data.reference_number,
    payment_status: data.payment_mode === "Credit" ? data.payment_mode : "paid",
    note: data.note,
  };

  console.log(formDetails);

  const billUpdateForm = {
    paid_amount:
      data.payment_option === "paydirect"
        ? totalDirPaidValue + billAmount[0]?.sitting_amount
        : totalDirPaidValue,
    payment_status: "",
    payment_mode: "",
    transaction_Id: "",
    note: "",
    receiver_name: user.employee_name,
    receiver_emp_id: user.employee_ID,
    pay_by_sec_amt:
      data.payment_option === "security"
        ? totalSecPaidValue + billAmount[0]?.sitting_amount
        : totalSecPaidValue,
  };

  console.log(patientData);

  const updateBillforSitting = async () => {
    try {
      const res = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updateBillforSitting/${branch}/${tpid}`,
        billUpdateForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("bill updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const submitSittingBill = async () => {
    if (!data.payment_option === "security") {
      if (!data.payment_mode) {
        alert("Please Select Payment Mode");
        return;
      }
    }
    if (data.payment_option === "paydirect") {
      if (!data.payment_mode) {
        alert("Please Select Payment Mode");
        return;
      }
    }

    if (data.payment_mode === "UPI" || data.payment_mode === "Card") {
      if (!data.reference_number) {
        alert("Please Enter reference number");
        return;
      }
    }
    try {
      const res = await axios.put(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/updateSittingBillPayment/${sbid}/${branch}`,
        formDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("successfully paid sitting bill");
      if (data.payment_option === "security") {
        updateRemainingSecurity();
      }
      updateBillforSitting();
      navigate(
        `/ViewPatientSittingBill/${tpid}/${sbid}/${billAmount[0]?.treatment}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
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
                <button
                  className="btn btn-success no-print"
                  onClick={() => window.history.go(-1)}
                >
                  <IoMdArrowRoundBack /> Back
                </button>

                <div className="row mt-5" id="printableContent">
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="d-flex justify-content-center">
                      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="">
                          <div>
                            <h4>Branch : {branchData[0]?.branch_name}</h4>

                            <form className="d-flex ">
                              <h6>Addresh </h6>
                              <h6>: {branchData[0]?.branch_address}</h6>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="d-flex justify-content-end">
                          <div>
                            <form className="d-flex">
                              {/* <h5>Email id : </h5> */}
                              <h3 className="">
                                {branchData[0]?.hospital_name.toUpperCase()}
                              </h3>
                            </form>

                            <form className="d-flex ">
                              <h4>Contact Number : </h4>
                              <h4> {branchData[0]?.branch_contact}</h4>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                      <div className="d-flex justify-content-center">
                        <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-11 col-sm-11">
                          <div className="row  mt-2 d-flex justify-content-between">
                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5">
                              <div class=" rounded mt-4">
                                <h4>PATIENT SUMMARY </h4>
                                <div className="d-flex ">
                                  <h6>Patient Name </h6>
                                  <h6 className="ms-1">
                                    {" "}
                                    : {billAmount[0]?.patient_name}{" "}
                                  </h6>
                                </div>
                                <div className="d-flex">
                                  <h6>Patient id </h6>
                                  <h6 className="ms-1">
                                    {" "}
                                    : {billAmount[0]?.uhid}{" "}
                                  </h6>
                                </div>
                                <div className="d-flex ">
                                  <h6> Invoice Number </h6>
                                  <h6 className="ms-1"> : {sbid} </h6>
                                </div>
                                <div className="d-flex">
                                  <h6> Invoice Date </h6>
                                  <h6 className="ms-1">
                                    {" "}
                                    : {billAmount[0]?.date.split(" ")[0]}{" "}
                                  </h6>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div class=" rounded d-flex justify-content-end mt-5 me-5">
                                <div class="card" style={{ width: "18rem" }}>
                                  <div className="ms-4 mt-2">
                                    <h1> ₹ {billAmount[0]?.sitting_amount}</h1>

                                    <h5 className="text-danger">
                                      Total Treatment Amount
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <form className="d-flex justify-content-center mt-4">
                        <h2> Due Payment Description</h2>
                      </form>
                      <hr className="mt-5" />
                    </div>
                  </div>
                  {/* ************************sitting bill payment*********************** */}
                  <div className="container-fluid">
                    <form>
                      <div className="row">
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">TPID</label>
                            <input
                              type="text"
                              // onChange={handleChange}
                              name="tpid"
                              value={tpid}
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-8 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">Treatment</label>
                            <input
                              type="text"
                              value={billAmount[0]?.treatment}
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">Sitting Amount</label>
                            <input
                              type="text"
                              value={billAmount[0]?.sitting_amount}
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">Paid Amount</label>
                            <input
                              type="text"
                              name="paid_amount"
                              value={billAmount[0]?.sitting_amount}
                              readOnly
                              placeholder="Add Amount"
                              class="form-control"
                            />
                          </div>
                        </div>
                        {saAmt[0]?.payment_status === "pending" ||
                        !saAmt[0]?.remaining_amount ? (
                          <>
                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">
                                  Remaining Security Amount
                                </label>
                                <input
                                  type="text"
                                  value={"0"}
                                  readonly
                                  class="form-control"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">
                                  Remaining Security Amount
                                </label>
                                <input
                                  type="text"
                                  value={saAmt[0]?.remaining_amount}
                                  readonly
                                  class="form-control"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">Payment Option</label>
                            <select
                              name="payment_option"
                              onChange={handleChange}
                              id=""
                              class="form-control"
                            >
                              <option value="">-select-</option>
                              {/* {saAmt[0]?.payment_status === "pending" &&
                              saAmt[0]?.remaining_amount === 0 ? (
                                ""
                              ) : (
                                <option value="security">
                                  Pay security amount
                                </option>
                              )} */}

                              {saAmt[0]?.payment_status === "pending" ||
                              saAmt[0]?.remaining_amount <
                                billAmount[0]?.sitting_amount ||
                              !saAmt[0]?.remaining_amount ? (
                                ""
                              ) : (
                                <option value="security">
                                  Pay Security amount
                                </option>
                              )}

                              <option value="paydirect">Pay direct</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                          <div class="mb-3">
                            <label class="form-label">Note</label>
                            <textarea
                              type="text"
                              name="note"
                              value={data.note}
                              onChange={handleChange}
                              class="form-control"
                            />
                          </div>
                        </div>
                        {saAmt[0]?.payment_status === "pending" &&
                        (saAmt[0]?.remaining_amount === 0 ||
                          saAmt[0]?.remaining_amount < data.paid_amount) ? (
                          ""
                        ) : (
                          <>
                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">
                                  Pay using Security Amount
                                </label>
                                {data.payment_option !== "security" ? (
                                  <>
                                    {" "}
                                    <button
                                      className="btn btn-info form-control shadow"
                                      disabled
                                    >
                                      Pay using security amount
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <button
                                      className="btn btn-info form-control shadow"
                                      type="button"
                                      onClick={submitSittingBill}
                                    >
                                      Pay using security amount
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {data.payment_option === "paydirect" && (
                          <>
                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">Payment Mode</label>
                                <select
                                  name="payment_mode"
                                  id=""
                                  onChange={handleChange}
                                  value={data.payment_mode}
                                  class="form-control"
                                  required
                                >
                                  <option value="">-select-</option>
                                  <option value="Cash">Cash</option>
                                  {patientData?.patient_type == "Credit" &&
                                    user.allow_insurance == "Yes" && (
                                      <option value="Credit">Credit</option>
                                    )}
                                  <option value="UPI">UPI</option>
                                  <option value="Card">Card</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {data.payment_mode === "UPI" ||
                        data.payment_mode === "Card" ? (
                          <>
                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">
                                  Reference Number
                                </label>
                                <input
                                  type="text"
                                  name="reference_number"
                                  value={data.reference_number}
                                  onChange={handleChange}
                                  class="form-control"
                                  placeholder="add reference number"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {data.payment_option === "paydirect" && (
                          <>
                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                              <div class="mb-3">
                                <label class="form-label">
                                  Pay sitting Amount
                                </label>
                                <button
                                  className="btn btn-info form-control shadow"
                                  type="button"
                                  onClick={submitSittingBill}
                                >
                                  Pay sitting Amount
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {(saAmt[0]?.remaining_amount <
                          billAmount[0]?.sitting_amount ||
                          !saAmt[0]?.remaining_amount) && (
                          <p style={{ color: "red" }}>
                            * If Remaining Security amount is less than sitting
                            amount so select Pay direct
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                  {/* ************************sitting bill payment*********************** */}
                  {/* <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
    <div className="d-flex justify-content-center mt-4">
      <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-11 col-sm-11">
        <div className="table-responsive">
          <table class="table table-bordered shadow">
            <thead class="table-primary  rounded">
              <tr>
                <th scope="col">Payment Details</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>
                    Total Treatments Amount
                  </h6>
                </td>

                <td className="fw-bolder">
                  ₹ {billAmount[0]?.total_amount}
                </td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>Previous Paid By Direct
                    Amount
                  </h6>
                </td>
                <td className="fw-bolder">
                  ₹ {billAmount[0]?.paid_amount}
                </td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>Previous Paid By Secuirty
                    Amount
                  </h6>
                </td>
                <td className="fw-bolder">
                  ₹ {billAmount[0]?.pay_by_sec_amt}
                </td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>Total Due Amount
                  </h6>
                </td>
                <td className="fw-bolder">₹ {dueAmt ? dueAmt : 0}</td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>
                    Remaining Secuirty Amount
                  </h6>
                </td>

                <td className="fw-bolder">
                  ₹{" "}
                  {saAmt[0]?.remaining_amount
                    ? saAmt[0]?.remaining_amount
                    : 0}
                </td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>Refundable Security Amount
                  </h6>
                </td>
                <td className="fw-bolder">
                  ₹ {remainingSecurityAmount}
                </td>
              </tr>
              <tr>
                <td colspan="1">
                  <h6>
                    <span class=""></span>Final Due Amount
                  </h6>
                </td>
                <td className="fw-bolder">
                  ₹ {finalAmt ? finalAmt : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-xxl-none d-xl-none d-lg-none col-md-1 col-sm-1"></div>
    </div>
  </div> */}
                </div>
                <div>
                  <div className="container d-flex justify-content-center mb-3">
                    {" "}
                    {/* {dueAmt <= 0 ? (
      <>
        <button
          type="button"
          class="btn btn-primary hide-during-print"
          disabled
        >
          Pay Now
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          class="btn btn-primary hide-during-print"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          disabled={loading}
        >
          {loading ? "Loading..." : "Pay Now"}
        </button>
      </>
    )} */}
                    {/* <button
          class="btn btn btn-success dum text-capitalize mx-2 hide-during-print"
          onClick={handlePrint}
        >
          Print
        </button> */}
                  </div>
                </div>
              </div>
              ;
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default SittingBillPayment;
const Wrapper = styled.div`
  overflow: hidden;
  .navbar1 {
    display: flex;
    width: 25%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  .space {
    margin-right: 23.4rem;
  }
  .spaces {
    margin-right: 45rem;
  }
  #cont {
    display: flex;
    @media screen and (max-width: 768px) {
      flex-direction: column;
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
      width: 85%;
      margin-left: 1.2rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      margin-left: 1rem;

      margin: auto;
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

  /* #set {
    margin-left: -4.5rem;
    padding-left: 150px;
    padding-top: 90px; 
    flex-grow: 1;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      margin-left: -1rem;
    }
    @media screen and (min-width: 1020px) and (max-width: 1500px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 0.1rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2200px) {
      margin-left: -1rem;
    }
  } */

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
      margin-left: 2rem;
    }
    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      margin-left: 4rem;
    }
  }

  #tableres {
    @media screen and (max-width: 768px) {
      width: 21rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      width: auto;
      margin: auto;
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
    z-index: 200;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    height: auto;
    width: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .header {
    position: fixed;
    min-width: 100%;
    z-index: 100;
  }
  .back-button {
    cursor: pointer;
    min-height: 40px;
    min-width: 40px;
  }
  #back-button {
    cursor: pointer;
    min-height: 40px;
    min-width: 40px;
  }
`;
