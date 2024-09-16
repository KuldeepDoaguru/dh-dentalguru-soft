import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaHome, FaPrint } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SiGmail, SiGooglemessages } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io";

const PrintSecurityAmt = () => {
  const pdfRef = useRef();
  const contentRef = useRef();
  const { SId } = useParams();
  const user = useSelector((state) => state.user);
  const { currentBranch } = useSelector((state) => state.branch);

  const { refreshTable, currentUser } = useSelector((state) => state.user);
  const branch = currentUser.branch_name;
  const token = currentUser?.token;
  const [getBranch, setGetBranch] = useState([]);

  const [data, setData] = useState("");

  const [patientDetails, setPatientDetails] = useState([]);

  const navigate = useNavigate();

  const getBranchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getBranchDetailsByBranch/${branch}`
      );
      console.log(data);
      setGetBranch(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBill = async () => {
    try {
      const response = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getSinglePatientSecurityAmt/${branch}/${SId}`,
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

  const getPatientTreatmentDetails = async (uhid) => {
    try {
      const response = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getPatientDeatilsByUhidFromSecurityAmt/${branch}/${uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatientDetails(response.data.data);

      // setSearchDoctor(patientTreatmentDetails[0]?.doctor_name)
    } catch (error) {
      setPatientDetails([]);
      console.log(error);
    }
  };

  useEffect(() => {
    getBill();
    getBranchDetails();
  }, []);

  useEffect(() => {
    getPatientTreatmentDetails(data[0]?.uhid);
  }, [data]);

  console.log(data);
  console.log(patientDetails);

  const handlePrint = () => {
    window.print();
  };

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

  // optimize code for reduce pdf size
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
    if (!patientDetails[0].emailid) {
      alert("Email id not available");
      return;
    }
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2 }); // Increase the scale for better quality
      const imgData = canvas.toDataURL("image/jpeg", 0.75); // Use JPEG with 75% quality
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
      ); // Use 'FAST' for compression
      const pdfData = pdf.output("blob");
      console.log(pdfData);

      const formData = new FormData();
      formData.append("email", patientDetails[0]?.emailid);
      formData.append("patient_name", patientDetails[0]?.patient_name);
      formData.append(
        "subject",
        `${patientDetails[0]?.patient_name}, your Security Amount bill file`
      );
      formData.append(
        "textMatter",
        `Dear ${patientDetails[0]?.patient_name}, Please find the attached Security Amount bill file.\n` +
          `Clinic Details:\n` +
          `Name: ${currentBranch[0]?.hospital_name}\n` +
          `Contact: ${currentBranch[0]?.branch_contact}\n` +
          `Address: ${currentBranch[0]?.branch_address}\n` +
          `Email: ${currentBranch[0]?.branch_email}\n\n` +
          `Thank you for choosing ${currentBranch[0]?.hospital_name}.\n\n` +
          `Best regards,\n` +
          `${currentBranch[0]?.hospital_name} Team`
      );
      formData.append("file", pdfData, "Security_Amount.pdf");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      cogoToast.success("Security Amount bill Sending to email");
      const response = await axios.post(
        "https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/prescriptionOnMail",
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
      const imgData = canvas.toDataURL("image/jpeg", 0.75); // Use JPEG with 75% quality
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
      ); // Use 'FAST' for compression
      const pdfData = pdf.output("blob");
      console.log(pdfData);

      const formData = new FormData();
      formData.append("phoneNumber", patientDetails[0]?.mobileno);
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
        "https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/sendWhatsapp",
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
    <Container>
      <div ref={contentRef}>
        <div className="headimage">
          <img src={getBranch[0]?.head_img} alt="header" srcset="" />
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
                      {data[0]?.appointment_id}
                    </td>

                    <th scope="col" className="text-start">
                      Patient id
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.uhid}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.patient_name}
                    </td>
                    <th scope="col" className="text-start pe-5">
                      Mobile No
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.patient_number}
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
                      {data[0]?.assigned_doctor}
                    </td>
                    <th scope="col" className="text-start">
                      Branch Name
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.branch_name}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col" className="text-start">
                      Payment Date
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.payment_date
                        ? moment(data?.created_at).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <th scope="col" className="text-start">
                      Payment Mode
                    </th>
                    <td className="text-capitalize">
                      {": "}
                      {data[0]?.payment_Mode}
                    </td>
                  </tr>
                  <tr>
                    {data[0]?.payment_Mode == "online" && (
                      <>
                        <th scope="col" className="text-start">
                          Transaction Id
                        </th>
                        <td className="text-capitalize">
                          {": "}
                          {data[0]?.transaction_Id}
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
                      {data[0]?.amount}
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
                      {data[0]?.amount}
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
                <span className="text-uppercase">{data[0]?.received_by}</span>
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
          <img src={getBranch[0]?.foot_img} alt="footer" srcset="" />
        </div>
      </div>
      <div className="d-flex justify-content-center my-3 gap-2">
        <button
          type="button"
          className="btn btn-info btn-lg shadow"
          onClick={() => window.history.go(-1)}
        >
          <IoMdArrowRoundBack /> Back
        </button>
        <button
          type="button"
          className="btn btn-info btn-lg shadow"
          onClick={handlePrint}
        >
          <FaPrint /> Print
        </button>

        <button
          type="button"
          className="btn btn-info btn-lg shadow"
          onClick={() => navigate("/receptionist-dashboard")}
        >
          <FaHome /> Go to Dashboard
        </button>

        {/* <button
    type='button'
    className='btn btn-secondary btn-lg ms-3'
    onClick={generatePDF}
  >
    Generate PDF
  </button> */}
      </div>
      <div className="container-fluid">
        <div className="text-center">
          {/* <button
              className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
              style={{
                backgroundColor: "#0dcaf0",
                border: "#0dcaf0",
              }}
              onClick={handleDownloadPdf}
            >
              Download Sitting Bill
            </button> */}
          {/* <button
              className="btn btn-info no-print text-white mt-2 mb-2"
              onClick={handleTreatNavigate}
              style={{
                backgroundColor: "#0dcaf0",
                border: "#0dcaf0",
              }}
            >
              Treatment Dashboard
            </button> */}
          <br />
          <span className="fs-5 fw-bold no-print"> Share on : </span>
          {currentBranch[0]?.sharemail === "Yes" && (
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
          {currentBranch[0]?.sharewhatsapp === "Yes" && (
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
          {/* {currentBranch[0]?.sharesms === "Yes" && (
              <button
                className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
                style={{
                  backgroundColor: "#0dcaf0",
                  border: "#0dcaf0",
                }}
                onClick={billDetailsSms}
              >
                <SiGooglemessages />
              </button>
            )} */}
        </div>
      </div>
    </Container>
  );
};

export default PrintSecurityAmt;

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
  .btn-info {
    @media print {
      display: none;
    }
  }
  .no-print {
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
