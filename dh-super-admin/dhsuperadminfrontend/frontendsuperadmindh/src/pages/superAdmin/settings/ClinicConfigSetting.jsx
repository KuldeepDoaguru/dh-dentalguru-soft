import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sider from "../../../components/Sider";
import Header from "../../../components/Header";
import { FaSearch } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import BranchSelector from "../../../components/BranchSelector";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const ClinicConfigSetting = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [docPayment, setDocPayment] = useState();
  const [allowInsurance, setAllowInsurance] = useState();
  const [shareWhatapps, setShareWhatapps] = useState();
  const [shareEmail, setShareEmail] = useState();
  const [shareSms, setShareSms] = useState();
  const [branchDetails, setBranchDetails] = useState([]);
  const [selected, setSelected] = useState("");
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [insList, setInsList] = useState([]);
  const [branchCategory, setBranchCategory] = useState();
  const [showEditInsurance, setShowEditInsurance] = useState(false);
  const [addIns, setAddIns] = useState({
    branch: branch.name,
    companyname: "",
    category: "",
    status: "",
  });
  const [upIns, setUpIns] = useState({
    branch: branch.name,
    companyname: "",
    category: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddIns({
      ...addIns,
      [name]: value,
    });
  };

  const handleUpChange = (e) => {
    const { name, value } = e.target;
    setUpIns({
      ...addIns,
      [name]: value,
    });
  };

  console.log(addIns);
  const openAddInsurancePopup = (index, item) => {
    // setSelectedItem(item);
    console.log("open pop up");
    setShowAddInsurance(true);
  };

  const openEditInsurancePopup = (id, item) => {
    console.log(id);
    setSelected(item);
    // setUpIns({
    //   branch: branch.name,
    //   companyname: item?.companyname,
    //   category: item?.category,
    //   status: item?.status,
    // });
    console.log("open pop up");
    setShowEditInsurance(true);
  };

  useEffect(() => {
    setUpIns({
      branch: branch.name,
      companyname: selected?.companyname,
      category: selected?.category,
      status: selected?.status,
    });
  }, [selected]);

  console.log(selected);

  console.log(docPayment);
  const SubmitDocPaymentChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/updateDoctorPaymentAllowSetting/${branch.name}`,
        {
          doctor_payment: docPayment,
          allow_insurance: allowInsurance,
          sharewhatsapp: shareWhatapps,
          sharemail: shareEmail,
          sharesms: shareSms,
          branchCategory: branchCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      getBranchData();
      cogoToast.success("details updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const getBranchData = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getBranchDetailsByBranch/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setBranchDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(branchDetails);

  const getInsuranceList = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getInsuranceList/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setInsList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchData();
    getInsuranceList();
  }, [branch.name]);

  console.log(insList);

  const insertInsurance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/addInsuranceCompany/${branch.name}`,
        addIns,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("insurance company added successfully");
      closeUpdatePopup();
      getInsuranceList();
    } catch (error) {
      console.log(error);
      cogoToast.error(error.response.data.message);
    }
  };

  const updateInsuranceData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/updateInsuranceDetails/${selected.ins_id}/${branch.name}`,
        upIns,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      closeUpdatePopup();
      getInsuranceList();
      cogoToast.success("Successfully updated");
    } catch (error) {
      console.log(error);
      cogoToast.error(error.response.data.message);
    }
  };

  const deleteInsurance = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete ?");
      if (confirm) {
        const del = await axios.delete(
          `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/deleteInsurance/${id}/${branch.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        cogoToast.success("insurance deleted successfully");
      }
      getInsuranceList();
    } catch (error) {
      console.log(error);
      cogoToast.error(error.response.data.message);
    }
  };

  const closeUpdatePopup = () => {
    setShowAddInsurance(false);
    setShowEditInsurance(false);
    setAddIns({
      companyname: "",
      category: "",
      status: "",
    });
  };

  const goBack = () => {
    window.history.go(-1);
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
                    <div>
                      {/* <Link to="/superadmin-add-branch">
                          <button className="btn btn-success">
                            Add Branch
                          </button>
                        </Link> */}
                    </div>
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                  <div className="banner-mid mt-2">
                    <div>
                      <h3 className="text-light text-center">
                        Clinic Settings
                      </h3>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Doctor Payment Option :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.doctor_payment}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Insurance Allowed :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.allow_insurance}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Share Whatsapp :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.sharewhatsapp}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Share Email :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.sharemail}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Share SMS :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.sharesms}
                      </span>
                    </h6>
                    <h6 className="text-center mt-2 fw-bold text-success">
                      Hospital Category :{" "}
                      <span style={{ color: "#004aad" }}>
                        {branchDetails[0]?.hospital_category}
                      </span>
                    </h6>
                  </div>
                  <form onSubmit={SubmitDocPaymentChange}>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">
                        Allow doctor to make payment :
                      </h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setDocPayment(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Allow Insurance :</h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setAllowInsurance(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Share Whatsapp :</h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setShareWhatapps(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Share Email :</h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Share SMS :</h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setShareSms(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="container d-flex justify-content-center align-item-center mb-2">
                      <h6 className="fw-bold mx-2">Hospital category :</h6>
                      <select
                        name=""
                        id=""
                        onChange={(e) => setBranchCategory(e.target.value)}
                        className="p-1 rounded"
                      >
                        <option value="">--select--</option>
                        <option value="General">General</option>
                        <option value="Nabh">Nabh</option>
                        <option value="non-Nabh">non-Nabh</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-success mx-2" type="submit">
                        Change
                      </button>
                    </div>
                  </form>

                  <div className="container-fluid mt-3">
                    <div className="calender-time mb-2">
                      <div>
                        <h6 className="text-dark fw-bold">
                          Insurance Details :
                        </h6>
                      </div>
                      <div>
                        <button
                          className="btn btn-info mx-2"
                          onClick={() => openAddInsurancePopup()}
                        >
                          Add Insurance Company
                        </button>
                      </div>
                    </div>
                    <div class="table-responsive rounded">
                      <table class="table table-bordered rounded shadow">
                        <thead className="table-head">
                          <tr>
                            <th className="table-sno sticky">S. No.</th>
                            <th className="table-sno sticky">Insurance Name</th>
                            <th className="table-small sticky">Branch</th>
                            <th className="sticky">Category</th>
                            <th className="sticky">Status</th>
                            <th className="table-small sticky">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insList?.map((item, index) => (
                            <>
                              <tr className="table-row">
                                <td>{index + 1}</td>
                                <td>{item.companyname}</td>
                                <td className="table-small">
                                  {item.branch_name}
                                </td>
                                <td className="table-small">{item.category}</td>
                                <td className="table-small">{item.status}</td>

                                <td>
                                  <button
                                    className="btn btn-warning"
                                    onClick={() =>
                                      openEditInsurancePopup(item.ins_id, item)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger mx-1"
                                    onClick={() => deleteInsurance(item.ins_id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ***************************************************************************************************** */}
          {/* other pop-up */}
          {/* pop-up for adding lab */}
          <div
            className={`popup-container${showAddInsurance ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Add Insurance Company</h4>
              <form className="d-flex flex-column" onSubmit={insertInsurance}>
                <div className="row g-2">
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="branch name"
                      className="form-control rounded p-2"
                      name="branch"
                      value={branch.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="company name"
                      className="form-control rounded p-2"
                      name="companyname"
                      value={addIns.companyname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Category
                    </label>
                    <select
                      name="category"
                      onChange={handleChange}
                      value={addIns.category}
                      className="form-control rounded p-2"
                      id=""
                    >
                      <option value="">-select-</option>
                      <option value="semi-govt">Semi-Govt</option>
                      <option value="govt">Govt</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Status
                    </label>
                    <select
                      name="status"
                      value={addIns.status}
                      onChange={handleChange}
                      className="form-control rounded p-2"
                      id=""
                    >
                      <option value="">-select-</option>
                      <option value="active">Acitve</option>
                      <option value="inactive">Inactive</option>
                      <option value="hold">Hold</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-start">
                  <button type="submit" className="btn btn-success mt-2">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mx-2"
                    onClick={closeUpdatePopup}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* pop-up for adding lab */}
          {/* ************************************************************************************* */}

          {/* ***************************************************************************************************** */}
          {/* other pop-up */}
          {/* pop-up for adding lab */}
          <div
            className={`popup-container${showEditInsurance ? " active" : ""}`}
          >
            <div className="popup">
              <h4 className="text-center">Edit Insurance Company</h4>
              <form
                className="d-flex flex-column"
                onSubmit={updateInsuranceData}
              >
                <div className="row g-2">
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="branch name"
                      className="form-control rounded p-2"
                      name="branch"
                      value={branch.name}
                      onChange={handleUpChange}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="company name"
                      className="form-control rounded p-2"
                      name="companyname"
                      value={upIns.companyname}
                      onChange={handleUpChange}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Category
                    </label>
                    <select
                      name="category"
                      onChange={handleUpChange}
                      value={upIns.category}
                      className="form-control rounded p-2"
                      id=""
                    >
                      <option value="">-select-</option>
                      <option value="semi-govt">Semi-Govt</option>
                      <option value="govt">Govt</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label htmlFor="" className="form-label">
                      Status
                    </label>
                    <select
                      name="status"
                      value={upIns.status}
                      onChange={handleUpChange}
                      className="form-control rounded p-2"
                      id=""
                    >
                      <option value="">-select-</option>
                      <option value="active">Acitve</option>
                      <option value="inactive">Inactive</option>
                      <option value="hold">Hold</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-start">
                  <button type="submit" className="btn btn-success mt-2">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mx-2"
                    onClick={closeUpdatePopup}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* pop-up for adding lab */}
          {/* ************************************************************************************* */}
        </div>
      </Container>
    </>
  );
};

export default ClinicConfigSetting;
const Container = styled.div`
  .banner-mid {
    background-color: #004aad;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .calender-time {
    display: flex;
    margin-top: 1rem;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .appointment-slot-time {
    display: flex;
    margin-top: 1rem;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .popup-container.active {
    display: flex;
    background-color: #00000075;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  th {
    background-color: #004aad;
    color: white;
    white-space: nowrap;
  }
  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
  .table-responsive {
    height: 20rem;
  }
`;
