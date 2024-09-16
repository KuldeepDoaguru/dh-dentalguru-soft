import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";
// import moment from "moment";

const LabReport = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [labBills, setLabBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshTable } = useSelector((state) => state.user);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getBillDetailsList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getPatientLabTest/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(data);
      setLabBills(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const goBack = () => {
    window.history.go(-1);
  };

  const todayDate = new Date();

  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to adjust month, padStart ensures 2 digits
  const date = String(todayDate.getDate()).padStart(2, "0"); // Ensuring 2 digits

  const formattedDate = `${year}-${month}-${date}`;

  console.log(formattedDate.slice(0, 7));
  console.log(labBills);

  const filterBillDataByMonth = labBills?.filter((item) => {
    return (
      item.created_date?.split("T")[0].slice(0, 7) === formattedDate.slice(0, 7)
    );
  });

  console.log(filterBillDataByMonth.length);

  // const downloadBillingData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(
  //       `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/downloadLabReportByTime/${branch.name}`,
  //       { fromDate: fromDate, toDate: toDate },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       }
  //     );
  //     console.log(data);

  //     if (Array.isArray(data)) {
  //       const workbook = utils.book_new();
  //       const worksheet = utils.json_to_sheet(data);
  //       utils.book_append_sheet(workbook, worksheet, `Billing Report`);
  //       writeFile(workbook, `${fromDate} - ${toDate}-billing-report.xlsx`);
  //       console.log(data);
  //     } else {
  //       console.error("data is not an array");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    getBillDetailsList();
  }, [branch.name, refreshTable]);

  console.log(fromDate, toDate);

  const checkFilter = labBills?.filter((item) => {
    return (
      item.created_date?.split("T")[0] >= fromDate &&
      item.created_date?.split("T")[0] <= toDate
    );
  });

  console.log(checkFilter);

  const searchFilter = labBills.filter((lab) => {
    const appointDate = moment(
      lab.created_date?.split(" ")[0],
      "DD-MM-YYYY"
    ).startOf("day");
    const formateFromDate = moment(fromDate).startOf("day");
    const formateToDate = moment(toDate).endOf("day");
    console.log(appointDate, formateFromDate, formateToDate);

    if (fromDate && toDate) {
      return appointDate.isBetween(formateFromDate, formateToDate, null, "[]");
    } else if (fromDate && toDate) {
      return appointDate.isBetween(formateFromDate, formateToDate, null, "[]");
    } else {
      return true;
    }
  });

  console.log(searchFilter);

  const exportToExcel = (e) => {
    e.preventDefault();
    const csvRows = [];
    const table = document.querySelector(".table");

    if (!table) {
      console.error("Table element not found");
      return;
    }

    table.querySelectorAll("tr").forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td, th").forEach((cell) => {
        rowData.push(cell.innerText);
      });
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Lab-bills-report.csv";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const formateFromDate = moment(fromDate).format("DD-MM-YYYY");
  const formateToDate = moment(toDate).format("DD-MM-YYYY");
  console.log(formateFromDate, labBills[0]?.created_date?.split(" ")[0]);

  return (
    <>
      <Container>
        <div className="container-fluid">
          <div class=" mt-4">
            <div className="d-flex justify-content-between mb-2">
              <form onSubmit={exportToExcel}>
                <div className="d-flex justify-content-between">
                  <div>
                    <input
                      type="date"
                      name=""
                      id=""
                      className="p-2 rounded"
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="mx-2">To</div>
                  <div>
                    <input
                      type="date"
                      name=""
                      id=""
                      className="p-2 rounded"
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  {labBills.length > 0 ? (
                    <button className="btn btn-warning mx-2" type="submit">
                      Download Report
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning mx-2"
                      type="submit"
                      disabled
                    >
                      Download Report
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="container-fluid mt-3">
              {loading ? (
                <Lottie
                  options={defaultOptions}
                  height={300}
                  width={400}
                  style={{ background: "transparent" }}
                ></Lottie>
              ) : (
                <>
                  <div class="table-responsive rounded">
                    <table class="table table-bordered rounded shadow">
                      <thead className="table-head">
                        <tr>
                          <th className="table-sno sticky">Test ID</th>
                          <th className="sticky">Test Date</th>
                          <th className="table-small sticky">Patient UHID</th>
                          <th className="table-small sticky">Patient Name</th>
                          <th className="table-small sticky">Lab Test</th>
                          <th className="table-small sticky">Total Amount</th>
                          <th className="sticky">Paid Amount</th>
                          <th className="sticky">Payment Status</th>
                          <th className="sticky">Payment Date & Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchFilter.map((item) => (
                          <>
                            <tr className="table-row">
                              <td className="table-sno">{item.testid}</td>
                              <td className="table-small">
                                {item.created_date?.split(" ")[0]}{" "}
                                {moment(
                                  item.created_date?.split(" ")[1],
                                  "HH:mm:ss"
                                ).format("hh:mm A")}
                              </td>
                              <td className="table-small">
                                {item.patient_uhid}
                              </td>
                              <td className="table-small">
                                {item.patient_name}
                              </td>
                              <td>{item.test}</td>
                              <td className="table-small">{item.cost}</td>
                              <td className="table-small">{item.payment}</td>
                              <td>{item.payment_status}</td>

                              <td>{item?.authenticate_date}</td>
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
      </Container>
    </>
  );
};

export default LabReport;
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
  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
`;
