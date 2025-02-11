import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Sider from "../../../components/Sider";
import Header from "../../../components/Header";
import { IoMdArrowRoundBack } from "react-icons/io";
import BranchSelector from "../../../components/BranchSelector";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";

const EmpDetailsRepo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [designation, setDesignation] = useState("");

  const getDocDetailsList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getEmployeeDataByBranch/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(data);
      setDoctorList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getDocDetailsList();
  }, []);
  useEffect(() => {
    getDocDetailsList();
  }, [branch.name]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const goBack = () => {
    window.history.go(-1);
  };

  const downloadEmployeeData = async () => {
    try {
      const { data } = await axios.post(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/downloadStaffReport/${branch.name}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);
      // setSelectedEarn(data);
      if (Array.isArray(data)) {
        // Create a new workbook
        const workbook = utils.book_new();

        // Convert the report data to worksheet format
        const worksheet = utils.json_to_sheet(data);

        utils.book_append_sheet(workbook, worksheet, `Employee Report`);
        writeFile(workbook, `employee-report.xlsx`);
        console.log(data);
      } else {
        console.error("data is not an array");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <Header />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-1 p-0">
                <Sider />
              </div>
              <div className="col-lg-11 col-11 ps-0">
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                  <div className="container-fluid">
                    <div className="row mt-3">
                      {/* <div className="col-1"></div> */}

                      <div className="col-12">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                          <div class="container d-flex justify-content-center">
                            <h2 className="">Employee Details Report</h2>
                          </div>
                        </nav>
                      </div>
                      <div className="container mt-3">
                        <div className="d-flex justify-content-between mb-2 mt-4">
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-warning mx-2 text-white shadow"
                              style={{
                                backgroundColor: "#014cb1",
                                borderColor: "#014cb1",
                              }}
                              onClick={downloadEmployeeData}
                            >
                              Download Report
                            </button>
                          </div>

                          <div className="d-flex justify-content-between">
                            <div>
                              <button
                                className="btn btn-info text-white shadow"
                                style={{
                                  backgroundColor: "#014cb1",
                                  borderColor: "#014cb1",
                                }}
                              >
                                Filter by Designation
                              </button>
                            </div>

                            <div className="mx-2">
                              <select
                                class="form-select"
                                aria-label="Default select example"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                              >
                                <option value="">Select-designation</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="lab attendant">
                                  Lab Attendant
                                </option>
                                <option value="helper">Helper</option>
                                <option value="consultant">Consultant</option>
                                <option value="accountant">Acountant</option>
                                <option value="receptionist">
                                  Receptionist
                                </option>
                              </select>
                            </div>
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
                            <div class="table-responsive mt-4">
                              <table class="table table-bordered">
                                <thead className="table-head">
                                  <tr>
                                    <th className="thead sticky">Emp ID</th>
                                    <th className="thead sticky">Name</th>
                                    <th className="thead sticky">Mobile</th>
                                    <th className="thead sticky">Email</th>
                                    <th className="thead sticky">
                                      Designation
                                    </th>
                                    <th className="thead sticky">Role</th>
                                    <th className="thead sticky">Salary</th>
                                    <th className="thead sticky">Address</th>
                                    <th className="thead sticky">
                                      Profile Picture
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {doctorList
                                    ?.filter((val) => {
                                      if (designation === "") {
                                        return true;
                                      } else if (
                                        val.employee_designation
                                          .toLowerCase()
                                          .includes(designation.toLowerCase())
                                      ) {
                                        return val;
                                      }
                                    })
                                    .map((item) => (
                                      <>
                                        <tr className="table-row">
                                          <td className="thead">
                                            {item.employee_ID}
                                          </td>
                                          <td className="thead">
                                            {item.employee_name}
                                          </td>
                                          <td className="thead">
                                            {item.employee_mobile}
                                          </td>

                                          <td className="thead">
                                            {item.employee_email}
                                          </td>
                                          <td className="thead">
                                            {item.employee_designation}
                                          </td>
                                          <td className="thead">
                                            {item.employee_role}
                                          </td>
                                          <td className="thead">
                                            {item.salary}
                                          </td>
                                          <td className="thead">
                                            {item.address}
                                          </td>
                                          <td>
                                            <div className="smallImg">
                                              <img
                                                src={item.employee_picture}
                                                alt="profile"
                                              />
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

export default EmpDetailsRepo;
const Container = styled.div`
  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }
  .table-responsive {
    height: 30rem;
  }
  th {
    background-color: #004aad;
    color: white;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }

  .smallImg {
    img {
      height: 6rem;
      width: auto;
    }
  }

  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
`;
