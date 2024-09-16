import axios from "axios";
import { numToWords } from "num-to-words";
import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaPrint } from "react-icons/fa6";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SiGmail, SiGooglemessages } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io";
import cogoToast from "cogo-toast";

const SittingBill = () => {
  const { tpid, sbid, treatment } = useParams();
  const contentRef = useRef();
  const navigate = useNavigate();
  const [getPatientData, setGetPatientData] = useState([]);
  const { refreshTable, currentUser } = useSelector((state) => state.user);
  const { currentBranch } = useSelector((state) => state.branch);
  const token = currentUser?.token;
  const branch = currentUser.branch_name;
  const [getExaminData, setGetExaminData] = useState([]);
  const [getTreatData, setGetTreatData] = useState([]);
  const [getTreatMedicine, setGetTreatMedicine] = useState([]);
  const [getTreatSug, setGetTreatSug] = useState([]);
  const [getBranch, setGetBranch] = useState([]);
  const [getLabData, setGetLabData] = useState([]);
  const [sittingBill, setSittingBill] = useState([]);
  const [getDocDetails, setGetDocDetails] = useState([]);

  const getBranchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getBranchDetailsByBranch/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setGetBranch(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getBranch);
  const handleButton = async () => {
    try {
      window.print();
    } catch (error) {
      console.log("Error updating sitting count", error);
    }
  };

  // Get Patient Details START
  const getPatientDetail = async () => {
    try {
      const res = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getAppointmentsWithPatientDetailsById/${tpid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetPatientData(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getPatientData);

  const getLabAllData = async () => {
    try {
      const res = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/lab-details/${tpid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetLabData(res.data.lab_details);
      console.log(res.data.lab_details);
    } catch (error) {
      console.log(error);
    }
  };

  const getSittingBillbyId = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getSittingBillbyId/${branch}/${sbid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSittingBill(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(sittingBill);

  const getDoctorDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getEmployeeDetailsbyId/${branch}/${getPatientData[0]?.doctor_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetDocDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getDocDetails);

  const getExamineDetails = async () => {
    try {
      const res = await axios.get(
        `https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/getDentalDataByTpid/${tpid}/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGetExaminData(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getExaminData);

  useEffect(() => {
    getPatientDetail();
    getBranchDetails();
    getLabAllData();
    getSittingBillbyId();
    // getDoctorDetails();
    getExamineDetails();
  }, []);

  useEffect(() => {
    // Push a new entry into the history stack
    window.history.pushState(null, null, window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      // Prevent the back navigation
      window.history.pushState(null, null, window.location.href);
    };

    // Listen for popstate events (which occur on back/forward navigation)
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  useEffect(() => {
    getDoctorDetails();
  }, [getPatientData]);

  console.log(sittingBill);

  const goBack = () => {
    navigate("/invoices?tab=paidSittingBill");
  };
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

  //   const handleDownloadPdf = async () => {
  //     const element = contentRef.current;
  //     const canvas = await html2canvas(element, { scale: 2 }); // Increase the scale for better quality
  //     const imgData = canvas.toDataURL("image/jpeg", 0.75); // Use JPEG with 75% quality

  //     const pdf = new jsPDF({
  //         orientation: "portrait",
  //         unit: "mm",
  //         format: "a4"
  //     });

  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();

  //     const imgWidth = pageWidth;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     // Check if the image height is greater than the page height
  //     if (imgHeight > pageHeight) {
  //         pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, pageHeight);
  //     } else {
  //         pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  //     }

  //     pdf.save("sitting_bill.pdf");
  // };

  const sendPrescriptionMail = async () => {
    if (!getPatientData[0]?.emailid) {
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
      formData.append("email", getPatientData[0]?.emailid);
      formData.append("patient_name", getPatientData[0]?.patient_name);
      formData.append(
        "subject",
        `${getPatientData[0]?.patient_name}, your sitting bill file`
      );
      formData.append(
        "textMatter",
        `Dear ${getPatientData[0]?.patient_name}, Please find the attached sitting bill file.\n` +
          `Clinic Details:\n` +
          `Name: ${currentBranch[0]?.hospital_name}\n` +
          `Contact: ${currentBranch[0]?.branch_contact}\n` +
          `Address: ${currentBranch[0]?.branch_address}\n` +
          `Email: ${currentBranch[0]?.branch_email}\n\n` +
          `Thank you for choosing ${currentBranch[0]?.hospital_name}.\n\n` +
          `Best regards,\n` +
          `${currentBranch[0]?.hospital_name} Team`
      );
      formData.append("file", pdfData, "prescription.pdf");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      cogoToast.success("Sitting bill Sending to email");
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
      cogoToast.success("Sitting bill sent successfully");
      console.log(response);
      console.log("PDF sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending PDF:", error);
      cogoToast.error("Error to send Sitting bill");
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
      formData.append("phoneNumber", getPatientData[0]?.mobileno);
      formData.append("message", "test message");
      // Convert Blob to a File
      const file = new File([pdfData], "sitting bill.pdf", {
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
      cogoToast.success("sitting bill sent successfully");
      console.log("PDF sent successfully");
    } catch (error) {
      console.error("Error sending PDF:", error);
      cogoToast.error("Error to send Sitting bill");
    }
  };

  const formDetails = {
    phoneNumber: getPatientData[0]?.mobileno,
    message: `Dear ${getPatientData[0]?.patient_name}, your bill generated for the sitting ${sittingBill[0]?.sitting_number} of treatment ${sittingBill[0]?.treatment}, sitting bill amount is ${sittingBill[0]?.sitting_amount}/-`,
  };
  const billDetailsSms = async () => {
    try {
      const { data } = await axios.post(
        "https://dentalhouse-receptionist.vimubds5.a2hosted.com/api/v1/receptionist/sendSMS",
        formDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("Bill details sent successfully");
    } catch (error) {
      console.log(error);
      cogoToast.error("Error to send Sitting bill Details");
    }
  };

  return (
    <>
      <Wrapper>
        {/* branch details */}
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
              <div className="clinic-logo">
                <img
                  src="https://res.cloudinary.com/dq5upuxm8/image/upload/v1708075638/dental%20guru/Login-page_1_cwadmt.png"
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
              <div className="header-left">
                <h3 className="text-center">Invoice</h3>
                <hr />
                <h6>
                  <strong>Clinic Name :</strong>{" "}
                  <span
                    className="fw-bold text-capitalize"
                    style={{ color: "#00b894" }}
                  >
                    {getBranch[0]?.hospital_name}
                  </span>
                </h6>
                <hr />
                <h6>
                  <strong>Branch Name :</strong>{" "}
                  <span
                    className="fw-bold text-capitalize"
                    style={{ color: "#00b894" }}
                  >
                    {getBranch[0]?.branch_name}
                  </span>
                </h6>
                <hr />
                <h6>
                  <strong>Address :</strong>{" "}
                  <span
                    className="fw-bold text-capitalize"
                    style={{ color: "#00b894" }}
                  >
                    {getBranch[0]?.branch_address}
                  </span>
                </h6>
                <hr />
                <h6>
                  <strong>Phone No. :</strong>{" "}
                  <span
                    className="fw-bold text-capitalize"
                    style={{ color: "#00b894" }}
                  >
                    {getBranch[0]?.branch_contact}
                  </span>
                </h6>
                <hr />
                <h6>
                  <strong>Email ID :</strong>{" "}
                  <span className="fw-bold" style={{ color: "#00b894" }}>
                    {getBranch[0]?.branch_email}
                  </span>
                </h6>
              </div>
            </div>
          </div>
          <hr />
        </div> */}
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center my-2 px-3 gap-2">
            <button
              className="btn btn-info no-print btn-lg shadow"
              // onClick={() => window.history.go(-1)}
              onClick={goBack}
            >
              <IoMdArrowRoundBack /> Back
            </button>
            <button
              className="btn btn-info no-print btn-lg shadow"
              onClick={handleButton}
            >
              <FaPrint /> Print
            </button>
          </div>
          <div ref={contentRef}>
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="clinic-logo">
                  <img
                    src={getBranch[0]?.head_img}
                    alt="header"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <hr />

            {/* patient details */}
            <div className="text-center">
              <h3>Invoice</h3>
            </div>
            <div className="container-fluid">
              <div className="heading-title">
                <h6>Patient Details :</h6>
              </div>
              <h6 className="">
                Patient Type : {getPatientData[0]?.patient_type}
              </h6>
              <table className="table table-bordered border">
                <tbody>
                  {getPatientData?.map((item, index) => (
                    <React.Fragment key={index}>
                      {item?.patient_type === "Credit" && (
                        <tr>
                          <th scope="row">Credit By</th>
                          <td>{item?.credit_By}</td>
                          <th scope="row">Beneficiary Id</th>
                          <td>{item?.beneficiary_Id}</td>
                        </tr>
                      )}
                      <tr>
                        <th scope="row">UHID</th>
                        <td>{item.uhid}</td>
                        <th scope="row">Gender</th>
                        <td>{item.gender}</td>
                      </tr>

                      <tr>
                        <th scope="row">Name</th>
                        <td>{item.patient_name}</td>
                        <th scope="row">Age</th>
                        <td>{item.age}</td>
                      </tr>
                      <tr>
                        <th scope="row">Address</th>
                        <td>{item.address}</td>
                        <th scope="row">Sitting Invoice No.</th>
                        <td>{sbid}</td>
                      </tr>
                      <tr>
                        <th scope="row">Mobile No.</th>
                        <td>{item.mobileno}</td>
                        <th scope="row">Date</th>
                        <td>{sittingBill[0]?.date.split(" ")[0]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Email</th>
                        <td>{item.emailid}</td>
                        <th scope="row">Treatment Package ID</th>
                        <td>{tpid}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {/* doctor details */}
            <div className="container-fluid">
              <div className="heading-title">
                <h6>Doctor Details :</h6>
              </div>
              <div className="d-flex justify-content-between">
                <div className="text-start docDetails">
                  <p>
                    <strong>Doctor Name :</strong> Dr.{" "}
                    {getDocDetails[0]?.employee_name}
                  </p>
                  <p>
                    <strong>Mobile :</strong>{" "}
                    {getDocDetails[0]?.employee_mobile}
                  </p>
                  <p>
                    <strong>Email :</strong> {getDocDetails[0]?.employee_email}
                  </p>
                </div>
              </div>
            </div>

            {/* patient observation */}
            <div className="container-fluid">
              <div className="heading-title">
                <h6>Patient Observation :</h6>
              </div>
              <table className="table table-bordered border">
                <thead>
                  <tr>
                    <th>Seleted Teeth</th>
                    <th>Disease</th>
                    <th>Chief Complain</th>
                    <th>On Exmination</th>
                    <th>Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {getExaminData?.map((item) => (
                    <>
                      <tr>
                        <td>{item.selected_teeth}</td>
                        <td>{item.disease}</td>
                        <td>{item.chief_complain}</td>
                        <td>{item.on_examination}</td>
                        <td>{item.advice}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* treatment provided */}
            <div className="container-fluid">
              <div className="heading-title">
                <h6>Treatment Procedure :</h6>
              </div>
              <div className="Treatment">
                {/* <p className="text-start fs-4 fw-bold">Treatment Procedure</p> */}
                <table className="table table-bordered border">
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Treatment</th>
                      <th>Teeth</th>
                      <th>Qty</th>
                      <th>Cost</th>
                      <th>Cst * Qty</th>
                      <th>Disc %</th>
                      <th>Net Treatment Amount</th>
                      <th>Sitting Amount</th>
                      <th>Paid Amount</th>
                      {/* <th>Payment Mode</th>
                  <th>Payment Date</th> */}
                      {/* <th>Note</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {sittingBill?.map((item, index) => (
                      <>
                        <tr
                          className={
                            index % 2 === 0 ? "table-primary" : "table-info"
                          }
                        >
                          <td>{item.sitting_number}</td>
                          <td>{item.treatment}</td>
                          <td>{item.teeth_number}</td>
                          <td>{item.teeth_qty}</td>
                          <td>{item.treatment_cost}</td>
                          <td>{item.treatment_cost * item.teeth_qty}</td>
                          <td>{item.discount}</td>
                          <td>{item.final_cost}</td>
                          <td>{item.sitting_amount}</td>
                          <td>{item.paid_amount}</td>
                          {/* <td>{item.payment_mode}</td>
                      <td>{item.date?.split(" ")[0]}</td> */}
                          {/* <td>{item.note}</td> */}
                        </tr>
                      </>
                    ))}
                  </tbody>
                  {/* <tfoot>
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center" }}
                    className="heading-title text-danger fw-bold"
                  >
                    Treatment Pending Payment:
                  </td>
                  <td className="heading-title text-danger fw-bold">
                    billDetails[0]?.total_amount - totalBillvalueWithoutGst
                  </td>
                </tr>
              </tfoot> */}
                  {/* <tfoot>
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "right" }}
                    className="heading-title"
                  >
                    Treatment Total:
                  </td>
                  <td className="heading-title">
                    {netVal.reduce(
                      (total, item) =>
                        total +
                        (Number(item.total_amt) -
                          (Number(item.total_amt) * Number(item.disc_amt)) /
                            100),
                      0
                    )}
                  </td>

                  <td className="heading-title">
                    {getTreatData.reduce(
                      (total, item) =>
                        item.sitting_payment_status === "Pending"
                          ? total
                          : total + Number(item.paid_amount),
                      0
                    )}
                  </td>
                </tr>
              </tfoot> */}
                </table>
              </div>
            </div>
            {/* terms and condition */}
            <div className="container-fluid">
              <div className="row gutter">
                <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
                  <div className="border">
                    <div className="heading-title mt-0">
                      <h6>Total Amount In Words :</h6>
                    </div>
                    <div className="text-word">
                      <p className="m-0 fw-bold">
                        {" "}
                        {numToWords(
                          sittingBill[0]?.paid_amount
                        ).toUpperCase()}{" "}
                        RUPEES ONLY
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="heading-title mt-0">
                      <h6>Payment Info :</h6>
                    </div>
                    <div className="">
                      <table className="table table-bordered mb-0">
                        <tbody>
                          <tr>
                            <td className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 border p-1">
                              Account No.:
                            </td>
                            <td className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8 border p-1"></td>
                          </tr>
                          <tr>
                            <td className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 border p-1">
                              Account Name:
                            </td>
                            <td className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8 border p-1"></td>
                          </tr>
                          <tr>
                            <td className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 border p-1">
                              Bank Name:
                            </td>
                            <td className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8 border p-1"></td>
                          </tr>
                          <tr>
                            <td className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 border p-1">
                              IFSC/Bank Code:
                            </td>
                            <td className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8 border p-1"></td>
                          </tr>
                          <tr>
                            <td className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 border p-1">
                              UPI ID:
                            </td>
                            <td className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8 border p-1"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
                  <div className="">
                    <table className="table table-bordered mb-0">
                      {/* <tbody>
                    <tr>
                      <td className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 border p-1 text-end total-tr">
                        Amount Received After Treatment:
                      </td>
                      <td className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 border p-1 text-center total-tr">
                        totalBillvalueWithoutGst - payafterTreat
                      </td>
                    </tr>
                  </tbody> */}
                      <tbody>
                        <tr>
                          <td className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 border p-1 text-end total-tr">
                            Total Amount Received:
                          </td>
                          <td className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 border fw-bold p-1 text-center total-tr fs-6">
                            {sittingBill[0]?.paid_amount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="border">
                    <div className="text-terms"></div>
                    <div className="heading-title mt-0">
                      <h6 className="text-center">Clinic Seal & Signature</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border">
                <div className="heading-title mt-0">
                  <h6>Terms and Conditions :</h6>
                </div>
                <div className="text-termslong"></div>
              </div>
            </div>
          </div>
        </div>
        {/* print button */}
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center">
            {/* <button
              className="btn btn-info no-print mt-2 mb-2"
              onClick={handleButton}
            >
              Print
            </button> */}
            {/* {billDetails[0]?.payment_status === "paid" ? (
              ""
            ) : (
              <button
                className="btn btn-success ms-2 no-print mt-2 mb-2 text-white shadow"
                style={{
                  backgroundColor: "#0dcaf0",
                  border: "#0dcaf0",
                }}
                onClick={() => navigate(`/patient-due-payment-print/${tpid}`)}
              >
                Go to Payment page
              </button>
            )} */}
            {/* {billDetails[0]?.due_amount !== "0" ||
            billDetails[0]?.payment_status !== "paid" ? (
              ""
            ) : (
              <>
                <button
                  className="btn btn-info no-print mx-3 mt-2 mb-2 text-white shadow"
                  style={{
                    backgroundColor: "#0dcaf0",
                    border: "#0dcaf0",
                  }}
                  //   onClick={() => navigate("/doctor-dashboard")}
                >
                  Appointment Dashboard
                </button>
              </>
            )} */}
            {/* <button
              className="btn btn-info no-print mx-3 mt-2 mb-2"
              onClick={() => navigate("/doctor-dashboard")}
            >
              Appointment Dashboard
            </button> */}
            <div className="container-fluid">
              <div className="text-center">
                <button
                  className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
                  style={{
                    backgroundColor: "#0dcaf0",
                    border: "#0dcaf0",
                  }}
                  onClick={handleDownloadPdf}
                >
                  Download Sitting Bill
                </button>
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
                    className="btn btn-info no-print mx-3 mb-3 mt-2 text-white shadow"
                    style={{
                      backgroundColor: "#0dcaf0",
                      border: "#0dcaf0",
                    }}
                    onClick={sendPrescriptionWhatsapp}
                  >
                    <IoLogoWhatsapp />
                  </button>
                )}
                {currentBranch[0]?.sharesms === "Yes" && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default SittingBill;
const Wrapper = styled.div`
  font-size: 12px;
  overflow: hidden;
  background-color: white;
  height: 100%;
  /* .dummy-cont {
    width: 90%;
  } */
  .doctor-detail {
    margin-bottom: 0.5rem;
  }
  @media print {
    @page {
      margin: 2rem; /* Remove default page margins */
    }

    body {
      margin: 0; /* Ensure no margin on the body */
    }

    .container-fluid {
      width: 100%; /* Optionally set the width */
      margin: 0; /* Remove margin */
      padding: 0; /* Remove padding */
      page-break-before: auto;
    }
  }
  @media print {
    .no-print {
      display: none !important;
    }
  }

  .headerimg {
    img {
      width: 100%;
      height: 8.5rem;
    }
  }

  .sign-seal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }
  .clinic-logo {
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .heading-title {
    /* background-color: #34495e; */
    /* margin-top: 1rem; */
    padding: 2px;
    border-radius: 3px;
    /* h4 {
      color: white;
    }
    h5 {
      color: white;
    } */
  }
  h4,
  h6 {
    margin-bottom: 0.1rem;
  }

  .docDetails {
    p {
      margin: 0rem;
    }
  }

  hr {
    margin: 0.2rem;
  }
  .text-word {
    height: auto;
  }

  .text-terms {
    height: 7.5rem;
  }

  .gutter {
    --bs-gutter-x: 0rem !important;
  }

  /* .total-tr {
    background-color: #34495e;
    color: white;
  } */

  table > :not(caption) > * > * {
    padding: 0.2rem 0.2rem;
  }

  table {
    margin-bottom: 0.3rem;
  }

  .text-termslong {
    height: 2rem;
  }
  /* th,
  td {
    white-space: nowrap;
  } */

  //th {
  // white-space: nowrap;
  // }
`;
