import React, { useState } from "react";
import crossPic from "../../images/red_cross.svg";

function SponsorshipDetails(props) {
    if (props.decodedData.status_student === "sponsored") {
        props.details[21] = "YES";
    }
    else { props.details[21] = "NO"; }

    return (
        <div>
            <div className="px-8 py-8 md:px-20 md:py-20 mx-auto my-10 md:my-20 bg-[#f3f4f6] rounded-2xl">
                <div className="mt-10 sm:mt-0">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="ml-5 mb-2 text-left text-2xl font-medium leading-6 text-gray-900">
                                    Sponsoring Organisation Detail (only for sponsored candidates)(not for IIT graduate):
                                </h3>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form method="POST" onSubmit={() => props.increasePageNumber()}>
                                <div className="shadow overflow-hidden sm:rounded-md">
                                    <div className="px-4 py-5 bg-white sm:p-6">
                                        {props.details[21] === 'YES' ? (
                                            <>
                                                <div className="col-span-3 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Name of the Sponsoring Organisation: (only for sponsored candidates) (not for IIT graduate):
                                                        <span style={{ color: "#ff0000" }}> *</span>
                                                    </label>
                                                    <select
                                                        id="name_of_sponsoring_org"
                                                        name="name_of_sponsoring_org"
                                                        value={props.details[22]}
                                                        onChange={(event) =>
                                                            props.onChange(event, 22)
                                                        }
                                                        required
                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="">None</option>
                                                        <option value="DRDO & Armed forces">DRDO & Armed forces</option>
                                                        <option value="Central Water Commission (CWC)">Central Water Commission (CWC)</option>
                                                        <option value="Central Water and Power Research Station (CWPRS)">Central Water and Power Research Station (CWPRS)</option>
                                                        <option value="Indian Space Research Organisation (ISRO)">Indian Space Research Organisation (ISRO)</option>
                                                        <option value="National Institute of Hydrology (NIH)">National Institute of Hydrology (NIH)</option>
                                                        <option value="Central Ground Water Board (CGWB)">Central Ground Water Board (CGWB)</option>
                                                        <option value="National Water Development Agency (NWDA)">National Water Development Agency (NWDA)</option>
                                                        <option value="Others">Others.</option>
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )}


                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="block text-ml mt-5 font-bold pb-4 text-gray-700">
                                                Details of Employment (non-mandatory for IIT graduate):
                                                <span style={{ color: "#ff0000" }}> *</span>
                                            </label>
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Name of the Organisation in which presently working.
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name_of_working_org"
                                                        value={props.details[23]}
                                                        id="name_of_working_org"
                                                        onChange={(event) =>
                                                            props.onChange(event, 23)
                                                        }
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>

                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Full Address of the organization presently working:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address_of_org"
                                                        value={props.details[24]}
                                                        id="address_of_org"
                                                        onChange={(event) =>
                                                            props.onChange(event, 24)
                                                        }
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Designation:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="designation"
                                                        value={props.details[25]}
                                                        id="designation"
                                                        onChange={(event) =>
                                                            props.onChange(event, 25)
                                                        }
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Whether on regular/ temporary post:
                                                    </label>
                                                    <select
                                                        id="post_type"
                                                        name="post_type"
                                                        value={props.details[26]}
                                                        onChange={(event) => props.onChange(event, 26)}
                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Regular">Regular</option>
                                                        <option value="Temporary">Temporary</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="duration_post_start"
                                                        name="duration_post_start"
                                                        value={props.details[27]}
                                                        className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        onChange={(e) => props.onChange(e, 27)}
                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="duration_post_end"
                                                        name="duration_post_end"
                                                        value={props.details[28]}
                                                        className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                        onChange={(e) => props.onChange(e, 28)}
                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Total years of service:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="years_of_service"
                                                        value={props.details[29]}
                                                        id="years_of_service"
                                                        onChange={(event) =>
                                                            props.onChange(event, 29)
                                                        }
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="my-4 flex flex-wrap justify-between items-center">                    <button
                                            type="button"
                                            onClick={() => props.decreasePageNumber()}
                                            className="border border-transparent shadow-sm text-sm font-medium rounded-md text-white justify-center block py-2 px-4 mr-2 mb-2 sm:mb-0 sm:mr-4 items-center bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            style={{ width: "120px", height: "40px" }}                  >
                                            Back
                                        </button>

                                            <button
                                                type="submit"
                                                onClick={() => props.onSubmit()}
                                                className="border border-transparent shadow-sm text-sm font-medium rounded-md text-white justify-center block py-2 px-4 items-center bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                style={{ width: "120px", height: "40px" }}                    >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SponsorshipDetails;
