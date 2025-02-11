import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
// import Footer from "./Homepages/Footer";
import Lottie from "react-lottie";
import animationData from "./ani-error.json";

const ErrorPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Pagenot>
        <section class="py-5">
          <div
            class="d-flex justify-content-center 
                    align-items-center flex-column 
                    text-center w-100"
          >
            <div class="bg_img w-50">
              <Lottie
                options={defaultOptions}
                height={300}
                width={400}
                style={{ background: "transparent" }}
              ></Lottie>
              <div>
                <p class="display-4">Looks Like You're Lost</p>
                <p>The page you are looking for not available...</p>
                <button className="btn btn-success" onClick={goBack}>
                  <IoMdArrowRoundBack /> Back
                </button>
              </div>
            </div>
          </div>
        </section>
      </Pagenot>
      {/* <Footer /> */}
    </>
  );
};

export default ErrorPage;

let Pagenot = styled.div`
  .bg_img {
    /* background: url("https://media.geeksforgeeks.org/wp-content/uploads/20240226131034/2142357.jpg"); */
    height: 100%;
    width: 100%;
    padding: 5rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;
