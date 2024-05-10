import React, { useState, useEffect } from "react";
import ChevronDots from "./ChevronDots.js";
import QualifyingExamDetails from "./QualifyingExamDetails";
import Declaration from "./Declaration";
import ApplicationFeeDetails from "./ApplicationFeeDetails";
import Review from "./Review.js";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import screenSpinner from "../../images/2300-spinner.gif";
import SponsorshipDetails from "./SponsorshipDetails.js";
import { useLocation } from "react-router-dom";

function ReApplicantionDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const data = searchParams.get("data");
  const decodedData = JSON.parse(data);

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { handleSubmit } = useForm();
  const [full_name, setFullName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryFees, setCategoryFees] = useState("");
  const [offering, setOffering] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [hasFilledHighestGate, setHasFilledHighestGate] = useState("");
  const [hasGivenMultipleGates, setHasGivenMultipleGates] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  function changeDateFormat() {
    let date = new Date();

    let month = date.getMonth() + 1;
    let day = String(date.getDate());
    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;

    date = date.getFullYear() + "-0" + month + "-" + day;

    return date;
  }

  const [previous_info, setPreviousInfo] = useState();

  useEffect(() => {
    Axios.get("/reapply-check-applicant-info", {
      headers: {
        Authorization: getToken(),
        offering_id: params.offering_id,
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else if (response.data === 2) {
          navigate("/home");
        } else if (response.data === 3) {
          navigate("/home");
        } else {
          const names = response.data.previous_info.rows[0];
          setPreviousInfo(names);
          setFullName(response.data.full_name);
          setCategory(response.data.category);
          setCategoryFees(response.data.category_fees);
          setIsFetching(false);
        }
      })
      .catch((err) => console.log(err));

    Axios.get("/get-offering-info", {
      headers: {
        Authorization: getToken(),
        offering_id: params.offering_id,
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          setOffering(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const init_application_details = () => {
    const array = Array.from({ length: 30 }, () => "");

    array[6] = "GATE";

    // array[21] = previous_info.sponsored; array[22] = previous_info.sponsored_by; array[23] = previous_info.sponsored_organization; array[24] = previous_info.sponsored_designation; array[25] = previous_info.sponsored_experience;
    array[5] = changeDateFormat();
    array[19] = changeDateFormat();
    array[20] = params.offering_id;
    return array;
  };
  const [applicant_details, setApplicantDetails] = useState(
    init_application_details()
  );
  
  useEffect(() => {
    if (previous_info) {
      if(previous_info.branch_code) applicant_details[7] = previous_info.branch_code;
      if(previous_info.year) applicant_details[8] = previous_info.year;
      if(previous_info.gate_enrollment_number) applicant_details[9] = previous_info.gate_enrollment_number;
      if(previous_info.coap_registeration_number) applicant_details[10] = previous_info.coap_registeration_number;
      if(previous_info.all_india_rank) applicant_details[11] = previous_info.all_india_rank;
      if(previous_info.gate_score) applicant_details[12] = previous_info.gate_score;
      if(previous_info.valid_upto[13])applicant_details[13] = previous_info.valid_upto;
      if(previous_info.remarks) applicant_details[15] = previous_info.remarks;
      if(previous_info.is_sponsored_applicant) applicant_details[21] = previous_info.is_sponsored_applicant;
      if(previous_info.name_of_sponsoring_org) applicant_details[22] = previous_info.name_of_sponsoring_org;
      if(previous_info.name_of_working_org) applicant_details[23] = previous_info.name_of_working_org;
      if(previous_info.address_of_org) applicant_details[24] = previous_info.address_of_org;
      if(previous_info.designation) applicant_details[25] = previous_info.designation;
      if(previous_info.post_type) applicant_details[26] = previous_info.post_type;
      if(previous_info.duration_post_start) applicant_details[27] = previous_info.duration_post_start;
      if(previous_info.duration_post_end) applicant_details[28] = previous_info.duration_post_end;
      if(previous_info.years_of_service) applicant_details[29] = previous_info.years_of_service;
      if(previous_info.amount) applicant_details[1] = previous_info.amount
      if(previous_info.transaction_id) applicant_details[2] = previous_info.transaction_id
      if(previous_info.bank) applicant_details[3] = previous_info.bank
      if(previous_info.date_of_transaction) applicant_details[5] = previous_info.date_of_transaction
      if(previous_info.full_name) applicant_details[16] = previous_info.full_name
      if(previous_info.place_of_declaration) applicant_details[18] = previous_info.place_of_declaration
      if(previous_info.date_of_declaration) applicant_details[19] = previous_info.date_of_declaration
    }
  });

  function handleApplicantDetailsChange(e, index) {
    let copy = [...applicant_details];
    copy[index] = e.target.value;
    setApplicantDetails(copy);
  }

  function emptyFileIndex(index) {
    let copy = [...applicant_details];
    copy[index] = "";
    setApplicantDetails(copy);
  }

  const handleFileSubmit = (e, maxSize, index, fileType) => {
    const file = e.target.files[0];
    // ref.current = file;

    if (fileType === 1) {
      if (file.type !== "application/pdf") {
        e.target.value = null;
        alert("File format not followed! Allowed formats: .pdf");
        return;
      }
    } else if (fileType === 2) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "application/pdf"
      ) {
        e.target.value = null;
        alert("File format not followed! Allowed formats: .jpeg, .jpg, .pdf");
        return;
      }
    } else if (fileType === 3) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
        e.target.value = null;
        alert(
          "File format not followed! Allowed formats: .jpeg, .jpg, .png, .gif"
        );
        return;
      }
    }

    if (file.size > maxSize * 1000000) {
      e.target.value = null;
      const error =
        "File size cannot exceed more than " + maxSize.toString() + "MB";
      alert(error);
    } else {
      let copy = [...applicant_details];
      copy[index] = file;
      setApplicantDetails(copy);
    }
  };

  function handleApplicationSubmit() {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("applicant_details", JSON.stringify(applicant_details));
    formData.append("offering_id", params.offering_id);
    formData.append("transaction_slip", applicant_details[4]);
    formData.append("self_attested_copies", applicant_details[14]);
    formData.append("signature", applicant_details[17]);
    formData.append("page", page);
    formData.append("stat", 1);
    Axios.post("/reapply-save-application-info", formData, {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          if (page === 5) navigate("/success");
          else setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }

  function increasePageNumber() {
    setPage(page + 1);
  }

  function decreasePageNumber() {
    setPage(page - 1);
  }

  return (
    <div>
      {isFetching ? (
        <div className="mt-40">
          <img
            className="mx-auto h-[200px] w-[200px]"
            alt="Spinner"
            src={screenSpinner}
          />{" "}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-2">
            <div className="mx-12 mb-12 mt-10 px-12 col-start-1 col-end-12">
              <ChevronDots
                steps={[
                  "Qualifying Exam Details",
                  "Sponsorship Details",
                  "Application Fee Details",
                  "Declaration",
                  "Review",
                ]}
                currentStep={page}
              />
            </div>

            <Link
              to="/my-applications"
              className="col-start-12 col-end-13 justify-center lg:w-12 lg:h-12 w-8 h-8 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm m-3 p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="lg:w-6 lg:h-6 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {
            {
              1: (
                <QualifyingExamDetails
                  decodedData={decodedData}
                  hasFilledHighestGate={hasFilledHighestGate}
                  setHasFilledHighestGate={setHasFilledHighestGate}
                  hasGivenMultipleGates={hasGivenMultipleGates}
                  setHasGivenMultipleGates={setHasGivenMultipleGates}
                  offering={offering}
                  increasePageNumber={increasePageNumber}
                  details={applicant_details}
                  onChange={handleApplicantDetailsChange}
                  onSubmit={handleApplicationSubmit}
                  handleFileSubmit={handleFileSubmit}
                  emptyFileIndex={emptyFileIndex}
                />
              ),
              2: (
                <SponsorshipDetails
                  decodedData={decodedData}
                  increasePageNumber={increasePageNumber}
                  decreasePageNumber={decreasePageNumber}
                  details={applicant_details}
                  onChange={handleApplicantDetailsChange}
                  onSubmit={handleApplicationSubmit}
                  handleFileSubmit={handleFileSubmit}
                  emptyFileIndex={emptyFileIndex}
                />
              ),
              3: (
                <ApplicationFeeDetails
                  category={category}
                  increasePageNumber={increasePageNumber}
                  decreasePageNumber={decreasePageNumber}
                  details={applicant_details}
                  onChange={handleApplicantDetailsChange}
                  onSubmit={handleApplicationSubmit}
                  handleFileSubmit={handleFileSubmit}
                  emptyFileIndex={emptyFileIndex}
                  categoryFees={categoryFees}
                />
              ),
              4: (
                <Declaration
                  full_name={full_name}
                  increasePageNumber={increasePageNumber}
                  details={applicant_details}
                  decreasePageNumber={decreasePageNumber}
                  onChange={handleApplicantDetailsChange}
                  onSubmit={handleApplicationSubmit}
                  handleFileSubmit={handleFileSubmit}
                  emptyFileIndex={emptyFileIndex}
                />
              ),
              5: (
                <Review
                  offering={offering}
                  decreasePageNumber={decreasePageNumber}
                  details={applicant_details}
                  handleSubmit={handleSubmit}
                  onSubmit={handleApplicationSubmit}
                  isLoading={isLoading}
                />
              ),
            }[page]
          }
        </div>
      )}
    </div>
  );
}

export default ReApplicantionDetails;
