import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Lab = () => {
  const { uhid } = useParams();
  console.log(uhid);
  const [testData, setTestData] = useState([]);
  const user = useSelector((state) => state.user);
  const token = user.currentUser.token;
  const getLabTest = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getPatientLabTestByPatientId/${uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestData(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(testData);
  useEffect(() => {
    getLabTest();
  }, []);
  return (
    <Wrapper>
      <div className="table">
        <div
          className="widget-area-2 proclinic-box-shadow mx-3 mt-5"
          id="tableres"
        >
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Treatment Package ID</th>
                  <th>Doctor</th>
                  <th>Lab Name</th>
                  <th>Test Name</th>
                  <th>Test Date</th>
                  <th>Test Status</th>
                  <th>View Report</th>
                </tr>
              </thead>
              <tbody>
                {testData?.map((item) => (
                  <>
                    <tr>
                      <td>{item.testid}</td>
                      <td>{item.tpid}</td>
                      <td>{item.assigned_doctor_name}</td>
                      <td>{item.lab_name}</td>
                      <td>{item.test}</td>
                      <td>
                        {moment(item.created_date?.split("T")[0]).format(
                          "DD/MM/YYYY"
                        )}
                      </td>
                      <td>{item.test_status}</td>
                      <td>
                        {item?.file_paths?.split(",").map((val, index) => (
                          <>
                            <a href={val} target="_blank">
                              <button
                                className="btn btn-success shadow m-2"
                                style={{
                                  backgroundColor: "#0dcaf0",
                                  border: "#0dcaf0",
                                }}
                              >
                                File {index + 1}
                              </button>
                            </a>
                          </>
                        ))}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Lab;
const Wrapper = styled.div`
  .table {
    @media screen and (max-width: 768px) {
      /* width: 20rem;
      margin-left: -0.2rem; */
    }
  }
`;
