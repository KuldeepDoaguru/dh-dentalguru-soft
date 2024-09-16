import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "../../animation/loading-effect.json";
import HeaderAdmin from "../HeaderAdmin";
import SiderAdmin from "../SiderAdmin";

const PrescriptionList = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const [presData, setPresData] = useState([]);
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getPresList = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getPrescriptionList/${user.branch_name}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPresData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPresList();
  }, []);

  console.log(presData);

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
              <div className="col-lg-11 col-11 ps-0">
                <div className="row d-flex justify-content-between mx-3">
                  <div className="col-12 col-md-12">
                    <div className="marginpot">
                      <h2 className="text-center">e-Prescription List</h2>
                      <div className="container-fluid mt-3">
                        {loading ? (
                          <>
                            <div className="d-flex justify-content-center w-100">
                              <Lottie
                                options={defaultOptions}
                                height={300}
                                width={400}
                                style={{ background: "transparent" }}
                              ></Lottie>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="table-responsive rounded">
                              <table class="table table-bordered rounded shadow">
                                <thead className="table-head">
                                  <tr>
                                    <th
                                      className="table-sno sticky"
                                      style={{ width: "10%" }}
                                    >
                                      TPID
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Prescription Date
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "20%" }}
                                    >
                                      Branch Name
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "20%" }}
                                    >
                                      Patient UHID
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Disease
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Treatments
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Medicine Name
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Selected Teeth
                                    </th>

                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Assigned Doctor
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Chief Complain
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Examination
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      Advice
                                    </th>
                                    <th
                                      className="table-small sticky"
                                      style={{ width: "10%" }}
                                    >
                                      View Details
                                    </th>

                                    {/* <th
                                className="table-small"
                                style={{ width: "10%" }}
                              >
                                Delete
                              </th> */}
                                  </tr>
                                </thead>

                                <tbody>
                                  {presData?.map((item, index) => (
                                    <>
                                      <tr className="table-row">
                                        <td
                                          className="table-sno"
                                          style={{ width: "10%" }}
                                        >
                                          {item.tp_id}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "20%" }}
                                        >
                                          {item.date?.split(" ")[0]}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "20%" }}
                                        >
                                          {item.branch_name}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.patient_uhid}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.desease}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.treatment}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.medicine_name}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.selected_teeth}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.doctor_name}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.chief_complain}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.on_examination}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          {item.advice}
                                        </td>
                                        <td
                                          className="table-small"
                                          style={{ width: "10%" }}
                                        >
                                          <button
                                            className="btn btn-warning"
                                            onClick={(e) =>
                                              navigate(
                                                `/view-prescription/${item.tp_id}`
                                              )
                                            }
                                          >
                                            View Details
                                          </button>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
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

export default PrescriptionList;
const Container = styled.div`
  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  th {
    background-color: #004aad;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  .imgData {
    height: 10rem;
    width: auto;
  }

  .smallImg {
    img {
      height: 6rem;
      width: auto;
    }
  }

  .table-responsive {
    max-height: 30rem;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #1abc9c;
    color: white;
    z-index: 1;
  }

  .marginpot {
    margin-top: 10rem;
  }
`;
