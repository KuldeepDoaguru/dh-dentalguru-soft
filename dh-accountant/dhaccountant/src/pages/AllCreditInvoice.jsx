import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SittingCreditBill from "./SittingCreditBill";
import FinalCreditInvoice from "./FinalCreditInvoice";
import CreditOPDBill from "./CreditOPDBill";
// import SittingCreditBill from "./SittingCreditBill";
// import FinalCreditInvoice from "./FinalCreditInvoice";
// import CreditOPDBill from "./CreditOPDBill";

function AllCreditInvoice() {
  return (
    <Wrapper>
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <div className="container-fluid">
          <div className="row flex-nowrap ">
            <div
              className="col-xxl-1 col-xl-1 col-lg-1 col-md-2 col-sm-2 p-0"
              id="hd"
            >
              <Sider />
            </div>
            <div
              className="col-xxl-11 col-xl-11 col-lg-11 col-md-10 col-sm-10"
              id="set"
            >
              <div className="container-fluid mt-3">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active nav-link1"
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#home-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="home-tab-pane"
                      aria-selected="true"
                    >
                      Sitting Bill
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link nav-link1"
                      id="profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="profile-tab-pane"
                      aria-selected="false"
                    >
                      Invoice
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link nav-link1"
                      id="opd-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#opd-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="opd-tab-pane"
                      aria-selected="false"
                    >
                      OPD Bill
                    </button>
                  </li>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="home-tab-pane"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                      tabindex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item">
                          <SittingCreditBill />
                        </li>
                      </ul>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="profile-tab-pane"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      tabindex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item" id="app">
                          <FinalCreditInvoice />
                        </li>
                      </ul>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="opd-tab-pane"
                      role="tabpanel"
                      aria-labelledby="opd-tab"
                      tabindex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item" id="app">
                          <CreditOPDBill />
                        </li>
                      </ul>
                    </div>
                  </div>
                </ul>
              </div>
              ;
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default AllCreditInvoice;
const Wrapper = styled.div`
  overflow: hidden;
  #hd {
    padding-top: 60px; /* Height of header */
    min-height: 100vh;
    position: fixed;
    @media screen and (max-width: 768px) {
      height: 68rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      height: 58rem;
    }
  }

  #set {
    margin-left: -4.5rem;
    padding-left: 150px; /* Width of sidebar */
    padding-top: 90px; /* Height of header */
    flex-grow: 1;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      margin-left: -2rem;
    }
    @media screen and (min-width: 1020px) and (max-width: 1500px) {
      margin-left: -1rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 0.1rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
      margin-left: 0rem;
    }

    @media screen and (min-width: 2000px) and (max-width: 2500px) {
      margin-left: 0rem;
    }
  }

  .header {
    position: fixed;
    min-width: 100%;
    z-index: 100;
  }
  .nav-link1 {
    background-color: #201658;
    /* color: #000; */
    color: #fff;
    margin-left: 1px;
    font-weight: 700;
    font-size: large;
  }
  #tableresponsive {
    @media screen and (max-width: 768px) {
      width: 95%;
    }
  }
  #tableresponsive1 {
    @media screen and (max-width: 768px) {
      width: 95%;
    }
  }
  #myTab {
    @media screen and (max-width: 768px) {
      width: 90%;
      margin-left: 1.2rem;
    }
  }
  #myTabContent {
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    @media screen and (min-width: 768px) and (max-width: 2200px) {
      width: 100%;
    }
  }
`;
