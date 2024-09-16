import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const ClinicExamin = () => {
  const dispatch = useDispatch();
  const { pid } = useParams();
  const user = useSelector((state) => state.user);
  // console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  // console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  // console.log(`User Name: ${branch.name}`);
  const [exmData, setExmData] = useState([]);

  const getExamineDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getExaminationViaUhid/${branch.name}/${pid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setExmData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExamineDetails();
  });
  return (
    <Wrapper>
      <div className="table cont-box">
        <div
          className="widget-area-2 proclinic-box-shadow mx-3 mt-5"
          id="tableres"
        >
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Diagnosis Category</th>
                  <th>Disease</th>
                  <th>Chief Complaint</th>
                  <th>Tooth</th>
                  <th>On Examination</th>
                  <th>Advice</th>
                </tr>
              </thead>
              <tbody>
                {exmData?.map((item) => (
                  <>
                    <tr>
                      <td>
                        {item.date?.split(" ")[0]}{" "}
                        {moment(item.date?.split(" ")[1], "HH:MM:ss").format(
                          "hh:mm A"
                        )}
                      </td>
                      <td>{item.diagnosis_category}</td>
                      <td>{item.disease}</td>

                      <td>{item.chief_complain}</td>
                      <td>{item.selected_teeth}</td>

                      <td>{item.on_examination}</td>
                      <td>{item.advice}</td>
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

export default ClinicExamin;
const Wrapper = styled.div`
  .table {
    @media screen and (max-width: 768px) {
      width: 22rem;
      margin-left: -0.1rem;
    }
  }

  .cont-box {
    width: 100%;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
`;
