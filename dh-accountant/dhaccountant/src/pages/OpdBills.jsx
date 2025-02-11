// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import Header from "../components/Header";
// import { Link, useParams } from "react-router-dom";
// import { IoArrowBackSharp } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const OpdBills = () => {
//   const { bid } = useParams();
//   const [opdAmount, setOpdAmount] = useState([]);
//   const user = useSelector((state) => state.user);
//   const [branchData, setBranchData] = useState([]);
//   const containerRef = useRef(null);
//   console.log(
//     `User Name: ${user.name}, User ID: ${user.id}, branch: ${user.branch}`
//   );
//   console.log("User State:", user);

//   const goBack = () => {
//     window.history.go(-1);
//   };

//   console.log(bid);
//   const getOpdAmt = async () => {
//     try {
//       const { data } = await axios.get(
//         `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getAppointmentDetailsViaIDOPD/${bid}`
//       );
//       setOpdAmount(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const branchDetails = async () => {
//     try {
//       const { data } = await axios.get(
//         `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getBranchDetailsByBranch/${user.branch}`
//       );
//       setBranchData(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getOpdAmt();
//     branchDetails();
//   }, []);

//   console.log(opdAmount);
//   console.log(branchData);

//   const handlePrint = () => {
//     const contentToPrint =
//       document.getElementById("printableContent").innerHTML;
//     const originalContent = document.body.innerHTML;

//     document.body.innerHTML = contentToPrint;

//     window.print();

//     document.body.innerHTML = originalContent;
//   };
//   return (
//     <>
//       <Container>
//         <Header />

//         <div className="container-fluid">
//           <div className="row Button mt-2">
//             <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
//               <IoArrowBackSharp className="fs-1 text-black" onClick={goBack} />
//             </div>
//           </div>
//         </div>

//         <div className="container print-box" id="printableContent">
//           <div className="row">
//             <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
//               <div className="row d-flex justify-content-between mt-3">
//                 <div className="">
//                   <div className="mt-3">
//                     <h3>{branchData[0]?.hospital_name.toUpperCase()}</h3>
//                     <h5>Branch : {user.branch}</h5>
//                   </div>
//                   <form className="d-flex ms-auto my-sm">
//                     <h6>Addresh : </h6>
//                     <h6 className="ms-2">{branchData[0]?.branch_address}</h6>
//                   </form>
//                   <form className="d-flex ms-auto my-sm mt-1">
//                     <h4>Contact Number : </h4>
//                     <h4 className="ms-2">{branchData[0]?.branch_contact}</h4>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <hr
//             style={{
//               color: "Grey",
//               height: "2px",
//             }}
//           />

//           <div className="mt-4">
//             <div class="table-responsive rounded">
//               <table class="table table-bordered rounded shadow">
//                 <tbody>
//                   <tr className="table-row">
//                     <td>
//                       Patient Name :{" "}
//                       <strong>
//                         {opdAmount[0]?.patient_name.toUpperCase()}
//                       </strong>
//                     </td>
//                     <td>
//                       Date :{" "}
//                       <strong>
//                         {opdAmount[0]?.appointment_dateTime
//                           .split("T")[0]
//                           .toUpperCase()}
//                       </strong>
//                     </td>
//                   </tr>
//                 </tbody>
//                 <tbody>
//                   <tr className="table-row">
//                     <td>
//                       Patient Address :{" "}
//                       <strong>{opdAmount[0]?.address.toUpperCase()}</strong>
//                     </td>
//                     <td>
//                       Age/Sex :{" "}
//                       <strong>
//                         {opdAmount[0]?.age.toUpperCase()} /{" "}
//                         {opdAmount[0]?.gender.toUpperCase()}
//                       </strong>
//                     </td>
//                   </tr>
//                 </tbody>
//                 <tbody>
//                   <tr className="table-row">
//                     <td>
//                       Phone Number :{" "}
//                       <strong>{opdAmount[0]?.mobileno.toUpperCase()}</strong>
//                     </td>
//                     <td>
//                       Consaltant :{" "}
//                       <strong>
//                         {opdAmount[0]?.assigned_doctor_name.toUpperCase()}
//                       </strong>
//                     </td>
//                   </tr>
//                 </tbody>
//                 <tbody>
//                   <tr className="table-row">
//                     <td>
//                       Email id :{" "}
//                       <strong>{opdAmount[0]?.emailid.toUpperCase()}</strong>
//                     </td>
//                     <td>
//                       OPD Fee :{" "}
//                       <strong>{opdAmount[0]?.opd_amount.toUpperCase()}</strong>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="d-flex justify-content-center mb-5 mt-3">
//           <div className="table-small">
//             <button className="btn px-5 py-3" onClick={handlePrint}>
//               Print
//             </button>
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default OpdBills;
// const Container = styled.div`
//   @media print {
//     .Button {
//       display: none; /* Hide the button when printing */
//     }
//     .print-box {
//       width: 100%;
//     }
//   }
//   .table-small {
//     button {
//       background: #201658;
//       color: white;
//     }
//   }
// `;

import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SiGmail, SiGooglemessages } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaPrint } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const PrintOpdBill = () => {
  const pdfRef = useRef();
  const contentRef = useRef();
  const { bid } = useParams();
  const user = useSelector((state) => state.user);
  const token = user.token;
  console.log(token);
  const { refreshTable } = useSelector((state) => state.user);
  const branch = user.branch;

  const [data, setData] = useState("");

  const [hospitalDoc, setHospitalDoc] = useState([]);
  const navigate = useNavigate();

  const displayDocHospital = async () => {
    console.log(user.id);
    try {
      const viewDoc = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getBranchDetails/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(viewDoc.data);
      setHospitalDoc(viewDoc.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(hospitalDoc);

  const getBill = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-appointment-by-id/${branch}/${bid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response?.data?.data);
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
      cogoToast.error("error in getting appointment");
    }
  };

  useEffect(() => {
    // displayDocHospital();
    getBill();
    displayDocHospital();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const goBack = () => {
    window.history.go(-1);
  };

  console.log(data);
  // const handleDownloadPdf = async () => {
  //   const element = contentRef.current;
  //   const canvas = await html2canvas(element);
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF();
  //   const imgWidth = 210; // A4 width in mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save("sitting bill.pdf");
  // };

  const handleDownloadPdf = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2 }); // Increase the scale for better quality
    const imgData = canvas.toDataURL("image/jpeg", 0.75); // Use JPEG with 75% quality

    const pdf = new jsPDF();
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, "FAST"); // Use 'FAST' for compression
    pdf.save("sitting bill.pdf");
  };

  const sendPrescriptionMail = async () => {
    if (!data.emailid) {
      alert("Email id not available");
      return;
    }
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2 }); // Increase the scale for better quality
      const imgData = canvas.toDataURL("image/jpeg", 0.75);
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      const pdfData = pdf.output("blob");
      console.log(pdfData);

      const formData = new FormData();
      formData.append("email", data?.emailid);
      formData.append("patient_name", data?.patient_name);
      formData.append(
        "subject",
        `${data?.patient_name}, your Security Amount bill file`
      );
      formData.append(
        "textMatter",
        `Dear ${data?.patient_name}, Please find the attached OPD bill file. \n` +
          `Clinic Details:\n` +
          `Name: ${hospitalDoc[0]?.hospital_name}\n` +
          `Contact: ${hospitalDoc[0]?.branch_contact}\n` +
          `Address: ${hospitalDoc[0]?.branch_address}\n` +
          `Email: ${hospitalDoc[0]?.branch_email}\n\n` +
          `Thank you for choosing ${hospitalDoc[0]?.hospital_name}.\n\n` +
          `Best regards,\n` +
          `${hospitalDoc[0]?.hospital_name} Team`
      );
      formData.append("file", pdfData, "Security_Amount.pdf");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      cogoToast.success("OPD Amount bill Sending to email");
      const response = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/prescriptionOnMail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("OPD Amount Bill sent successfully");
      console.log(response);
      console.log("PDF sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending PDF:", error);
      cogoToast.error("Error to send bill");
    }
  };

  const sendPrescriptionWhatsapp = async () => {
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2 }); // Increase the scale for better quality
      const imgData = canvas.toDataURL("image/jpeg", 0.75);
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      const pdfData = pdf.output("blob");
      console.log(pdfData);

      const formData = new FormData();
      formData.append("phoneNumber", data?.mobileno);
      formData.append("message", "test message");
      // Convert Blob to a File
      const file = new File([pdfData], "Security_Amount.pdf", {
        type: "application/pdf",
      });

      formData.append("media_url", file);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await axios.post(
        "https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/sendWhatsapp",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      cogoToast.success("OPD Amount bill sent successfully");
      console.log("PDF sent successfully");
    } catch (error) {
      console.error("Error sending PDF:", error);
      cogoToast.error("Error to send OPD Amount bill");
    }
  };

  return (
    <Container>
      {/* <div ref={pdfRef}> */}
      <div ref={contentRef}>
        <div className="headimage">
          <img src={hospitalDoc[0]?.head_img} alt="header" />
        </div>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-12 ">
              <h5 className="text-center heading"> OPD RECIEPT</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th className="text-start">Appointment Id</th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.appoint_id}
                    </td>

                    <th scope="col" className="text-start">
                      Patient id
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.uhid}
                    </td>
                  </tr>

                  <tr>
                    <th scope="col" className="text-start">
                      Branch Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.branch_name}
                    </td>

                    <th scope="col" className="text-start">
                      Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.patient_name}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start pe-5">
                      Mobile No
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.mobileno}
                    </td>
                    <th scope="col" className="text-start">
                      Gender
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.gender}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Patient Type
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.patient_type}
                    </td>

                    {/* <th scope="col" className="text-start">
                      Appointment
                    </th> */}
                    <th scope="col" className="text-start">
                      Date
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.appointment_dateTime
                        ? moment(
                            data?.appointment_dateTime,
                            "YYYY-MM-DDTHH:mm"
                          ).format("DD/MM/YYYY hh:mm A")
                        : ""}
                    </td>
                    {/* <th scope="col" className='text-start'>Blood Group</th>
                  <td  className='text-capitalize'>{": "}{data?.bloodgroup}</td> */}
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Age
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.age}
                    </td>

                    <th scope="col" className="text-start">
                      Doctor Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.assigned_doctor_name}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      {" "}
                      Date
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.created_at
                        ? moment(data?.created_at).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <th scope="col" className="text-start">
                      Payment Mode
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data.payment_Mode}
                    </td>
                  </tr>
                  <tr>
                    {data.payment_Mode == "online" && (
                      <>
                        <th scope="col" className="text-start">
                          Transaction Id
                        </th>
                        <td className="text-capitalize">
                          {": "}
                          {data?.transaction_Id}
                        </td>{" "}
                      </>
                    )}
                    <th scope="col" className="text-start">
                      Payment Status
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data.payment_Status}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Address
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data?.address}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row proc-detail">
            <div className="col-12">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th className="text-start ps-4 pb-2 pt-1 fw-bold">S.No.</th>
                    <th
                      scope="col"
                      colSpan="1"
                      className="text-start pb-2 pt-1 code-column fw-bold"
                    >
                      Treatment Name
                    </th>
                    <th scope="col" className="text-end pe-4 pb-2 pt-1 fw-bold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-start ps-4 ">{"1"}</td>
                    <td
                      colSpan="1"
                      style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                      className="text-start code-column"
                    >
                      OPD
                    </td>
                    <td className="text-end pe-4">
                      {data.opd_amount}
                      {".00"}
                    </td>
                  </tr>

                  <tr>
                    <th
                      scope="col"
                      className=""
                      style={{ width: "30% !important" }}
                    ></th>

                    <th scope="col" className="text-start pt-4 second-th">
                      Payable Amount INR
                    </th>

                    <th scope="col" className="text-end pe-4 pt-4">
                      {" "}
                      {data.opd_amount}
                      {".00"}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="" style={{ width: "30%" }}></th>
                    <th scope="col" className="text-start second-th">
                      {" "}
                      Amount Paid INR
                    </th>

                    <th scope="col" className="text-end pe-4">
                      {data.opd_amount}
                      {".00"}
                    </th>
                  </tr>

                  {/* <tr>
                  <th scope="col" className='' style={{ width: '30%' }}></th>
                  <th scope="col" className='text-start second-th'>Net Payable {" "}INR</th>
                  
                  <th scope="col" className='text-end pe-4'>{totalAmount}{".00"}</th>
                   </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6 d-flex align-items-end ">
            <div>
              <h6 className="ms-5 preparedBy">
                Prepared by{" "}
                <span className="text-uppercase">
                  {data?.appointment_created_by}
                </span>
              </h6>
            </div>
          </div>

          <div className="col-6 d-flex align-items-end gap-4">
            <div className="sealimg">
              {/* <img
                src={hospitalDoc?.sealimg}
                alt="header"
                srcset=""
                width="200px"
                height="150px"
              /> */}
            </div>

            <div className="signimg">
              {/* <img
                src={hospitalDoc?.signimg}
                alt="header"
                srcset=""
                width="100px"
                height="100px"
              /> */}
            </div>
          </div>
        </div>

        <div className="footimage">
          <img src={hospitalDoc[0]?.foot_img} alt="footer" srcset="" />
        </div>
      </div>
      <div className="d-flex justify-content-center my-3 gap-2">
        {/* <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button> */}
        <button
          type="button"
          className="btn btn-info btn-lg shadow no-print"
          onClick={() => window.history.go(-1)}
        >
          <IoMdArrowRoundBack /> Back
        </button>
        <button
          type="button"
          className="btn btn-info btn-lg shadow no-print"
          onClick={handlePrint}
        >
          <FaPrint /> Print
        </button>

        <button
          type="button"
          className="btn btn-info btn-lg shadow no-print"
          onClick={() => navigate("/accountant-dashboard")}
        >
          <FaHome /> Go to Dashboard
        </button>
        {/* <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={goBack}
        >
          Back
        </button> */}
        {/* <button
    type='button'
    className='btn btn-secondary btn-lg ms-3'
    onClick={generatePDF}
  >
    Generate PDF
  </button> */}
      </div>
      <div className="d-flex justify-content-center">
        <br />
        <span className="fs-5 fw-bold no-print pt-2"> Share on : </span>
        {user?.sharemail === "Yes" && (
          <button
            className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
            style={{
              backgroundColor: "#0dcaf0",
              border: "#0dcaf0",
            }}
            onClick={sendPrescriptionMail}
          >
            <SiGmail />
          </button>
        )}
        {user?.sharewhatsapp === "Yes" && (
          <button
            className="btn btn-info no-print mx-1 mb-3 mt-2 text-white shadow"
            style={{
              backgroundColor: "#0dcaf0",
              border: "#0dcaf0",
            }}
            onClick={sendPrescriptionWhatsapp}
          >
            <IoLogoWhatsapp />
          </button>
        )}
      </div>
    </Container>
  );
};

export default PrintOpdBill;

const Container = styled.div`
  font-family: "Times New Roman", Times, serif;
  overflow-x: hidden;
  background-color: white;

  .code-column {
  }

  .headimage {
    height: 18rem;
    width: auto;
    margin-bottom: 1rem;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .footimage {
    @media print {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }

    height: 60px;
    width: auto;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .heading {
    border-bottom: 2px solid black;
    font-weight: 700;
    font-size: large;
    padding-bottom: 1rem;
  }
  .details-1 {
    border-bottom: 2px solid black;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    padding: 0;
    /* margin-bottom: 10px;  */
  }

  th {
    /* padding: 8px; */
    text-align: center;
    white-space: nowrap; /* Prevent text from wrapping */
    font-weight: 600;
    font-size: medium;
    color: black;
    /* letter-spacing: 1.5px; */
    padding-top: 0;
    padding-bottom: 0;
  }
  td {
    /* padding: 8px; */
    text-align: start;
    white-space: nowrap;
    font-weight: 600;
    font-size: medium;
    color: black;
    /* letter-spacing: 0.5px; */
    padding-top: 0;
    padding-bottom: 0;
  }
  .proc-detail {
    border-top: 2px solid black;
  }
  .btn-primary {
    @media print {
      display: none;
    }
  }
  .preparedBy {
    /* font-weight: 900; */
    font-weight: bolder;
    font-size: medium;
  }
  .sealimg:not(img) {
    border: 0 !important;
  }
  .signimg:not(img) {
    border: 0 !important;
  }
  .second-th {
    padding-left: 30%;
  }
  .no-print {
    @media print {
      display: none;
    }
  }
`;
