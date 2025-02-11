import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { AiFillDelete } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import Lottie from "react-lottie";
import animationData from "../../animation/loading-effect.json";

const Lab = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [labList, setLabList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const branch = useSelector((state) => state.branch);
  const { refreshTable } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const complaintsPerPage = 8; // Number of complaints per page
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page
  const [upLabField, setUpLabField] = useState({
    branch: "",
    name: "",
    type: "internal",
    contact: "",
    email: "",
    address: "",
    status: "",
  });

  const handleAddLabChange = (event) => {
    const { name, value } = event.target;
    if (name === "contact") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setUpLabField((prevEmpData) => ({
          ...prevEmpData,
          [name]: value,
        }));
      }
    } else {
      setUpLabField((prevEmpData) => ({
        ...prevEmpData,
        [name]: value,
      }));
    }
  };

  console.log(upLabField);

  const openUpdatePopup = (item) => {
    setSelectedItem(item);
    console.log("open pop up");
    setUpLabField({
      branch: item.branch_name,
      name: item.lab_name,
      type: item.lab_type,
      contact: item.lab_contact,
      email: item.lab_email,
      address: item.address,
      status: item.status,
    });
    setShowPopup(true);
  };

  const closeUpdatePopup = () => {
    setShowPopup(false);
  };

  console.log(showPopup);
  const getListLabDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getLabList/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setLabList(data);
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(labList);
  console.log(selectedItem);

  useEffect(() => {
    getListLabDetails();
  }, []);

  useEffect(() => {
    getListLabDetails();
  }, [branch.name]);

  const updateLabData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/updateLabDetails/${selectedItem.lab_id}`,
        upLabField,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Lab details updated successfully");
      getListLabDetails();
      closeUpdatePopup();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selectedItem);

  const deleteLabData = async (id) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete?");
      if (isConfirmed) {
        const response = await axios.delete(
          `https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/labDelete/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        cogoToast.success("lab deleted successfully");
        getListLabDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBranchList = async () => {
    try {
      const response = await axios.get(
        "https://dentalhouse-superadmin.vimubds5.a2hosted.com/api/v1/super-admin/getBranch"
      );
      console.log(response.data);
      setBranchList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchList();
  }, []);

  console.log(branchList);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const trimmedKeyword = searchTerm.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = labList.filter(
    (lab) =>
      lab.lab_name.toLowerCase().includes(trimmedKeyword) ||
      lab.lab_email.toLowerCase().includes(trimmedKeyword) ||
      lab.lab_contact.includes(trimmedKeyword)
  );

  const totalPages = Math.ceil(searchFilter.length / complaintsPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const displayedAppointments = filterAppointDataByMonth();

  // useEffect(()=>{
  //   setUpLabField({
  //     branch: labList.branch_name,
  //     name: labList.name,
  //     type: labList.type,
  //     contact: labList.contact,
  //     email: labList.email,
  //     address: labList.address,
  //     status: labList.status,
  //   })
  // }, [labList]);

  return (
    <>
      <Container>
        <div className="mid-box">
          <div className="row mt-2 background">
            <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
              <input
                type="text"
                placeholder="search by lab name or contact or email address"
                className="inputser"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
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
                    <th>Branch</th>
                    <th>Lab Name</th>
                    <th>Lab Type</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAppointments?.map((item) => (
                    <>
                      <tr className="table-row">
                        <td>{item.branch_name}</td>
                        <td>{item.lab_name}</td>
                        <td>{item.lab_type}</td>
                        <td>{item.lab_contact}</td>
                        <td>{item.lab_email}</td>
                        <td>{item.address}</td>
                        <td>{item.status}</td>
                        <td>
                          <button
                            className="btn btn-warning text-light"
                            style={{
                              backgroundColor: "#014cb1",
                              borderColor: "#014cb1",
                            }}
                            onClick={() => openUpdatePopup(item)}
                          >
                            <TbEdit size={22} />
                          </button>
                          {/* <button
                            className="btn btn-danger mx-1"
                            onClick={() => deleteLabData(item.lab_id)}
                          >
                            <AiFillDelete size={22} />
                          </button> */}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>

              <PaginationContainer>
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
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
                  <h2>Update Lab Details</h2>
                  <form className="d-flex flex-column" onSubmit={updateLabData}>
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column">
                        <label htmlFor="">Select Branch</label>
                        <select
                          className="rounded p-2"
                          name="branch"
                          value={upLabField.branch}
                          onChange={handleAddLabChange}
                        >
                          <option value="">-select-</option>
                          {branchList?.map((item) => (
                            <>
                              <option value={item.branch_name}>
                                {item.branch_name}
                              </option>
                            </>
                          ))}
                        </select>

                        {/* <input
                      type="text"
                      placeholder="Lab Name"
                      className="rounded p-2"
                      name="name"
                      value={upLabField.name}
                      onChange={handleAddLabChange}
                    /> */}
                      </div>
                      <div className="d-flex mt-2">
                        <div className="d-flex flex-column">
                          <label htmlFor="">Lab Name</label>
                          <input
                            type="text"
                            placeholder="Lab Name"
                            className="rounded p-2"
                            name="name"
                            value={upLabField.name}
                            onChange={handleAddLabChange}
                            readOnly
                          />
                        </div>
                        <div className="d-flex flex-column mx-2 w-100">
                          <label htmlFor="">Type</label>
                          <select
                            className="typeset w-100 mt-2"
                            name="type"
                            value={upLabField.type}
                            onChange={handleAddLabChange}
                            readonly
                          >
                            {/* <option value="">-select-</option> */}
                            <option value="internal">Internal</option>
                            {/* <option value="external">External</option> */}
                          </select>
                        </div>
                      </div>
                      <br />
                      <div className="d-flex">
                        <div className="d-flex flex-column">
                          <label htmlFor="">Number</label>
                          <input
                            type="text"
                            placeholder="contact number"
                            className="rounded p-2"
                            name="contact"
                            value={upLabField.contact}
                            onChange={handleAddLabChange}
                          />
                        </div>
                        <div className="d-flex flex-column mx-2">
                          <label htmlFor="">Email</label>
                          <input
                            type="email"
                            placeholder="add email"
                            className="rounded p-2"
                            name="email"
                            value={upLabField.email}
                            onChange={handleAddLabChange}
                          />
                        </div>
                      </div>
                      <br />
                      <div className="d-flex flex-column">
                        <label htmlFor="">Address</label>
                        <textarea
                          name="address"
                          id=""
                          cols="30"
                          rows="3"
                          value={upLabField.address}
                          onChange={handleAddLabChange}
                        ></textarea>
                      </div>
                      <br />
                      <div className="d-flex flex-column w-100">
                        <label htmlFor="">Status</label>
                        <select
                          className="typeset w-100"
                          name="status"
                          value={upLabField.status}
                          onChange={handleAddLabChange}
                        >
                          <option value="">-select-</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                        </select>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
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

              {/* popup for updating notice */}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Lab;
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
    border: 1px solid #e6ecf1;
    color: #007bff;
    cursor: pointer;
    /* background-color: #004aad0a; */
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
  }

  .pagination li.active a {
    background-color: #004aad;
    color: white;
    border: 1px solid #004aad;
    border-radius: 5px;
  }

  .pagination li.disabled a {
    color: white;
    cursor: not-allowed;
    border-radius: 5px;
    background-color: #3a4e69;
    border: 1px solid #3a4e69;
  }

  .pagination li a:hover:not(.active) {
    background-color: #004aad;
    color: white;
    border-radius: 5px;
    border: 1px solid #004aad;
  }
`;
