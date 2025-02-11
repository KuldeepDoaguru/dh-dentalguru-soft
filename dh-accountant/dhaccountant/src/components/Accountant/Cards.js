import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PiStethoscopeBold } from "react-icons/pi";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { LiaMicroscopeSolid } from "react-icons/lia";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdPeople } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaHospitalUser } from "react-icons/fa6";
import { clearUser } from "../../redux/slices/UserSlicer";

const Cards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = user.token;
  // console.log(token);
  // console.log(
  //   `User Name: ${user.name}, User ID: ${user.id}, branch: ${user.branch}`
  // );
  // console.log("User State:", user);
  const [opdData, setOpdData] = useState([]);
  const [treatData, setTreatData] = useState([]);
  const [voucherAmt, setVoucherAmt] = useState([]);
  const [patientBill, setPatientBill] = useState([]);

  const getOpdData = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getOPDDetailsByBranch/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpdData(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 401) {
        // alert("Your token is expired please login again");
        dispatch(clearUser());
        navigate("/");
      }
    }
  };

  // console.log(opdData);
  //filter for patient treated today card
  const getDate = new Date();
  const year = getDate.getFullYear();
  const month = String(getDate.getMonth() + 1).padStart(2, "0");
  const day = String(getDate.getDate()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  console.log(formattedDate);

  const formattedAppointDate = `${year}-${month}-${day}`;
  console.log(formattedAppointDate);

  //filterForPatAppointToday
  // const filterForOpdAppointToday = opdData?.filter(
  //   (item) =>
  //     item.appointment_dateTime.split("T")[0] === formattedDate &&
  //     item.treatment_provided === "OPD"
  // );

  const filterForOpdAppointToday = opdData?.filter(
    (item) =>
      item.created_at?.split(" ")[0] === formattedAppointDate &&
      item.treatment_provided === "OPD" &&
      ["paid", "Credit"].includes(item.payment_Status)
  );

  console.log(filterForOpdAppointToday);

  const filterForAppointToday = opdData?.filter(
    (item) => item.appointment_dateTime?.split("T")[0] === formattedAppointDate
  );

  // console.log(filterForAppointToday);

  const totalOpdPrice = () => {
    try {
      let total = 0;
      filterForOpdAppointToday.forEach((item) => {
        total = total + parseFloat(item.opd_amount);
      });
      console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalOpdValue = totalOpdPrice();
  // console.log(totalOpdValue);

  const getTreatmentData = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getTreatmentDetailsByBranch/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTreatData(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 401) {
        // alert("Your token is expired please login again");
        navigate("/");
      }
    }
  };

  // console.log(treatData);
  //filterForPatAppointToday
  const filterForTreatAppointToday = treatData?.filter(
    (item) => item.payment_date_time?.split(" ")[0] === formattedDate
  );

  // console.log(filterForTreatAppointToday);

  // const totalTreatPrice = () => {
  //   try {
  //     let total = 0;
  //     filterForTreatAppointToday.forEach((item) => {
  //       total = total + (item.net_amount ? item.net_amount : 0);
  //     });
  //     // console.log(total);
  //     return total;
  //   } catch (error) {
  //     console.log(error);
  //     return 0;
  //   }
  // };

  // Bill Income Total

  const totalTreatPrice = () => {
    try {
      const getDate = new Date();
      const year = getDate.getFullYear();
      const month = String(getDate.getMonth() + 1).padStart(2, "0");
      const day = String(getDate.getDate()).padStart(2, "0");

      const formattedDate = `${day}-${month}-${year}`;

      // Filter for treatments/appointments today
      const filterForTreatAppointToday = treatData?.filter(
        (item) => item.payment_date_time?.split(" ")[0] === formattedDate
      );

      let total = 0;

      filterForTreatAppointToday?.forEach((item) => {
        if (item.payment_status === "paid") {
          total += item.paid_amount ? parseFloat(item.paid_amount) : 0; // Ensure to parse as float or integer based on your data type
        }
      });

      console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalTreatValue = totalTreatPrice();
  console.log(totalTreatValue);

  // const totalTreatPrice = () => {
  //   try {
  //     let total = 0;
  //     filterForTreatAppointToday.forEach((item) => {
  //       if (item.payment_status === "paid") {
  //         total = total + (item.paid_amount ? item.paid_amount : 0);
  //       }
  //     });
  //     // console.log(total);
  //     return total;
  //   } catch (error) {
  //     console.log(error);
  //     return 0;
  //   }
  // };

  // const totalTreatValue = totalTreatPrice();
  // console.log(totalTreatValue);

  const getVoucherAmount = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getVoucherListByBranch/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
      setVoucherAmt(data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(voucherAmt[0]?.voucher_date);
  // console.log(formattedDate);
  const filterForVoucherAmountToday = voucherAmt?.filter(
    (item) => item.voucher_date.split("T")[0] === formattedDate
  );

  // console.log(filterForVoucherAmountToday);
  const totalVoucherPrice = () => {
    try {
      let total = 0;
      filterForVoucherAmountToday.forEach((item) => {
        total = total + item.voucher_amount;
      });
      // console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalVoucherValue = totalVoucherPrice();
  // console.log(totalVoucherValue);

  const getPatientBill = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getPatientBillsByBranch/${user.branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatientBill(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterForPatientBillToday = patientBill?.filter(
    (item) => item.bill_date?.split(" ")[0] === formattedDate
  );

  // console.log(filterForPatientBillToday);

  useEffect(() => {
    getOpdData();
    getTreatmentData();
    getVoucherAmount();
    getPatientBill();

    const interval = setInterval(() => {
      getOpdData();
      getTreatmentData();
      getVoucherAmount();
      getPatientBill();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [user.branch]);

  return (
    <>
      <Container>
        <div className="row d-flex justify-content-around">
          <div
            className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0"
            onClick={() => navigate("/all-patient")}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column mb-3">
                <div className="text-light fs-1">
                  {/* <MdPeople /> */}
                  <BiSolidUserDetail />
                  {/* <FaHospitalUser /> */}
                </div>
                <div className="cardtext">
                  <h5 className="card-title text-light">All Patient Details</h5>
                  <p className="card-text text-light">View Details</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column mb-3">
                <div className="text-light fs-1">
                  <PiStethoscopeBold />
                </div>
                <div className="cardtext">
                  <h6 className="card-title text-light">Today OPD Income</h6>
                  <p className="card-text text-light fw-semibold">
                    {totalOpdValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column mb-3">
                <div className="text-light fs-1">
                  <MdOutlineLocalPharmacy />
                </div>
                <div className="cardtext">
                  <h6
                    className="card-title text-light"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Today Total Appointments
                  </h6>
                  <p className="card-text text-light fw-semibold">
                    {filterForAppointToday.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column mb-3">
                <div className="text-light fs-1">
                  {/* <LiaMicroscopeSolid /> */}
                  <GiReceiveMoney />
                  {/* <GiTakeMyMoney /> */}
                </div>
                <div className="cardtext">
                  <h6 className="card-title text-light">Today Bill Income</h6>
                  <p className="card-text text-light fw-semibold">
                    {totalTreatValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column mb-3">
                <div className="text-light fs-1">
                  <LiaFileInvoiceDollarSolid />
                </div>
                <div className="cardtext">
                  <h5 className="card-title text-light">Expense Amount</h5>
                  <p className="card-text text-light fw-semibold">
                    {totalVoucherValue}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-xxl-2 col-xl-2 col-lg-2 col-sm-8 col-8 col-md-2 my-3 p-0">
            <div className="card">
              <div className="card-body d-flex justify-content-center flex-column">
                <div>
                  <TbReportSearch className="bi bi-people-fill icon" />
                </div>

                <div className="cardtext">
                  <h6
                    className="card-title text-light"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Today Total Bills
                  </h6>
                  <p className="card-text text-light fw-semibold">
                    {filterForPatientBillToday.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cards;

const Container = styled.div`
  .card {
    background: #201658;
    height: 9.5rem;
    border: none;
    box-shadow: 1px 2px 8px black;
    &:hover {
      background: #9b59b6;
    }
  }

  .icon {
    font-size: 40px;
    /* align-items: start; */
    color: white;
    /* display: flex; */
  }
  .card-body {
    text-align: center;
    padding: 5px;
  }
  .card-link {
    text-decoration: none;
    font-size: small;
  }

  .cardtext {
    h5 {
      color: white;
    }
    p {
      color: white;
    }
  }
  .noUnderline {
    text-decoration: none;
    /* Add any other styles you want for the link here */
  }
`;
