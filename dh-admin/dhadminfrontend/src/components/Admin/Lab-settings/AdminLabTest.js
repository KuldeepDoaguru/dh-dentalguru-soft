import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AiFillDelete } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import Lottie from "react-lottie";
import animationData from "../../../pages/animation/loading-effect.json";
// import { toggleTableRefresh } from "../../redux/slices/UserSlicer";

const LabTest = () => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [labTestList, setLabTestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const {} = useSelector((state) => state.user);
  const [selectedItem, setSelectedItem] = useState([]);
  const branch = user.branch_name;
  const [keyword, setkeyword] = useState("");
  const [labList, setLabList] = useState([]);
  const complaintsPerPage = 5; // Number of complaints per page
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddLabTest, setShowAddLabTest] = useState(false); // Start from the first page
  const [upLabTestField, setUpLabTestField] = useState({
    test_name: "",
    test_code: "",
    waiting_days: "",
    default_lab: "",
    test_date: "",
    test_cost: "",
  });

  const [addLabTestField, setAddLabTestField] = useState({
    test_name: "",
    test_code: "",
    waiting_days: "",
    default_lab: "",
    test_date: "",
    test_cost: "",
  });

  const handleUpLabTestChange = (event) => {
    const { name, value } = event.target;
    setUpLabTestField((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddLabTestChange = (event) => {
    const { name, value } = event.target;
    setAddLabTestField((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(upLabTestField);

  const openUpdatePopup = (item) => {
    setSelectedItem(item);
    console.log("open pop up");
    setUpLabTestField({
      test_name: item.test_name,
      test_code: item.test_code,
      waiting_days: item.waiting_days,
      default_lab: item.default_lab,
      test_date: item.test_date,
      test_cost: item.test_cost,
    });
    setShowPopup(true);
  };

  console.log(selectedItem);

  const closeUpdatePopup = () => {
    setShowPopup(false);
    setShowAddLabTest(false);
  };

  console.log(showPopup);
  const getLabtestDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getLabTest",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setLabTestList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getLabtestDetails();
  }, []);

  console.log(labTestList);

  const updateLabData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/updateLabTestDetails/${selectedItem.lab_tid}`,
        upLabTestField,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Lab Test details updated successfully");
      getLabtestDetails();
      closeUpdatePopup();
    } catch (error) {
      console.log(error);
    }
  };

  const getListLabDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/getLabList/${branch}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLabList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListLabDetails();
  }, []);

  const deleteLabTestData = async (id) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete?");
      if (isConfirmed) {
        const response = await axios.delete(
          `https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/labTestDelete/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        cogoToast.success("lab test deleted successfully");
        getLabtestDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(labList);

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = labTestList.filter(
    (lab) =>
      lab.test_name.toLowerCase().includes(trimmedKeyword) ||
      lab.test_code.toLowerCase().includes(trimmedKeyword)
  );

  const totalPages = Math.ceil(searchFilter.length / complaintsPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const openAddLabTestPopup = (index, item) => {
    // setSelectedItem(item);
    console.log("open pop up");
    setShowAddLabTest(true);
  };

  const displayedAppointments = filterAppointDataByMonth();
  console.log(displayedAppointments);

  const insertLabTestClinic = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dentalhouse-admin.vimubds5.a2hosted.com//api/v1/admin/addLabTest",
        addLabTestField,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Lab Test Added Successfully");
      getLabtestDetails();
      closeUpdatePopup();

      setAddLabTestField({
        test_name: "",
        test_code: "",
        waiting_days: "",
        default_lab: "",
        test_date: "",
        test_cost: "",
      });
    } catch (error) {
      console.log(error);
      cogoToast.error("Test Code Already Exist");
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [trimmedKeyword]);

  return (
    <>
      <Container>
        <div className="mid-box mb-2">
          <div className="row mt-5 background">
            <div className="col-xxl-1 col-xl-1 col-lg-1 col-md-1 col-sm-12 col-12 m-md-3">
              <div className="">
                <button
                  className="btn btn-info lab-actbtn"
                  style={{ backgroundColor: "#1abc9c" }}
                  onClick={() => openAddLabTestPopup()}
                >
                  Add Lab Test
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="search by lab Test Name or code or lab "
            className="inputser"
            value={keyword}
            onChange={handleKeywordChange}
          />
        </div>
        {loading ? (
          <Lottie
            options={defaultOptions}
            height={300}
            width={400}
            style={{ background: "transparent" }}
          ></Lottie>
        ) : (
          <>
            <div class="table-responsive mt-4">
              <table class="table table-bordered">
                <thead className="table-head">
                  <tr>
                    <th>Lab Test Name</th>
                    <th>Lab Test Code</th>
                    <th>Total Waiting Days for Report</th>
                    <th>Default Lab</th>

                    <th>Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAppointments?.map((item) => (
                    <>
                      <tr className="table-row">
                        <td>{item.test_name}</td>
                        <td>{item.test_code}</td>
                        <td>{item.waiting_days}</td>
                        <td>{item.default_lab}</td>

                        <td>{item.test_cost}</td>
                        <td>
                          <button
                            className="btn btn-warning text-light"
                            onClick={() => openUpdatePopup(item)}
                          >
                            <TbEdit size={22} />
                          </button>
                          <button
                            className="btn btn-danger mx-1"
                            onClick={() => deleteLabTestData(item.lab_tid)}
                          >
                            <AiFillDelete size={22} />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>

              <PaginationContainer>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </PaginationContainer>

              {/* pop-up for creating notice */}
              <div className={`popup-container${showPopup ? " active" : ""}`}>
                <div className="popup">
                  <h2>Update Lab Test Details</h2>
                  <form className="d-flex flex-column" onSubmit={updateLabData}>
                    <div className="container">
                      <div className="row">
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Test Name</label>
                            <input
                              type="text"
                              placeholder={selectedItem.test_name}
                              className="rounded p-2"
                              name="test_name"
                              value={upLabTestField.test_name}
                              onChange={handleUpLabTestChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Test Code</label>
                            <input
                              type="number"
                              placeholder={selectedItem.test_code}
                              className="rounded p-2"
                              name="test_code"
                              value={upLabTestField.test_code}
                              onChange={handleUpLabTestChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Waiting for Report Days</label>
                            <input
                              type="text"
                              placeholder={selectedItem.waiting_days}
                              className="rounded p-2"
                              name="waiting_days"
                              value={upLabTestField.waiting_days}
                              onChange={handleUpLabTestChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Lab Name</label>
                            <select
                              className="rounded p-2"
                              name="default_lab"
                              value={upLabTestField.default_lab}
                              onChange={handleUpLabTestChange}
                            >
                              <option value="">-select-</option>
                              {labList?.map((item) => (
                                <>
                                  <option value={item.lab_name}>
                                    {item.lab_name}
                                  </option>
                                </>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Test Date</label>
                            <input
                              type="date"
                              placeholder={selectedItem.test_date}
                              className="rounded p-2"
                              name="test_date"
                              value={upLabTestField.test_date}
                              onChange={handleUpLabTestChange}
                            />
                          </div>
                        </div> */}
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="d-flex flex-column w-100">
                            <label htmlFor="">Test Cost</label>
                            <input
                              type="number"
                              placeholder={selectedItem.test_cost}
                              className="rounded p-2"
                              name="test_cost"
                              value={upLabTestField.test_cost}
                              onChange={handleUpLabTestChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-success mt-2">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mt-2 ms-2"
                        onClick={closeUpdatePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* popup for updating notice */}
            </div>
          </>
        )}

        {/* pop-up for adding lab */}
        <div className={`popup-container${showAddLabTest ? " active" : ""}`}>
          <div className="popup">
            <h4 className="text-center">Add Lab Test</h4>
            <form className="d-flex flex-column" onSubmit={insertLabTestClinic}>
              <div className="container">
                <div className="row">
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="d-flex flex-column w-100">
                      <label htmlFor="">Test Name</label>
                      <input
                        type="text"
                        placeholder="Lab Test Name"
                        className="rounded p-2"
                        name="test_name"
                        required
                        value={addLabTestField.test_name}
                        onChange={handleAddLabTestChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="d-flex flex-column w-100">
                      <label htmlFor="">Test Code</label>
                      <input
                        type="number"
                        placeholder="Lab Test Code"
                        className="rounded p-2"
                        name="test_code"
                        required
                        value={addLabTestField.test_code}
                        onChange={handleAddLabTestChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="d-flex flex-column w-100">
                      <label htmlFor="">Waiting for Report Days</label>
                      <input
                        type="text"
                        placeholder="waiting days"
                        className="rounded p-2"
                        name="waiting_days"
                        required
                        value={addLabTestField.waiting_days}
                        onChange={handleAddLabTestChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="d-flex flex-column w-100">
                      <label htmlFor="">Lab Name</label>
                      <select
                        className="rounded p-2"
                        name="default_lab"
                        required
                        value={addLabTestField.default_lab}
                        onChange={handleAddLabTestChange}
                      >
                        <option value="">-select-</option>
                        {labList?.map((item) => (
                          <>
                            <option value={item.lab_name}>
                              {item.lab_name}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="d-flex flex-column w-100">
                        <label htmlFor="">Test Date</label>
                        <input
                          type="date"
                          placeholder="Lab Test Date"
                          className="rounded p-2"
                          name="test_date"
                          required
                          value={addLabTestField.test_date}
                          onChange={handleAddLabTestChange}
                        />
                      </div>
                    </div> */}
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="d-flex flex-column w-100">
                      <label htmlFor="">Test Cost</label>
                      <input
                        type="number"
                        placeholder="Lab Test Cost"
                        className="rounded p-2"
                        name="test_cost"
                        required
                        value={addLabTestField.test_cost}
                        onChange={handleAddLabTestChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success mt-2">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 ms-2"
                  onClick={closeUpdatePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* pop-up for adding lab */}
      </Container>
    </>
  );
};

export default LabTest;
const Container = styled.div`
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
`;

const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    display: block;
    padding: 8px 16px;
    border: 1px solid black;
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
  }

  .pagination li.active a {
    background-color: #007bff;
    color: white;
    border: 1px solid #007bff;
  }

  .pagination li.disabled a {
    color: #ddd;
    cursor: not-allowed;
    border-radius: 5px;
    background-color: #3a4e69;
    border: 1px solid #3a4e69;
  }

  .pagination li a:hover:not(.active) {
    background-color: #ddd;
    border-radius: 5px;
    border: 1px solid #004aad;
  }

  input::placeholder {
    color: #aaa;
    opacity: 1; /* Ensure placeholder is visible */
    font-size: 1.2rem;
    transition: color 0.3s ease;
  }

  input:focus::placeholder {
    color: transparent; /* Hide placeholder on focus */
  }

  input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }

  input:focus {
    border-color: #007bff; /* Change border color on focus */
  }

  .lab-actbtn {
    background-color: #1abc9c !important;
  }
`;
