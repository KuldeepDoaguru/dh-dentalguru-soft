import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import Header from "../components/Header";
import Sider from "../components/Sider";

const BranchInfo = () => {
  const [branchDetail, setBranchDetail] = useState([]);
  const [branchHolidays, setBranchHolidays] = useState([]);

  const user = useSelector((state) => state.user);
  const token = user.token;
  console.log("User State:", user);
  const branch = user.branch;
  console.log(branch);

  // const {refreshTable,currentUser} = useSelector((state) => state.user);
  // const  branch = currentUser?.branch_name;
  const getBranchDetail = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-branch-detail/${branch}`
      );
      console.log(response);
      setBranchDetail(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBranchHolidays = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-branch-holidays/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setBranchHolidays(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBranchDetail();
    getBranchHolidays();
  }, []);

  console.log(branchDetail);
  return (
    <>
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
            <div className="container-fluid  shadow p-3 mt-5 bg-body rounded">
              <div className="row">
                <div className="col-lg-12 col-12">
                  <div className="text-start p-2">
                    <h3>Clinic Details</h3>
                    <hr />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="text-class">Clinic Name</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.hospital_name}</p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="text-class">Clinic Id</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.hospital_id}</p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="text-class">Branch Name</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.branch_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="text-class">Branch Id</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.branch_id}</p>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <label className="text-class">Address</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.branch_address}</p>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <label className="text-class">Contact Number</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.branch_contact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="text-class">Email</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.branch_email}</p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="text-class">Open Time</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">
                          {branchDetail[0]?.open_time
                            ? moment(
                                branchDetail[0]?.open_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("hh:mm A")
                            : ""}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="text-class">Close Time</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">
                          {branchDetail[0]?.close_time
                            ? moment(
                                branchDetail[0]?.close_time,
                                "HH:mm:ss.SSSSSS"
                              ).format("hh:mm A")
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="text-class">Week Off</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">{branchDetail[0]?.week_off}</p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="text-class">Slot Duration</label>
                      <div className="shadow-none p-1 bg-light rounded">
                        <p className="m-0">
                          {branchDetail[0]?.appoint_slot_duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div
                className="widget-area-2 proclinic-box-shadow  mt-5"
                id="tableres"
              >
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Holiday Id</th>
                        <th>Holiday Name</th>
                        <th>Holiday Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchHolidays.map((data, index) => (
                        <tr key={index}>
                          <td>{data.holiday_id}</td>
                          <td>{data.holiday_name}</td>
                          <td>
                            {data?.holiday_date
                              ? moment(data?.holiday_date).format("DD/MM/YYYY")
                              : ""}
                          </td>
                          <td>
                            {data?.holiday_start_time
                              ? moment(
                                  data?.holiday_start_time,
                                  "HH:mm:ss.SSSSSS"
                                ).format("hh:mm A")
                              : ""}
                          </td>

                          <td>
                            {data?.holiday_end_time
                              ? moment(
                                  data?.holiday_end_time,
                                  "HH:mm:ss.SSSSSS"
                                ).format("hh:mm A")
                              : ""}
                          </td>
                          <td>{data.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default BranchInfo;

const Wrapper = styled.div`
  overflow: hidden;
  img {
  }
  /* .mrgnzero {
    margin-right: 0rem;
  } */
  #set {
    margin-left: -4rem;
    padding-left: 140px; /* Width of sidebar */
    padding-right: 26px;
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
      margin-left: -0.5rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 0.1rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
      margin-left: 1.5rem;
    }

    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      margin-left: 3.5rem;
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
    background-color: #201658;
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
  .text-class {
    color: #201658;
    font-weight: 600;
  }
`;
