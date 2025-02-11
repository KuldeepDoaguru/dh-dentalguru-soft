import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import cogoToast from "cogo-toast";
import { toggleTableRefresh } from "../../../redux/user/userSlice";

const SecurityAmtUpdateModal = ({ onClose, selectedData, grandTotal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { refreshTable } = useSelector((state) => state.user);
  const branch = currentUser.branch_name;
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const token = user.currentUser.token;
  console.log(selectedData);
  console.log(branch);
  const [formData, setFormData] = useState({
    amount: "",
    remaining_amount: "",
    payment_status: "",
    payment_Mode: "",
    transaction_Id: "",
  });

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // If payment status changes to "success", set the current date
    if (name === "payment_status" && value === "success") {
      updatedFormData = {
        ...updatedFormData,
        payment_date: new Date().toISOString().slice(0, 10),
        remaining_amount: formData.amount,
      };
    }

    setFormData(updatedFormData);
  };

  const timelineForSecuirty = async () => {
    // alert("timeline");
    try {
      const response = await axios.post(
        "https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/insertTimelineEvent",
        {
          type: "Secuirty Amount Update",
          description: `${formData.amount} Secuirty Amount Updated`,
          branch: currentUser ? branch : "",
          patientId: selectedData.uhid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // alert("timeline addedd");
      console.log(response);
    } catch (error) {
      // alert("error timeline");
      console.log(error);
    }
  };

  const updateSecAmountDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/updateSecurityAmountForRemainingAmount/${selectedData.sa_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      timelineForSecuirty();
      cogoToast.success("security amount detail updated");
      onClose();
      dispatch(toggleTableRefresh());
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <Modal show={true} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Security Amount Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateSecAmountDetails}>
              <div class="input-group mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Security Amount
                </label>
                <input
                  type="number"
                  class="p-1 w-100 rounded"
                  placeholder="Security Amount"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                />
                <small style={{ color: "red" }}>
                  *Suggested Security Amount : {grandTotal}
                </small>
              </div>
              <div class="input-group mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Payment Status
                </label>

                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  id=""
                  class="p-1 w-100 rounded"
                  required
                >
                  <option value="">select-status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                </select>
              </div>
              {formData.payment_status === "success" && (
                <>
                  <div className="">
                    <div className="input-group mb-3">
                      <label
                        htmlFor="exampleFormControlInput2"
                        className="form-label"
                      >
                        Payment Method
                      </label>
                      <select
                        name="payment_Mode"
                        value={formData.payment_Mode}
                        onChange={handleChange}
                        className="p-1 w-100 rounded"
                        required
                      >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>
                  {formData.payment_Mode === "online" && (
                    <div className="">
                      <div className="input-group mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label mx-2"
                        >
                          Transaction ID
                        </label>
                        <br />
                        <input
                          type="text"
                          name="transaction_Id"
                          value={formData.transaction_Id}
                          onChange={handleChange}
                          className="p-1 w-100 rounded"
                          placeholder="Enter Transaction ID"
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div class="mb-3 d-flex justify-content-between">
                <button
                  type="submit"
                  class="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Submit..." : "Submit"}{" "}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default SecurityAmtUpdateModal;
const Container = styled.div``;
