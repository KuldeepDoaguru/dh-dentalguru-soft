import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Header from "../../components/Header";
import Sider from "../../components/Sider";
import Navbar from "./Navbar";
import moment from "moment";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { pid } = useParams();
  const user = useSelector((state) => state.user);

  const branch = user?.branch;
  const token = user?.token;

  const [patientData, setPatientData] = useState([]);
  const [ongoingTreat, setOngoingTreat] = useState([]);

  const getPatient = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-Patient-by-id/${branch}/${pid}`,
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
  console.log(branch);
  const getOngoingTreat = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getTreatmentViaUhid/${branch}/${pid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setOngoingTreat(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // patientProfileData();
    getPatient();
    getOngoingTreat();
  }, []);

  console.log(patientData);

  const filterForOngoingTreat = ongoingTreat?.filter((item) => {
    return item.treatment_status === "ongoing";
  });

  console.log(filterForOngoingTreat);

  return (
    <Wrapper>
      <div className="header">
        <Header />
      </div>

      <div className="row mrgnzero">
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
          <button
            className="btn btn-success no-print"
            onClick={() => window.history.go(-1)}
          >
            <IoMdArrowRoundBack /> Back
          </button>
          <div className="container-fluid">
            <div className="text-center">
              <h3>Patient Profile</h3>
            </div>
            <div className="d-flex justify-content-between">
              {/* <BranchSelector /> */}
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
              <h2 className="mt-3 text-capitalize">
                {patientData?.patient_name}
              </h2>

              <div className="">
                <div className="p-2 bg-light w-100 rounded">
                  <h6 className="fw-bold mt-2">Basic Info</h6>
                </div>
                <div className="container">
                  <ul className="list-unstyled w-100">
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>UHID :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData.uhid}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Gender :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.gender}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Mobile No. :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.mobileno}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Email :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.emailid}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>DOB :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">
                              {moment(
                                patientData?.dob,
                                "YYYY-MM-DDTHH:mm:ss"
                              ).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Age :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.age}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Address :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.address}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Aadhaar No. :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.aadhaar_no}</span>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Blood Group :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.bloodgroup}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Weight :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.weight}</span>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Patient Type :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">
                              {patientData?.patient_type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-7 col-md-6 col-sm-6 col-12">
                            <strong>Contact Person :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">
                              {patientData?.contact_person}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Contact Person Name :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">
                              {patientData?.contact_person_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Allergy :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.allergy}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Disease :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.disease}</span>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
                            <strong>Branch :</strong>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                            <span className="">{patientData?.branch_name}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <div className="p-2 bg-light rounded">
                  <h6 className="fw-bold mt-2">Ongoing Treatment</h6>
                  <div className="container">
                    <ul className="ongoing-treat">
                      {filterForOngoingTreat?.map((item) => (
                        <>
                          <li>
                            <p className="">{item.treatment_name}</p>
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12 col-sm-12">
              <div className="mrgtop">
                <Navbar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default PatientProfile;
const Wrapper = styled.div`
  .ongoing-treat {
    line-height: 1.9rem;
  }
  #sider {
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

  strong {
    width: 50%;
  }

  .mrgnzero {
    margin-right: 0rem;
  }
  .mrgtop {
    margin-top: 4rem;
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
      margin-left: 2.1rem;
    }

    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      margin-left: 2.7rem;
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
