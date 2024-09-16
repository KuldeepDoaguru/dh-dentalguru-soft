import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeadBar from "../../HeadBar";
import Sider from "../../SideBar";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const QPrescriptionForm = () => {
  const navigate = useNavigate();
  console.log(useParams());
  const { patient_uhid, appoint_id } = useParams();
  const dispatch = useDispatch();
  const { refreshTable } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  console.log(user);

  const token = user.currentUser.token;
  const [appointments, setAppointments] = useState({});
  const [chiefList, setChiefList] = useState([]);
  const [formData, setFormData] = useState({
    name: appointments?.patient_name,
    branch_name: user.currentUser.branch_name,
    uhid: appointments?.uhid,
    appoint_id: appoint_id,
    age: appointments?.age,
    gender: appointments?.gender,
    chief_complain: "",
    medical_histry: "",
    dental_histry: "",
    onexam: "",
    advice: "",
    medicines: "",
    dosage: "",
    frequency: "",
    duration: "",
    note: "",
  });

  const ChiefComplainTOList = async () => {
    try {
      const { data } = await axios.get(
        "https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getChiefComplain",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChiefList(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/get-Patient-by-id/${patient_uhid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    ChiefComplainTOList();
  }, []);

  console.log(appointments.patient_name);
  console.log(chiefList);

  useEffect(() => {
    if (appointments) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: appointments.patient_name,
        uhid: appointments.uhid,
        appoint_id: appoint_id,
        age: appointments.age,
        gender: appointments.gender,
      }));
    }
  }, [appointments, appoint_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);

  const payload = {
    ...appointments,
    ...formData,
  };

  console.log(payload);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/insertPatientPrescription`,
        formData
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`, // Ensure this is needed or correct
        //   },
        // }
      );
      alert("Prescription inserted successfully");
      setFormData({
        chief_complain: "",
        medical_history: "",
        dental_history: "",
        onexam: "",
        advice: "",
        medicines: "",
        note: "",
      });
      navigate(`/view-quick-prescription/${patient_uhid}/${appoint_id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <HeadBar />
      <div className="main">
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className="col-lg-1 col-1 p-0">
              <Sider />
            </div>
            <div className="col-lg-11 col-11 ps-0 m-2">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="text-center">
                      <h2 className="m-4">Create Quick Prescription</h2>
                    </div>
                    <div className="container">
                      <div className="row">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-4">
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="patientName">
                                  Patient name
                                </label>
                                <input
                                  type="text"
                                  id="patientName"
                                  name="patientName"
                                  className="form-control"
                                  placeholder="Patient name"
                                  value={appointments.patient_name || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="uhid">UHID</label>
                                <input
                                  type="text"
                                  id="uhid"
                                  name="uhid"
                                  className="form-control"
                                  placeholder="UHID"
                                  value={appointments.uhid || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="appoint_id">Appoint ID</label>
                                <input
                                  type="text"
                                  id="appoint_id"
                                  name="appoint_id"
                                  className="form-control"
                                  value={appoint_id || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="age">Age</label>
                                <input
                                  type="text"
                                  id="age"
                                  name="age"
                                  className="form-control"
                                  placeholder="Age"
                                  value={appointments.age || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="gender">Gender</label>
                                <input
                                  type="text"
                                  id="gender"
                                  name="gender"
                                  className="form-control"
                                  placeholder="Gender"
                                  value={appointments.gender || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="dateOfVisit">
                                  Date of Visit
                                </label>
                                <input
                                  type="text"
                                  id="dateOfVisit"
                                  name="dateOfVisit"
                                  className="form-control"
                                  value={appointments.created_at || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4 g-3">
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="chief_complain">
                                  Chief Complaint
                                </label>
                                {/* <input
                                  type="text"
                                  id="chief_complain"
                                  name="chief_complain"
                                  className="form-control"
                                  placeholder="Chief Complaint"
                                  value={formData.chief_complain}
                                  onChange={handleChange}
                                /> */}
                                <select
                                  name="chief_complain"
                                  className="form-control"
                                  id=""
                                  onChange={handleChange}
                                  value={formData.chief_complain}
                                >
                                  <option value="">-select-</option>
                                  {chiefList?.map((item) => (
                                    <>
                                      <option value={item.chief_complain}>
                                        {item.chief_complain}
                                      </option>
                                    </>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="medical_history">
                                  Medical History
                                </label>
                                <input
                                  type="text"
                                  id="medical_history"
                                  name="medical_histry"
                                  className="form-control"
                                  placeholder="Medical History"
                                  value={formData.medical_histry}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="dental_history">
                                  Dental History
                                </label>
                                <input
                                  type="text"
                                  id="dental_history"
                                  name="dental_histry"
                                  className="form-control"
                                  placeholder="Dental History"
                                  value={formData.dental_histry}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="onexam">On Examination</label>
                                <input
                                  type="text"
                                  id="onexam"
                                  name="onexam"
                                  className="form-control"
                                  placeholder="On Examination"
                                  value={formData.onexam}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="advice">Advice</label>
                                <input
                                  type="text"
                                  id="advice"
                                  name="advice"
                                  className="form-control"
                                  placeholder="Advice"
                                  value={formData.advice}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label htmlFor="medicines">Medicines</label>
                                <input
                                  type="text"
                                  id="medicines"
                                  name="medicines"
                                  className="form-control"
                                  placeholder="Medicines"
                                  value={formData.medicines}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label>Dosage</label>
                                <input
                                  type="text"
                                  name="dosage"
                                  className="form-control"
                                  placeholder="dosage"
                                  value={formData.dosage}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label>Frequency</label>
                                <input
                                  type="text"
                                  name="frequency"
                                  className="form-control"
                                  placeholder="frequency"
                                  value={formData.frequency}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="form-outline">
                                <label>Duration</label>
                                <input
                                  type="text"
                                  name="duration"
                                  className="form-control"
                                  placeholder="duration"
                                  value={formData.duration}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                              <div className="form-outline">
                                <label>Duration</label>
                                <textarea
                                  type="text"
                                  name="note"
                                  className="form-control"
                                  placeholder="write note..."
                                  value={formData.note}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary shadow"
                            type="submit"
                          >
                            Create Prescription
                          </button>
                        </form>
                        {/* <button
                          className="btn btn-info w-25 mt-3"
                          onClick={handleViewPres}
                        >
                          Preview Prescription{" "}
                          <IoIosArrowRoundForward size={25} />
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default QPrescriptionForm;

const Wrapper = styled.div``;
