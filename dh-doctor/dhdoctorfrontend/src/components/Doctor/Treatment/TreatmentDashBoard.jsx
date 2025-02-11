import React from "react";
import styled from "styled-components";
import HeadBar from "../HeadBar";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import NewTreatment from "./NewTreatment";

const TreatmentDashBoard = () => {
  const { tpid, appoint_id } = useParams();
  console.log(appoint_id);
  console.log(tpid);
  return (
    <>
      <Wrapper>
        <HeadBar />

        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap">
              <div className="col-lg-1 col-1 p-0">
                <SideBar />
              </div>
              <div className="col-lg-11 col-11 ps-0 m-2">
                <NewTreatment />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default TreatmentDashBoard;
const Wrapper = styled.div`
  overflow-x: hidden;
`;
