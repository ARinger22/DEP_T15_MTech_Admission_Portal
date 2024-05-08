import React from "react";
import crossPic from "../../images/red_cross.svg";

export default function CollageExperienceDetails(props) {
  return (
    <div className="col-span-full sm:col-span-full">
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-full sm:col-span-full">
          {props.id === 0 ? (
            <>
              <span className="italic">
                This is the primary{" "}
                <span className="font-semibold">
                  Experience Details Section
                </span>
                . Information provided here will be used to validate the{" "}
                <span className="font-semibold">eligibility</span> of the
                candidate.
              </span>
              <br />
              <br />
              <span className="italic">
                One can add or remove{" "}
                <span className="font-semibold">non-primary</span> Experience
                Details Section(s) using the{" "}
                <span className="font-semibold">Add Section</span> and{" "}
                <span className="font-semibold">Remove Section</span> buttons.
              </span>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="Company"
            className="block text-sm font-medium text-gray-700"
          >
            Company/Organization<span style={{ color: "#ff0000" }}> *</span>
          </label>
          <input
            type="text"
            name="Company"
            id="Company"
            value={props.localDegrees[props.id]["0"]}
            onChange={(event) => props.handleChange(props.id, "0", event)}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title/Position<span style={{ color: "#ff0000" }}> *</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={props.localDegrees[props.id]["1"]}
            onChange={(event) => props.handleChange(props.id, "1", event)}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="year-of-completion"
            className="block text-sm font-medium text-gray-700"
          >
            Completion Time (MM/YYYY - MM/YYYY or MM/YYYY)
            <span style={{ color: "#ff0000" }}> *</span>
          </label>
          <input
            type="text"
            name="year-of-completion"
            pattern="((0[1-9]|1[0-2])\/[1-9]{1}[0-9]{3})\s-\s((0[1-9]|1[0-2])\/[1-9]{1}[0-9]{3})|(0[1-9]|1[0-2])\/[1-9]{1}[0-9]{3}"
            title="4 Digit Year (Example: 2020)"
            id="year-of-completion"
            value={props.localDegrees[props.id]["2"]}
            required
            onChange={(event) => props.handleChange(props.id, "2", event)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="col-span-full sm:col-span-full">
          <label
            htmlFor="remarks2"
            className="block text-sm font-medium text-gray-700"
          >
            Remarks (if any)
          </label>
          <div className="mt-1">
            <textarea
              id="remarks2"
              name="remarks2"
              value={props.localDegrees[props.id]["3"]}
              onChange={(event) => props.handleChange(props.id, "3", event)}
              rows={2}
              className="resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="col-span-full sm:col-span-full">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            htmlFor="Certificate"
          >
            Certificate of completion
            <span style={{ color: "#ff0000" }}> *</span>
          </label>

          {!props.localDegrees[props.id]["8"] &&
          !props.degreesFiles[props.id][0] ? (
            <>
              <input
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="marksheet_help"
                id="Certificate"
                type="file"
                accept=".pdf"
                required
                onChange={(e) => props.handleFileSubmit(e, 5, props.id, 0)}
              />
              <div
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="marksheet_help"
              >
                <span className="font-semibold">Maximum file size:</span> 5 MB{" "}
                <span className="font-semibold">Allowed file formats:</span>{" "}
                .pdf
              </div>
              <div
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="profile-picture-desc"
              >
                <span className="font-semibold">
                  Recommended File Name Format:
                </span>
                <span>
                  {" "}
                  Certificate{props.id}_&lt;your_email_id&gt; <br />
                  For Example: Certificate{props.id}_abc@gmail.com
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex border-2 mt-1 w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                <input
                  className="border-none block w-full shadow-sm sm:text-sm"
                  id="profile_picture"
                  name="profile_picture"
                  type="text"
                  value={
                    props.degreesFiles[props.id][0]
                      ? props.degreesFiles[props.id][0].name
                      : props.localDegrees[props.id]["8"].substring(
                          props.localDegrees[props.id]["8"].lastIndexOf("/") +
                            1,
                          props.localDegrees[props.id]["8"].lastIndexOf("_")
                        )
                  }
                  readOnly
                />

                <button
                  type="button"
                  className="flex focus:outline-none items-center ml-2 mr-2 justify-center"
                  onClick={() => {
                    props.emptyFileDegree(8, props.id);
                    props.clearFiles(props.id, 0);
                  }}
                >
                  <img className="w-6 h-6" src={crossPic} alt="Cross"></img>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
