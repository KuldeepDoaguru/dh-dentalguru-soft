import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/user/userSlice";
import cogoToast from "cogo-toast";
import { MdManageAccounts } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { MdOutlineEditNote } from "react-icons/md";
import { ImLab } from "react-icons/im";

const UniversalLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [verification, setVerification] = useState(false);
  const [localhost, setLocalhost] = useState([]);
  const [braches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  // const sendOtp = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:7777/api/v1/super-admin/sendOtp",
  //       {
  //         email,
  //       }
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getBranches = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/receptionist/get-branches"
      );
      console.log(response);
      setBranches(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranches();
  }, []);

  const handleSelectBranch = (e) => {
    setSelectedBranch(e.target.value);
  };

  console.log(selectedBranch);
  const receptionistLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/receptionist/receptionist-login",
        {
          email,
          password,
          branch_name: selectedBranch,
        }
      );

      console.log(response.data);

      // cogoToast.success(response.data.message);
      setLocalhost(response.data);
      if (response.data.success === "true") {
        // sendOtp();
        cogoToast.success("login successful");
        dispatch(setUser(response.data.user));
        navigate("/receptionist-dashboard");
        // setPopupVisible(true);
      } else {
        cogoToast.error(response.data.message);
      }
    } catch (error) {
      console.log("Axios error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If there is a response object and it contains a message property
        cogoToast.error(error.response.data.message);
      } else {
        // If there is no response object or no message property
        cogoToast.error("An error occurred while processing your request.");
      }
    }
  };

  const closeUpdatePopup = () => {
    setPopupVisible(false);
  };

  // const Popup = ({ email, onClose }) => {
  //   const [otp, setOtp] = useState("");
  //   console.log(email);

  //   const verifyOtpAdmin = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:7777/api/v1/super-admin/verifyOtp",
  //         {
  //           email,
  //           otp,
  //         }
  //       );
  //       console.log(response);
  //       console.log(localhost);
  //       const userData = {
  //         name: localhost.user.email,
  //         id: localhost.user.id,
  //       };
  //       // localStorage.setItem("userData", JSON.stringify(userData));
  //       dispatch(setUser(userData));
  //       navigate("/superadmin-dashboard");
  //       setVerification(true);
  //     } catch (error) {
  //       console.log(error);
  //       // cogoToast.error("Wrong OTP!");
  //     }
  //   };

  //   useEffect(() => {
  //     console.log("Popup visible state updated:", popupVisible);
  //   }, [popupVisible]);

  //   return (
  //     <>
  //       <div>
  //         <div className={`popup-container${popupVisible ? " active" : ""}`}>
  //           <div className="popup">
  //             <form onSubmit={verifyOtpAdmin} className="d-flex flex-column">
  //               <div className="d-flex justify-content-evenly flex-column">
  //                 <label htmlFor="otp" className="fw-bold">
  //                   Enter OTP
  //                 </label>
  //                 <input
  //                   type="text"
  //                   placeholder="Enter OTP"
  //                   className="mb-3 rounded p-1"
  //                   name="otp"
  //                   value={otp}
  //                   onChange={(e) => setOtp(e.target.value)}
  //                 />

  //                 <button type="submit" className="btn btn-success mt-2 mb-2">
  //                   Login
  //                 </button>
  //                 <button
  //                   type="button"
  //                   className="btn btn-danger mt-2"
  //                   onClick={onClose}
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };
  return (
    <>
      <Container>
        <section className="vh-100">
          <div className="container h-100 ">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div className="text-black cardstyle shadow">
                  <div className="card-body p-5">
                    <div className="row justify-content-center">
                      <div className="col-md-10 col-lg-6 col-xl-5 order-2">
                        <h1 className="text-center">DENTALGURU</h1>
                        <p className="text-center h4 fw-bold mb-5 mx-1 mx-md-4 mt-4 heading">
                          Please Select User
                        </p>
                        <div class="d-grid gap-4">
                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse-superadmin.vimubds5.a2hosted.com"
                            }
                          >
                            {" "}
                            <button
                              className="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                <RiAdminLine />
                              </span>{" "}
                              Super Admin
                            </button>
                          </Link>
                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse-admin.vimubds5.a2hosted.com"
                            }
                          >
                            <button
                              class="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                {" "}
                                <MdManageAccounts />
                              </span>{" "}
                              Admin
                            </button>
                          </Link>

                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse-accountant.vimubds5.a2hosted.com"
                            }
                          >
                            <button
                              class="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                <HiOutlineBanknotes />
                              </span>{" "}
                              Accountant
                            </button>
                          </Link>

                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse-receptionist.vimubds5.a2hosted.com"
                            }
                          >
                            <button
                              class="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                <MdOutlineEditNote />
                              </span>{" "}
                              Receptionist
                            </button>
                          </Link>

                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse-doctor.vimubds5.a2hosted.com"
                            }
                          >
                            <button
                              class="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                <FaUserDoctor />
                              </span>{" "}
                              Doctor
                            </button>
                          </Link>

                          <Link
                            target="_blank"
                            to={
                              "https://dentalhouse.lab.vimubds5.a2hosted.com/"
                            }
                          >
                            <button
                              class="btn btn-primary fs-4"
                              type="button"
                              style={{ width: "100%" }}
                            >
                              <span className="icon">
                                <ImLab />
                              </span>{" "}
                              Laboratory
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1">
                        <img
                          src="https://res.cloudinary.com/dq5upuxm8/image/upload/v1708075638/dental%20guru/Login-page_1_cwadmt.png"
                          className="img-fluid"
                          alt="Sample"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* {popupVisible && <Popup email={email} onClose={closeUpdatePopup} />} */}
      </Container>
    </>
  );
};

export default UniversalLogin;
const Container = styled.div`
  .heading {
    font-family: "Roboto", sans-serif; /* Set the font to Roboto */
  }
  .btn {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: white;
    background-color: #0d6efd;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out, border 0.3s ease,
      border-radius 0.3s ease;
    font-family: "Roboto", sans-serif; /* Set the font to Roboto */
  }

  .btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%; /* Start from the left side */
    width: 100%;
    height: 100%;
    background: black; /* Set background color */
    transition: left 0.3s ease-in-out;
    z-index: -1; /* Place it behind the content */
  }

  .btn:hover::before {
    left: 0; /* Fill from the left side */
  }

  .btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-10px) scale(1.05);
    border: none;
  }

  .btn .icon {
    transition: transform 0.3s ease-in-out;
  }

  .btn:hover .icon {
    transform: scale(1.3);
  }

  .cardstyle {
    border-radius: 25px;
    background-color: #d7f3f0 !important;
  }

  a {
    text-decoration: none;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
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
  }

  .popup-container.active {
    display: flex;
    background-color: #00000075;
    z-index: 1;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .icon {
    float: left;
  }
`;
