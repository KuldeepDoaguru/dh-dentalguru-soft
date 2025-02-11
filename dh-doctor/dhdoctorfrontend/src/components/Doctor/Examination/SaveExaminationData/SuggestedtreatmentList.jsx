import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SittingProcessModal from "./SittingProcessModal";
import BookSittingAppointment from "../../Treatment Suggestion/BookSittingAppointment";
import EditTreatSuggestModal from "./EditTreatSuggestModal";
import { toggleTableRefresh } from "../../../../redux/user/userSlice";

const SuggestedtreatmentList = ({ tpid, getPatientData }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { refreshTable, currentUser } = useSelector((state) => state.user);
  const branch = user.currentUser.branch_name;
  const token = user.currentUser.token;
  console.log(branch);
  const [treatList, setTreatList] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [showEditTreatSug, setShowEditTreatSug] = useState(false);

  const getListTreatment = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/getTreatList/${branch}/${tpid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setTreatList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListTreatment();
  }, [refreshTable]);

  console.log(treatList);

  const handleShowTreatProcess = (item) => {
    setSelectedData(item);
    setShowEditPopup(true);
  };

  const openBookAppoint = () => {
    setShowEditPopup(false);
    setShowBookPopup(true);
  };

  const openTreatEdit = (item) => {
    setShowEditTreatSug(true);
    setSelectedData(item);
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete?");

      if (confirmed) {
        const res = await axios.delete(
          `https://dentalhouse-doctor.vimubds5.a2hosted.com/api/doctor/deleteTreatSuggestion/${id}/${branch}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        dispatch(toggleTableRefresh());
        setTreatList(treatList.filter((item) => item.ts_id !== id));
      }
    } catch (error) {
      console.log(error);
      // Optionally, provide feedback to the user
      window.alert("An error occurred while deleting the item.");
    }
  };

  const totalTreatSuggest = () => {
    try {
      let total = 0;
      treatList.forEach((item) => {
        total = total + parseFloat(item.totalCost);
      });
      console.log(total);
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const grandTotal = totalTreatSuggest();

  console.log(getPatientData);

  return (
    <>
      <Container>
        <div className="box rounded">
          <div className="table-responsive rounded">
            <table
              className="table table-bordered table-striped border rounded"
              style={{ overflowX: "scroll" }}
            >
              <thead className="">
                <tr>
                  <th className="word-wrap">disease</th>
                  <th className="word-wrap">Treatment</th>
                  {/* <th className="word-wrap">Treatment Cost</th> */}
                  <th className="word-wrap">Total Req. Sitting</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {treatList?.map((item) => (
                  <>
                    <tr>
                      <td>{item.desease}</td>
                      <td>{item.treatment_name}</td>
                      {/* <td>{item.totalCost}</td> */}
                      <td>{item.total_sitting}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          {/* <button
                            className="btn btn-info"
                            onClick={() => handleShowTreatProcess(item)}
                          >
                            Set Sitting
                          </button> */}
                          <button
                            className="btn btn-warning ms-2 shadow text-white"
                            style={{
                              backgroundColor: "#0dcaf0",
                              border: "#0dcaf0",
                            }}
                            onClick={() => openTreatEdit(item)}
                          >
                            Change Total Sitting
                          </button>
                          {item.current_sitting > 0 ? (
                            <button
                              className="btn btn-danger ms-2 text-white shadow"
                              style={{
                                backgroundColor: "#0dcaf0",
                                border: "#0dcaf0",
                              }}
                              disabled
                              onClick={() => handleDelete(item.ts_id)}
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className="btn btn-danger ms-2 text-white shadow"
                              style={{
                                backgroundColor: "#0dcaf0",
                                border: "#0dcaf0",
                              }}
                              onClick={() => handleDelete(item.ts_id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <div>
              <h5>Grand Total : {grandTotal}</h5>
            </div>
          </div>
          {showEditPopup && (
            <SittingProcessModal
              onClose={() => setShowEditPopup(false)}
              selectedData={selectedData}
              openBookAppoint={openBookAppoint}
            />
          )}
          {/* {showBookPopup && (
            <BookSittingAppointment
              onClose={() => setShowBookPopup(false)}
              getPatientData={getPatientData}
              selectedData={selectedData}
            />
          )} */}

          {showEditTreatSug && (
            <EditTreatSuggestModal
              onClose={() => setShowEditTreatSug(false)}
              selectedData={selectedData}
              openBookAppoint={openBookAppoint}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default SuggestedtreatmentList;
const Container = styled.div`
  th,
  td {
    text-wrap: nowrap;
  }
`;
