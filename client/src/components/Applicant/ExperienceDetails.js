import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Tooltip } from "@mui/material";
import Axios from "axios";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useNavigate } from "react-router-dom";
import spinner from "../../images/SpinnerWhite.gif";
import CollageExperienceDetails from "./CollageExperienceSection.js";
import { PencilIcon } from "@heroicons/react/outline";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "87%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
};

export default function ExperienceDetails(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [degreesFiles, setDegreesFiles] = useState(
    Array.from({ length: 5 }, () => Array.from({ length: 2 }, () => ""))
  );

  const clearFiles = (row, column) => {
    let copy = [...degreesFiles];
    copy[row][column] = null;
    setDegreesFiles(copy);
  };

  function convertJsonObjectArrayTo2dArray(degrees) {
    let result = Array.from({ length: 5 }, () =>
      Array.from({ length: 10 }, () => "")
    );
    for (let i = 0; i < degrees.length; i++) {
      let j = 0;
      for (const key in degrees[i]) {
        if (key === "id") continue;
        result[i][j] = degrees[i][key];
        j++;
      }
    }
    return result;
  }
  const onSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    setIsLoading(true);
    const formData = new FormData();
    formData.append(
      "degrees2",
      JSON.stringify(convertJsonObjectArrayTo2dArray(props.localDegrees))
    );
    formData.append("other_remarks2", props.localProfileInfo.other_remarks2);
    formData.append(
      "is_last_job_completed",
      props.localProfileInfo.is_last_job_completed
    );

    // Append Files
    formData.append("upload_certificate0", degreesFiles[0][0]);
    formData.append("upload_certificate1", degreesFiles[1][0]);
    formData.append("upload_certificate2", degreesFiles[2][0]);
    formData.append("upload_certificate3", degreesFiles[3][0]);
    formData.append("upload_certificate4", degreesFiles[4][0]);

    Axios.post("/save-experience-details", formData, {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFileSubmitCertificate = (e, maxSize, row, column) => {
    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      e.target.value = null;
      alert("File format not followed! Allowed formats: .pdf");
      return;
    }

    if (file.size > maxSize * 1000000) {
      e.target.value = null;
      const error =
        "File size cannot exceed more than " + maxSize.toString() + "MB";
      alert(error);
    } else {
      let copy = [...degreesFiles];
      copy[row][column] = file;
      setDegreesFiles(copy);
    }
  };

  function closeEducationDetails() {
    handleClose();
    let copy = [...degreesFiles];
    for (let i = 0; i < 5; i++) {
      copy[i][0] = null;
      copy[i][1] = null;
    }
    setDegreesFiles(copy);
    props.syncLocalGlobalData();
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Edit Details">
        <button
          type="button"
          onClick={handleOpen}
          className="w-5 text-indigo-600 focus:outline-none"
        >
          <PencilIcon />
        </button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div id="modal-modal-description" className="relative w-full h-full">
            <div className="flex items-start justify-between py-3 px-5 border-b rounded-t">
              <button
                onClick={closeEducationDetails}
                type="button"
                className="text-gray-400 bg-transparent focus:outline-none hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden overscroll-none h-5/6">
              <div className="px-6 py-6 mx-10 bg-[#f3f4f6] ">
                <div className="mt-10 sm:mt-0">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <div className="text">
                        <h3 className="ml-5 mb-2 text-left text-2xl font-medium leading-6 text-gray-900">
                          Experience Details
                        </h3>
                        <p className="ml-5 text-left mt-1 text-gray-600 text-base">
                          Please share your experience details
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form onSubmit={onSubmit}>
                        <div className="shadow overflow-hidden sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                              {[...Array(props.count)].map((_, i) => (
                                <CollageExperienceDetails
                                  key={i}
                                  id={i}
                                  handleChange={props.onChangeDegrees}
                                  handleFileSubmit={handleFileSubmitCertificate}
                                  localDegrees={props.localDegrees}
                                  degreesFiles={degreesFiles}
                                  emptyFileDegree={props.emptyFileDegree}
                                  clearFiles={clearFiles}
                                />
                              ))}

                              <div className="flex mb-4 col-span-4">
                                {props.count === 5 ? (
                                  <div></div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      props.setCount(props.count + 1);
                                    }}
                                    className="border focus:outline-none border-teal-500 text-teal-500 block rounded-sm font-bold py-2 px-4 mr-2 items-center hover:bg-teal-500 hover:text-white"
                                  >
                                    Add Section
                                  </button>
                                )}
                                {props.count === 1 ? (
                                  <div></div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      props.removeLocalDegree(props.count - 1);
                                      props.setCount(props.count - 1);
                                    }}
                                    className="border border-teal-500 focus:outline-none text-teal-500 block rounded-sm font-bold py-2 px-4 mr-2 items-center hover:bg-teal-500 hover:text-white"
                                  >
                                    Remove Section
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="col-span-full sm:col-span-full">
                              <div className="col-span-full sm:col-span-full">
                                <label
                                  htmlFor="other_remarks2"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Any other experience highlights/information
                                </label>
                                <div className="mt-1">
                                  <textarea
                                    id="other_remarks2"
                                    value={props.localProfileInfo.other_remarks2}
                                    onChange={(event) =>
                                      props.onChange(event, "other_remarks2")
                                    }
                                    rows={3}
                                    className="resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  />
                                </div>
                                <p className="mt-2 text-sm text-gray-500"></p>
                              </div>

                              <div className="col-span-full sm:col-span-full">
                                <label
                                  htmlFor="is_last_job_completed"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Whether you have completed your last job:{" "}
                                  <span style={{ color: "#ff0000" }}> *</span>
                                </label>
                                <select
                                  id="is_last_job_completed"
                                  required
                                  value={
                                    props.localProfileInfo
                                      .is_last_job_completed
                                  }
                                  onChange={(event) =>
                                    props.onChange(
                                      event,
                                      "is_last_job_completed"
                                    )
                                  }
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                  <option value="">- Select -</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center mt-4 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
                          {!isLoading ? (
                            <button
                              type="submit"
                              className="text-white focus:outline-none bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              disabled
                              type="submit"
                              className="text-white focus:outline-none bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <img
                                className="h-5 w-5 mx-auto"
                                alt="spinner"
                                src={spinner}
                              />
                            </button>
                          )}
                          <button
                            onClick={closeEducationDetails}
                            type="button"
                            className="text-gray-500 focus:outline-none bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
