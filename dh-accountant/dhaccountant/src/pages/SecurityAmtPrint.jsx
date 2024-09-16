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

const SecurityAmtPrint = () => {
  const pdfRef = useRef();
  const contentRef = useRef();
  const { sid } = useParams();
  const [recData, setRecData] = useState([]);
  const [hospitalDoc, setHospitalDoc] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log(user);
  const branch = user.branch;
  const token = user.token;

  const displayDocHospital = async () => {
    console.log(user.id);
    try {
      const viewDoc = await axios.get(
        ` https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getBranchDetails/${user.branch}`,
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

  //   const getBill = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/get-appointment-by-id/${branch}/${appointmentId}`
  //       );
  //       console.log(response?.data?.data);
  //       setData(response?.data?.data);
  //     } catch (error) {
  //       console.log(error);
  //       cogoToast.error("error in getting appointment");
  //     }
  //   };

  const handlePrint = () => {
    window.print();
  };

  console.log(sid);
  const getSecurityRec = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getSecurityAmountDataBySID/${sid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSecurityRec();
    displayDocHospital();
  }, []);

  console.log(recData);

  // const getPatientTreatmentDetails = async (uhid) => {
  //   try {
  //     const response = await axios.get(
  //       `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getPatientDeatilsByUhidFromSecurityAmt/${branch}/${uhid}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setrecData(response.data.data);

  //     // setSearchDoctor(patientTreatmentDetails[0]?.doctor_name)
  //   } catch (error) {
  //     setrecData([]);
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getPatientTreatmentDetails(data[0]?.uhid);
  // }, [data]);

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
    if (!recData[0].emailid) {
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
      formData.append("email", recData[0]?.emailid);
      formData.append("patient_name", recData[0]?.patient_name);
      formData.append(
        "subject",
        `${recData[0]?.patient_name}, your Security Amount bill file`
      );
      formData.append(
        "textMatter",
        `Dear ${recData[0]?.patient_name}, Please find the attached Security Amount bill file.`
      );
      formData.append("file", pdfData, "Security_Amount.pdf");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      cogoToast.success("Security Amount bill Sending to email");
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
      cogoToast.success("Security Amount Bill sent successfully");
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
      formData.append("phoneNumber", recData[0]?.mobileno);
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
      cogoToast.success("Security Amount bill sent successfully");
      console.log("PDF sent successfully");
    } catch (error) {
      console.error("Error sending PDF:", error);
      cogoToast.error("Error to send Security Amount bill");
    }
  };
  return (
    //     <Container>
    //       <div ref={pdfRef}>
    //         <div className="headimage">
    //           <img src={hospitalDoc[0]?.head_img} alt="header" />
    //         </div>
    //         <div className="container-fluid m-0 p-0">
    //           <div className="row">
    //             <div className="col-12 ">
    //               <h5 className="text-center heading"> SECURITY AMOUNT RECIEPT</h5>
    //             </div>
    //           </div>

    //           <div className="row">
    //             <div className="col-12">
    //               <table className="table table-borderless">
    //                 <tbody>
    //                   <tr>
    //                     <th className="text-start">Appointment Id</th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.appointment_id}
    //                     </td>

    //                     <th scope="col" className="text-start">
    //                       Patient id
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.uhid}
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <th scope="col" className="text-start">
    //                       Branch Name
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.branch_name}
    //                     </td>

    //                     <th scope="col" className="text-start">
    //                       Name
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.patient_name}
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <th scope="col" className="text-start pe-5">
    //                       Mobile No
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.mobileno}
    //                     </td>
    //                     {/* <th scope="col" className="text-start">
    //                       Appointment Date
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.date.split("T")[0]}
    //                     </td> */}
    //                   </tr>
    //                   <tr>
    //                     <th scope="col" className="text-start">
    //                       Doctor Name
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.assigned_doctor}
    //                     </td>
    //                     <th scope="col" className="text-start">
    //                       {" "}
    //                       Payment Date
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.payment_date.split(" ")[0]}
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <th scope="col" className="text-start">
    //                       Payment Mode
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.payment_Mode}
    //                     </td>

    //                     {recData[0]?.payment_Mode === "online" && (
    //                       <>
    //                         <th scope="col" className="text-start">
    //                           Transaction Id
    //                         </th>
    //                         <td className="text-capitalize">
    //                           {": "}
    //                           {recData[0]?.transaction_Id}
    //                         </td>{" "}
    //                       </>
    //                     )}
    //                   </tr>
    //                   {/* <tr>
    //                     <th scope="col" className="text-start">
    //                       Payment Status
    //                     </th>
    //                     <td className="text-capitalize">
    //                       {": "}
    //                       {recData[0]?.payment_status}
    //                     </td>
    //                   </tr> */}
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>

    //           <div className="row proc-detail">
    //             <div className="col-12">
    //               <table className="table table-borderless">
    //                 <thead>
    //                   <tr>
    //                     <th className="text-start ps-4 pb-2 pt-1 ">S.No.</th>
    //                     <th
    //                       scope="col"
    //                       colSpan="1"
    //                       className="text-start pb-2 pt-1 code-column"
    //                     >
    //                       Treatment Name
    //                     </th>
    //                     <th scope="col" className="text-end pe-4 pb-2 pt-1">
    //                       Amount
    //                     </th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   <tr>
    //                     <td className="text-start ps-4 ">{"1"}</td>
    //                     <td
    //                       colSpan="1"
    //                       style={{ wordWrap: "break-word", whiteSpace: "normal" }}
    //                       className="text-start code-column"
    //                     >
    //                       {recData[0]?.dental_treatment}
    //                     </td>
    //                     <td className="text-end pe-4">{recData[0]?.amount}</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row proc-detail">
    //           <div className="col-6 d-flex align-items-end ">
    //             <div>
    //               <h6 className="ms-5 preparedBy">
    //                 Recieved by{": "}
    //                 <span className="text-uppercase">
    //                   {recData[0]?.received_by}
    //                 </span>
    //               </h6>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="footimage">
    //           <img src={hospitalDoc[0]?.foot_img} alt="footer" srcset="" />
    //         </div>
    //       </div>
    //       <div className="d-flex justify-content-center my-3 gap-2">
    //         <button
    //           type="button"
    //           className="btn btn-primary btn-lg"
    //           onClick={handlePrint}
    //         >
    //           Print
    //         </button>
    //         <button
    //           type="button"
    //           className="btn btn-primary btn-lg"
    //           onClick={() => navigate("/security-amount")}
    //         >
    //           Go back
    //         </button>
    //         {/* <button
    //     type='button'
    //     className='btn btn-secondary btn-lg ms-3'
    //     onClick={generatePDF}
    //   >
    //     Generate PDF
    //   </button> */}
    //       </div>
    //     </Container>
    //   );
    // };

    // export default SecurityAmtPrint;

    // const Container = styled.div`
    //   font-family: "Times New Roman", Times, serif;
    //   overflow-x: hidden;
    //   background-color: white;

    //   .code-column {
    //   }

    //   .headimage {
    //     height: 18rem;
    //     width: auto;
    //     img {
    //       height: 100%;
    //       width: 100%;
    //     }
    //   }
    //   .footimage {
    //     @media print {
    //       position: fixed;
    //       bottom: 0;
    //       left: 0;
    //       right: 0;
    //     }

    //     height: 60px;
    //     width: auto;
    //     img {
    //       height: 100%;
    //       width: 100%;
    //     }
    //   }

    //   .heading {
    //     border-bottom: 2px solid black;
    //     font-weight: 700;
    //     font-size: large;
    //   }
    //   .details-1 {
    //     border-bottom: 2px solid black;
    //   }
    //   table {
    //     width: 100%;
    //     border-collapse: collapse;
    //     padding: 0;
    //     /* margin-bottom: 10px;  */
    //   }

    //   th {
    //     /* padding: 8px; */
    //     text-align: center;
    //     white-space: nowrap; /* Prevent text from wrapping */
    //     font-weight: 600;
    //     font-size: medium;
    //     color: black;
    //     /* letter-spacing: 1.5px; */
    //     padding-top: 0;
    //     padding-bottom: 0;
    //   }
    //   td {
    //     /* padding: 8px; */
    //     text-align: start;
    //     white-space: nowrap;
    //     font-weight: 600;
    //     font-size: medium;
    //     color: black;
    //     /* letter-spacing: 0.5px; */
    //     padding-top: 0;
    //     padding-bottom: 0;
    //   }
    //   .proc-detail {
    //     border-top: 2px solid black;
    //   }
    //   .btn-primary {
    //     @media print {
    //       display: none;
    //     }
    //   }
    //   .preparedBy {
    //     /* font-weight: 900; */
    //     font-weight: bolder;
    //     font-size: medium;
    //   }
    //   .sealimg:not(img) {
    //     border: 0 !important;
    //   }
    //   .signimg:not(img) {
    //     border: 0 !important;
    //   }
    //   .second-th {
    //     padding-left: 30%;
    //   }
    // `;
    <Container>
      {/* <div ref={pdfRef}> */}
      <div ref={contentRef}>
        <div className="headimage">
          <img src={hospitalDoc[0]?.head_img} alt="header" srcset="" />
        </div>
        <div className="container-fluid mt-2 p-0">
          <div className="row">
            <div className="col-12 ">
              <h4 className="text-center heading">SECURITY AMOUNT RECIEPT</h4>
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
                      {recData[0]?.appointment_id}
                    </td>

                    <th scope="col" className="text-start">
                      Patient id
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.uhid}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.patient_name}
                    </td>
                    <th scope="col" className="text-start pe-5">
                      Mobile No
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.mobileno}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Doctor Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {"Dr. "}
                      {recData[0]?.assigned_doctor}
                    </td>
                    <th scope="col" className="text-start">
                      Branch Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.branch_name}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Payment Date
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.payment_date
                        ? moment(recData?.created_at).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <th scope="col" className="text-start">
                      Payment Mode
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {recData[0]?.payment_Mode}
                    </td>
                  </tr>
                  <tr>
                    {recData.payment_Mode == "online" && (
                      <>
                        <th scope="col" className="text-start">
                          Transaction Id
                        </th>
                        <td className="text-capitalize">
                          {": "}
                          {recData[0]?.transaction_Id}
                        </td>{" "}
                      </>
                    )}
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row proc-detail">
            <div className="col-12">
              <table className="table table-borderless">
                <tbody>
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
                      {recData[0]?.amount}
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
                      {recData[0]?.amount}
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
                Prepared by :
                <span className="text-uppercase">
                  {recData[0]?.received_by}
                </span>
              </h6>
            </div>
          </div>

          {/* <div className='col-6 d-flex align-items-end gap-4'>
          <div className="sealimg">
            <img src={hospitalDoc?.sealimg} alt="header" srcset="" width="200px" height="150px"/>
          </div>

          <div className="signimg">
            <img src={hospitalDoc?.signimg} alt="header" srcset="" width="100px" height="100px"/>
          </div>

        </div> */}
        </div>

        <div className="footimage">
          <img src={hospitalDoc[0]?.foot_img} alt="footer" srcset="" />
        </div>
      </div>
      <div className="d-flex justify-content-center my-3 gap-2">
        <button
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
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/accountant-dashboard")}
        >
          Go to Dashboard
        </button>

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
        <span className="fs-5 fw-bold no-print"> Share on : </span>
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

export default SecurityAmtPrint;

const Container = styled.div`
  font-family: "Times New Roman", Times, serif;
  overflow-x: hidden;
  background-color: white;

  .code-column {
  }

  .headimage {
    height: 18rem;
    width: auto;
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
`;
