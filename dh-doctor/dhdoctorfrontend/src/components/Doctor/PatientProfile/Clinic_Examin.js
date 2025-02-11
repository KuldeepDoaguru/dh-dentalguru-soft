// import React from 'react'
// import styled from 'styled-components'

// function Clinic_Examin() {
//   return (
//     <Wrapper>
//       <div className="table">
//          <div
//         className="widget-area-2 proclinic-box-shadow mx-3 mt-5"
//         id="tableres"
//       >
//         <div className="table-responsive">
//           <table className="table table-bordered table-striped">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Treatment</th>
//                 <th>Chief Complaint</th>
//                 <th>Issue</th>
//                <th>Diagnosis</th>
//                 <th>Investigation</th>
//                 <th>Added By</th>
//                 <th>Action</th>

//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>25-09-23</td>
//                 <td>Root Canal</td>
//                 <td>Tooth Pain</td>
//                 <td>Tooth Decay</td>
//                 <td>Tooth Infection</td>
//                 <td>Decayed Tooth 25 27 28</td>
//                 <td>Dr.Anurag Varma</td>
//                 <td>Edit/Delete/View</td>

//               </tr>

//             </tbody>
//           </table>
//         </div>
//       </div></div>
//     </Wrapper>
//   )
// }

// export default Clinic_Examin
// const Wrapper = styled.div`

// .table{
//     @media screen and (max-width: 768px) {
//       width: 22rem;
//       margin-left: -0.1rem;

//     }
//   }
// `

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const ClinicExamin = () => {
  const dispatch = useDispatch();
  // const { pid } = useParams();
  const { uhid } = useParams();
  const user = useSelector((state) => state.user);
  const token = user.currentUser.token;
  // console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = user.currentUser.branch_name;
  console.log(branch);

  const [exmData, setExmData] = useState([]);

  const getExamineDetails = async () => {
    try {
      // const { data } = await axios.get(
      //   `http://localhost:7777/api/v1/super-admin/examinDetailsByPatId/${pid}`
      // );
      const respsData = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getDentalPatientDataByID/${uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExmData(respsData.data);
      console.log(respsData.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(exmData);
  useEffect(() => {
    getExamineDetails();
  }, []);
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
                      {/* <td>{item.examin_date?.split("T")[0]}</td> */}
                      <td>{item.date?.split(" ")[0]}</td>
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
