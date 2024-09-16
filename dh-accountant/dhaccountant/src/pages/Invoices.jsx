import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import SittingBillDetails from "./SittingBillDetails";
import SittingPaidBillDetails from "./SittingPaidBillDetails";
import PatientsDue from "../components/PatientsDueOurPaid/PatientsDue";
import PatientsPaid from "../components/PatientsDueOurPaid/PatientsPaid";

function Invoices() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dueSittingBill");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

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
                {/* <div className="text-center">
            <h3>All Patients Invoice</h3>
          </div> */}

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link nav-link1 ${
                        activeTab === "dueSittingBill" ? "active" : ""
                      }`}
                      id="dueSitting-tab"
                      type="button"
                      role="tab"
                      onClick={() => handleTabClick("dueSittingBill")}
                    >
                      Due Sitting Bill
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link nav-link1 ${
                        activeTab === "paidSittingBill" ? "active" : ""
                      }`}
                      id="paidSitting-tab"
                      type="button"
                      role="tab"
                      onClick={() => handleTabClick("paidSittingBill")}
                    >
                      Paid Sitting Bill
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link nav-link1 ${
                        activeTab === "due" ? "active" : ""
                      }`}
                      id="due-tab"
                      type="button"
                      role="tab"
                      onClick={() => handleTabClick("due")}
                    >
                      Due Invoices
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link nav-link1 ${
                        activeTab === "paid" ? "active" : ""
                      }`}
                      id="paid-tab"
                      type="button"
                      role="tab"
                      onClick={() => handleTabClick("paid")}
                    >
                      Paid Invoices
                    </button>
                  </li>

                  <div className="tab-content" id="myTabContent">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "dueSittingBill" ? "show active" : ""
                      }`}
                      id="dueSitting-tab-pane"
                      role="tabpanel"
                      aria-labelledby="dueSitting-tab"
                      tabIndex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item" id="app">
                          <SittingBillDetails />
                        </li>
                      </ul>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "paidSittingBill" ? "show active" : ""
                      }`}
                      id="paidSitting-tab-pane"
                      role="tabpanel"
                      aria-labelledby="paidSitting-tab"
                      tabIndex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item" id="app">
                          <SittingPaidBillDetails />
                        </li>
                      </ul>
                    </div>

                    <div
                      className={`tab-pane fade ${
                        activeTab === "due" ? "show active" : ""
                      }`}
                      id="due-tab-pane"
                      role="tabpanel"
                      aria-labelledby="due-tab"
                      tabIndex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item">
                          <PatientsDue />
                        </li>
                      </ul>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "paid" ? "show active" : ""
                      }`}
                      id="paid-tab-pane"
                      role="tabpanel"
                      aria-labelledby="paid-tab"
                      tabIndex="0"
                    >
                      <ul className="list-group">
                        <li className="list-group-item" id="app">
                          <PatientsPaid />
                        </li>
                      </ul>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Invoices;
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
