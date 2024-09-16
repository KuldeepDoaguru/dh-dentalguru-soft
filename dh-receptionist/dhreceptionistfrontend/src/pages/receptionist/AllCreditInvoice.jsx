import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/receptionist/Header";
import Sider from "../../components/receptionist/Sider";
import SittingCreditBill from "./SittingCreditBill";
import FinalCreditInvoice from "./FinalCreditInvoice";
import CreditOPDBill from "./CreditOPDBill";
import { useLocation, useNavigate } from "react-router-dom";


function AllCreditInvoice() {
  
  const location = useLocation();
  const navigate =  useNavigate ();

  const [activeTab, setActiveTab] = useState('creditSittingBill');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
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

      <div className="row flex-nowrap ">
        <div className="col-lg-1 col-1" id="hd">
          <Sider />
        </div>
        <div className="col-lg-11 mt-2" id="set">
          {/* <div className="text-center">
            <h3>All Patients Credit Invoice</h3>
          </div> */}

          <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            
            className={`nav-link nav-link1 ${activeTab === 'creditSittingBill' ? 'active' : ''}`}
            id="creditSitting-tab"
            type="button"
            role="tab"
            onClick={() => handleTabClick('creditSittingBill')}
          >
            Sitting Bill
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link nav-link1 ${activeTab === 'creditInvoice' ? 'active' : ''}`}
            id="creditInvoice-tab"
           
            type="button"
            role="tab"
            onClick={() => handleTabClick('creditInvoice')}

          >
           Invoice
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link nav-link1 ${activeTab === 'creditOpd' ? 'active' : ''}`}
            id="creditOpd-tab"
            
            type="button"
            role="tab"
            onClick={() => handleTabClick('creditOpd')}
          >
           OPD Bill
          </button>
        </li>
        <div className="tab-content" id="myTabContent">
          <div
            className={`tab-pane fade ${activeTab === 'creditSittingBill' ? 'show active' : ''}`}
            id="creditSitting-tab-pane"
            role="tabpanel"
            aria-labelledby="creditSitting-tab"
            tabindex="0"
          >
            <ul className="list-group">
              <li className="list-group-item">
               <SittingCreditBill/>
              </li>
            </ul>
          </div>
          <div
            className={`tab-pane fade ${activeTab === 'creditInvoice' ? 'show active' : ''}`}
            id="creditInvoice-tab-pane"
            role="tabpanel"
            aria-labelledby="creditInvoice-tab"
            tabindex="0"
          >
            <ul className="list-group">
              <li className="list-group-item" id="app">
               <FinalCreditInvoice/>
              </li>
            </ul>
          </div>
          <div
            className={`tab-pane fade ${activeTab === 'creditOpd' ? 'show active' : ''}`}
            id="creditOpd-tab-pane"
            role="tabpanel"
            aria-labelledby="creditOpd-tab"
            tabindex="0"
          >
            <ul className="list-group">
              <li className="list-group-item" id="app">
               <CreditOPDBill/>
              </li>
            </ul>
          </div>
          </div>
        </ul>
       
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
      margin-left: -2rem;
    }
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: -1.9rem;
    }
    @media screen and (min-width: 1700px) and (max-width: 2000px) {
      margin-left: -1rem;
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
    background-color: #22a6b3;
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
