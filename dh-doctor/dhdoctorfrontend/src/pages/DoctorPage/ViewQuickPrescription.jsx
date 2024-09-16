import axios from "axios";
import cogoToast from "cogo-toast";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const ViewQuickPrescription = () => {
  const { uhid, appointId } = useParams();
  console.log(useParams());

  const user = useSelector((state) => state.user);
  const token = user.currentUser.token;
  console.log(user);
  const branch = user.currentUser.branch_name;
  console.log(branch);
  const [getExaminData, setGetExaminData] = useState([]);
  const [getTreatData, setGetTreatData] = useState([]);
  const [getTreatMedicine, setGetTreatMedicine] = useState([]);
  const [getTreatSug, setGetTreatSug] = useState([]);
  const [getBranch, setGetBranch] = useState([]);

  const [getLabData, setGetLabData] = useState([]);

  const [getPatientData, setGetPatientData] = useState([]);
  const navigate = useNavigate();

  const getBranchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getBranchDetails/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setGetBranch(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getBranch);
  console.log(getPatientData);

  // Get Patient Details START
  const getPatientDetail = async () => {
    try {
      const res = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getPatientByAppID/${appointId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetPatientData(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getTreatPrescriptionByAppointId = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getQuickPrescription/${appointId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetTreatMedicine(data);
      console.log(data);
      // setGetSum(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetail();
    getBranchDetails();
    getTreatPrescriptionByAppointId();
  }, []);

  console.log(getTreatMedicine);

  const goBack = () => {
    window.history.go(-1);
  };

  const handleButton = async () => {
    try {
      window.print();
    } catch (error) {
      console.log("Error updating sitting count", error);
    }
  };

  return (
    <>
      <Wrapper>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-success no-print text-white shadow"
              style={{
                backgroundColor: "#0dcaf0",
                border: "#0dcaf0",
              }}
              onClick={goBack}
            >
              <IoMdArrowRoundBack /> Back
            </button>
            <button
              className="btn btn-success no-print mx-3 mb-3 mt-2 no-print text-white shadow"
              style={{
                backgroundColor: "#0dcaf0",
                border: "#0dcaf0",
              }}
              onClick={handleButton}
            >
              Print
            </button>
          </div>
          <div className="row">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="clinic-logo">
                <img
                  src={getBranch[0]?.head_img}
                  alt="header"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
              <div className="header-left">
                <h3 className="text-start">
                  Dr. {user.currentUser.employee_name}
                </h3>
                <h6
                  className="fw-bold text-capitalize text-start"
                  style={{ color: "#00b894" }}
                >
                  PH: {user.currentUser.employee_mobile}
                </h6>

                <h6 className="fw-bold text-capitalize text-start">
                  Email: {user.currentUser.email}
                </h6>

                {/* <h6 className="fw-bold text-capitalize text-start">
                  hospital_name
                </h6> */}
                <h6 className="fw-bold text-capitalize text-start">
                  Hospital Name : {getBranch[0]?.hospital_name}
                </h6>
                <h6 className="fw-bold text-capitalize text-start">
                  Date :{" "}
                  {/* {moment(getTreatMedicine[0]?.date, "YYYY-MM-DD").format(
                    "DD-MM-YYYY"
                  )} */}
                  {getTreatMedicine[0]?.date}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid dummy-cont h-100">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              {/* <h6 className="fw-bold text-capitalize text-end">
                Sitting Number : sitting
              </h6> */}
              <table className="table table-bordered border">
                <tbody>
                  <>
                    <tr>
                      <th scope="row">UHID</th>
                      <td>{uhid}</td>
                      <th scope="row">Blood Group</th>
                      <td>{getPatientData[0]?.bloodgroup}</td>
                    </tr>
                    <tr>
                      <th scope="row">Patient Name</th>
                      <td>{getPatientData[0]?.patient_name}</td>
                      <th scope="row">Disease</th>
                      <td>{getPatientData[0]?.disease}</td>
                    </tr>
                    <tr>
                      <th scope="row">Patient Mobile No.</th>
                      <td>{getPatientData[0]?.mobileno}</td>
                      <th scope="row">Allergy</th>
                      <td>{getPatientData[0]?.allergy}</td>
                    </tr>
                  </>
                </tbody>
              </table>
              <div className="treatment">
                {/* <p className="fs-4 fw-bold">Treatment</p> */}
                {/* <div>
                  <p className="fs-6 px-3">treatment_name</p>
                </div> */}
              </div>
              <div className="diagnosis">
                <p className="text-start fs-4 fw-bold">Diagnosis</p>
                <table className="table table-bordered border">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Chief Complain</th>
                      <th>On Exmination</th>
                      <th>Advice</th>
                    </tr>
                  </thead>
                  {getTreatMedicine?.map((item, index) => (
                    <tbody>
                      <>
                        <tr>
                          <td>{item.date?.split(" ")[0]}</td>
                          <td>{item.chief_complain}</td>
                          <td>{item.onexam}</td>
                          <td>{item.advice}</td>
                        </tr>
                      </>
                    </tbody>
                  ))}
                </table>
              </div>

              <div className="Medicine">
                <p className="text-start fs-4 fw-bold">Medicine Details</p>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-striped border">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTreatMedicine?.map((item, index) => (
                      <>
                        <tr key={index + 1}>
                          <td>{item.date?.split(" ")[0]}</td>
                          <td>{item.medicines}</td>
                          <td>{item.dosage}</td>
                          <td>{item.frequency}</td>
                          <td>{item.duration}</td>
                          <td>{item.note}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sign-seal">
                <div>
                  <h4>Doctor's signature</h4>
                </div>
                <div>
                  <h4>Patient's signature</h4>
                </div>
              </div>
              <div className="text-center mb-5">
                {/* <button
                  className="btn btn-success no-print mx-3 mb-3 mt-2 no-print"
                  onClick={handleButton}
                >
                  Print
                </button> */}
                {/* <button
                  className="btn btn-info no-print mx-3 mb-3 mt-2"
                  onClick={() => navigate("/doctor-dashboard")}
                >
                  Appointment Dashboard
                </button> */}
                {/* <button
                  className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
                  style={{
                    backgroundColor: "#0dcaf0",
                    border: "#0dcaf0",
                  }}
                  //   onClick={handleTreatNavigattion}
                >
                  Treatment Dashboard
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default ViewQuickPrescription;
const Wrapper = styled.div`
  overflow: hidden;
  background-color: white;
  height: 100%;
  /* .dummy-cont {
    width: 90%;
  } */
  .doctor-detail {
    margin-bottom: 0.5rem;
  }
  @media print {
    @page {
      margin: 2rem; /* Remove default page margins */
    }

    body {
      margin: 0; /* Ensure no margin on the body */
    }

    .container-fluid {
      width: 100%; /* Optionally set the width */
      margin: 0; /* Remove margin */
      padding: 0; /* Remove padding */
      page-break-before: auto;
    }
  }
  @media print {
    .no-print {
      display: none !important;
    }
  }

  .headerimg {
    img {
      width: 100%;
      height: 8.5rem;
    }
  }

  .sign-seal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }

  .clinic-logo {
    height: 9rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 100%;
      width: 100%;
    }
  }
  td,
  th {
    font-size: 14px;
  }
`;
