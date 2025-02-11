import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Timeline = () => {
  const dispatch = useDispatch();
  const { pid } = useParams();
  const user = useSelector((state) => state.user);

  const branch = user.branch;
  const token = user.token;

  const [patTimeline, setPatTimeline] = useState([]);

  const getTimelineDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalhouse-accountant.vimubds5.a2hosted.com/api/v2/accountant/getPatientTimeline/${branch}/${pid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setPatTimeline(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(patTimeline);

  useEffect(() => {
    getTimelineDetails();
  }, []);
  return (
    <Wrapper>
      <div className="table cont-box">
        <div
          className="widget-area-2 proclinic-box-shadow mx-3 mt-5"
          id="tableres"
        >
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event Time</th>
                  <th>Event Type</th>
                  <th>Event Detail</th>
                </tr>
              </thead>
              <tbody>
                {patTimeline?.map((item) => {
                  // <>
                  //   <tr>
                  //     <td>{item?.event_date}</td>
                  //     <td>{item?.event_time?.split(".")[0]}</td>
                  //     <td>{item?.event_type}</td>
                  //     <td>{item?.event_description}</td>
                  //   </tr>
                  // </>
                  let formattedTime = item?.event_time;

                  // Check if the time is in HH:mm:ss format and convert it to hh:mm A
                  if (
                    formattedTime &&
                    formattedTime.includes(":") &&
                    formattedTime.split(":").length === 3
                  ) {
                    formattedTime = moment(formattedTime, "HH:mm:ss").format(
                      "hh:mm A"
                    );
                  }

                  return (
                    <tr key={item?.event_date + item?.event_time}>
                      <td>{item?.event_date}</td>
                      <td>{formattedTime}</td>
                      <td>{item?.event_type}</td>
                      <td>{item?.event_description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Timeline;
const Wrapper = styled.div`
  .table {
    @media screen and (max-width: 768px) {
      width: auto;
    }
  }

  .cont-box {
    width: 68rem;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
  th {
    white-space: nowrap;
  }
`;
