const path = require("path");
const { format } = require("util");
const pool = require("./db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const auth = require("./auth.js");
const fs = require("fs");
var express = require('express');
var app = express();
dotenv.config();

const upDir = path.join(__dirname, 'public');
if (!fs.existsSync(upDir)) {
  fs.mkdirSync(upDir);
  console.log(upDir);
}


const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(uploadDir);
}



/**
 * Update/save applicant communcation info
 */
const save_communication_details = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  await pool.query(
    "UPDATE applicants SET communication_address = $1, communication_city = $2, communication_state = $3, \
                    communication_pincode = $4, permanent_address = $5, permanent_city = $6, permanent_state = $7, \
                    permanent_pincode = $8, mobile_number = $9, alternate_mobile_number = $10 WHERE email_id = $11;",
    [
      info.communication_address,
      info.communication_city,
      info.communication_state,
      info.communication_pincode,
      info.permanent_address,
      info.permanent_city,
      info.permanent_state,
      info.permanent_pincode,
      info.mobile_number,
      info.alternate_mobile_number,
      email,
    ]
  );

  return res.status(200).send("Ok");
};

/**
 * Update/save applicant education details
 */
const save_education_details = async (req, res, next) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  degrees = JSON.parse(info.degrees);

  await pool.query(
    "UPDATE applicants SET degrees = $1, degree_10th = $2, board_10th = $3, percentage_cgpa_format_10th = $4, \
                    percentage_cgpa_value_10th = $5, year_of_passing_10th = $6, remarks_10th = $7, degree_12th = $8, \
                    board_12th = $9, percentage_cgpa_format_12th = $10, percentage_cgpa_value_12th = $11, \
                    year_of_passing_12th = $12, remarks_12th = $13, other_remarks = $14, is_last_degree_completed = $15 WHERE email_id = $16;",
    [
      degrees,
      info.degree_10th,
      info.board_10th,
      info.percentage_cgpa_format_10th,
      info.percentage_cgpa_value_10th,
      info.year_of_passing_10th,
      info.remarks_10th,
      info.degree_12th,
      info.board_12th,
      info.percentage_cgpa_format_12th,
      info.percentage_cgpa_value_12th,
      info.year_of_passing_12th,
      info.remarks_12th,
      info.other_remarks,
      info.is_last_degree_completed,
      email,
    ]
  );

  let promises = [];
  let vals = Object.values(req.files);
  const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions', 'EDUCATION_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }


  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }
          url = format(
            `${process.env.STORAGE_BASE_URL}/MtechAdmissions/EDUCATION_Details/${filename}`
          );

          if (f[0].fieldname === "marksheet_10th_url") {
            await pool.query(
              "UPDATE applicants SET marksheet_10th_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "marksheet_12th_url") {
            await pool.query(
              "UPDATE applicants SET marksheet_12th_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else {
            str = f[0].fieldname;
            first = str.substring(0, str.length - 1);
            lastChar = str.substr(str.length - 1);

            x = parseInt(lastChar) + 1;
            y = first === "upload_marksheet" ? 9 : 10;

            await pool.query(
              "UPDATE applicants SET degrees[$1][$2] = $3 WHERE email_id = $4;",
              [x, y, url, email]
            );
          }
          resolve();

        });
      })
    );
  }
  Promise.allSettled(promises).then(res.status(200).send("Ok"));
};

const save_experience_details = async (req, res, next) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  degrees2 = JSON.parse(info.degrees2);

  await pool.query(
    "UPDATE applicants SET degrees2 = $1, other_remarks2 = $2, is_last_job_completed = $3 WHERE email_id = $4;",
    [
      degrees2,
      info.other_remarks2,
      info.is_last_job_completed,
      email,
    ]
  );

  let promises = [];
  let vals = Object.values(req.files);
  const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions', 'EXPERIENCE_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }


  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }
          url = format(
            `${process.env.STORAGE_BASE_URL}/MtechAdmissions/EXPERIENCE_Details/${filename}`
          );

          str = f[0].fieldname;
          first = str.substring(0, str.length - 1);
          lastChar = str.substr(str.length - 1);

          x = parseInt(lastChar) + 1;
          y = first === "upload_certificate" ? 9 : 10;

          await pool.query(
            "UPDATE applicants SET degrees2[$1][$2] = $3 WHERE email_id = $4;",
            [x, y, url, email]
          );
          resolve();

        });
      })
    );
  }
  Promise.allSettled(promises).then(res.status(200).send("Ok"));
};

/**
 * Update/save applicant personal info
 */
const save_personal_info = async (req, res, next) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  await pool.query(
    "UPDATE applicants SET full_name = $1,guardian = $2, fathers_name = $3, \
                  date_of_birth = $4, aadhar_card_number = $5, category = $6, is_pwd = $7,pwd_type=$8, marital_status = $9, \
                  nationality = $10, gender = $11, status_student = $12 WHERE email_id = $13;",
    [
      info.full_name,
      info.guardian,
      info.fathers_name,
      info.date_of_birth,
      info.aadhar_card_number,
      info.category,
      info.is_pwd,
      info.pwd_type,
      info.marital_status,
      info.nationality,
      info.gender,
      info.status,
      email,
    ]
  );

  let promises = [];
  let vals = Object.values(req.files);

  const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions', 'PERSONAL_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }

          url = format(
            `${process.env.STORAGE_BASE_URL}/MtechAdmissions/PERSONAL_Details/${filename}`

          );

          if (f[0].fieldname === "category_certificate") {
            await pool.query(
              "UPDATE applicants SET category_certificate_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "pwd_certificate") {
            await pool.query(
              "UPDATE applicants SET pwd_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else {
            await pool.query(
              "UPDATE applicants SET profile_image_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          }

          resolve();

        });
      })
    );
  }

  Promise.allSettled(promises).then(
    res.status(200).send("Ok") /** Confirm, rerender */
  );
};


/**
 * Get applicant profile info
 */
const get_profile_info = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  const results = await pool.query(
    "SELECT full_name,guardian, fathers_name, profile_image_url, date_of_birth, aadhar_card_number, \
                              category, is_pwd,pwd_type ,marital_status, category_certificate_url,pwd_url, nationality, gender, status_student, communication_address, communication_city, \
                              communication_state, communication_pincode, permanent_address, permanent_city, permanent_state, \
                              permanent_pincode, mobile_number, alternate_mobile_number, email_id, degree_10th, board_10th, percentage_cgpa_format_10th,percentage_cgpa_value_10th, \
                              year_of_passing_10th, remarks_10th, marksheet_10th_url, degree_12th, board_12th, percentage_cgpa_format_12th, percentage_cgpa_value_12th, \
                              year_of_passing_12th, remarks_12th, marksheet_12th_url, degrees, degrees2, other_remarks, other_remarks2, is_last_degree_completed, is_last_job_completed, status_student from applicants \
                              WHERE email_id = $1;",
    [email]
  );

  return res.send(results.rows[0]);
};

/**
 * Get applicant personal info for apply page
 */
const check_applicant_info = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  /** Check if profile data is filled */
  const profile_full_check = await pool.query(
    "SELECT full_name, mobile_number, degree_10th from applicants WHERE email_id = $1;",
    [email]
  );
  let profile_full_check_data = profile_full_check.rows[0];

  if (
    profile_full_check_data.full_name === null ||
    profile_full_check_data.mobile_number === null ||
    profile_full_check_data.degree_10th === null
  ) {
    return res.send("2"); /** Profile not complete */
  }

  let offering_id = req.headers.offering_id;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_offerings_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["mtech_offerings_" + cycle_id]
  );
  let offering_table_exists = check_offerings_table.rows[0].exists;

  if (offering_table_exists === false) {
    return res.send("2"); /** No offerings yet */
  }

  /** Check related to the existence of offering */
  const offering_exists_check = await pool.query(
    "SELECT * from mtech_offerings_" + cycle_id + " WHERE offering_id = $1;",
    [offering_id]
  );
  let offering_exists_check_data = offering_exists_check.rows;

  if (offering_exists_check_data.length === 0) {
    return res.send("2"); /** No such offering */
  }

  /** If draft */
  if (offering_exists_check_data[0].is_draft_mode === true) {
    return res.send("2");
  }

  /** If not accepting applications */
  if (offering_exists_check_data[0].is_accepting_applications === false) {
    return res.send("2");
  }

  /** Check if already applied */
  const application_filled_check = await pool.query(
    "SELECT application_id from applications_" +
    cycle_id +
    " WHERE offering_id = $1 AND email_id = $2;",
    [offering_id, email]
  );
  let application_filled_check_data = application_filled_check.rows;

  if (application_filled_check_data.length !== 0) {
    return res.send("3"); /** Already applied */
  }

  const results = await pool.query(
    "SELECT full_name, category, is_pwd from applicants WHERE email_id = $1;",
    [email]
  );

  let category_fees;
  if (results.rows[0].is_pwd === "YES") {
    let temp = await pool.query(
      "SELECT fees_pwd FROM admission_cycles WHERE cycle_id = $1",
      [cycle_id]
    );
    category_fees = temp.rows[0]["fees_pwd"];
  } else {
    let temp = await pool.query(
      "SELECT fees_" +
      results.rows[0].category.toLowerCase() +
      " FROM admission_cycles WHERE cycle_id = $1",
      [cycle_id]
    );
    category_fees =
      temp.rows[0]["fees_" + results.rows[0].category.toLowerCase()];
  }

  return res.send({
    full_name: results.rows[0].full_name,
    category: results.rows[0].category,
    category_fees: category_fees,
  });
};

/**
 * Save application info
 */
const save_application_info = async (req, res, next) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  var info = req.body;

  app_details = JSON.parse(info.applicant_details);
  page = JSON.parse(info.page)
  stat = JSON.parse(info.stat)
  let status_application = 0;
  if(page === 5) status_application = 1;
  let app_save_result;
  if(page === 1 && !stat){
    app_save_result = await pool.query(
      "INSERT INTO applications_" +
      cycle_id +
      "(email_id, amount, transaction_id, bank, date_of_transaction, qualifying_examination, \
                      branch_code, year, gate_enrollment_number, coap_registeration_number, all_india_rank, gate_score, valid_upto, \
                      remarks, date_of_declaration, place_of_declaration, offering_id, status, status_remark,is_sponsored_applicant, name_of_sponsoring_org, name_of_working_org , address_of_org,\
                      designation, post_type, duration_post_start, duration_post_end, years_of_service) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
                      $13, $14, $15, $16, $17, 0, '',$18,$19,$20,$21,$22,$23,$24,$25,$26) RETURNING application_id;",
      [
        email,
        app_details[1],
        app_details[2],
        app_details[3],
        app_details[5],
        app_details[6],
        app_details[7],
        app_details[8],
        app_details[9],
        app_details[10],
        app_details[11],
        app_details[12],
        app_details[13],
        app_details[15],
        app_details[19],
        app_details[18],
        app_details[20],
        app_details[21],
        app_details[22],
        app_details[23],
        app_details[24],
        app_details[25],
        app_details[26],
        app_details[27],
        app_details[28],
        app_details[29],
      ]
    );
  }
  else{
    app_save_result = await pool.query(
      "UPDATE applications_" +
      cycle_id +
      " SET email_id = $1, amount = $2, transaction_id = $3, bank = $4, date_of_transaction = $5, qualifying_examination = $6, \
      branch_code = $7, year = $8, gate_enrollment_number = $9, coap_registeration_number = $10, all_india_rank = $11, gate_score = $12, valid_upto = $13, \
      remarks = $14, date_of_declaration = $15, place_of_declaration = $16, offering_id = $17, is_sponsored_applicant = $18, name_of_sponsoring_org = $19, name_of_working_org = $20, address_of_org = $21, \
      designation = $22, post_type = $23, duration_post_start = $24, duration_post_end = $25, years_of_service = $26, status=$27 WHERE applications_" +
      cycle_id +
      ".email_id = $1 AND applications_" +
      cycle_id +
      ".offering_id = $17;",
      [
        email,
        app_details[1],
        app_details[2],
        app_details[3],
        app_details[5],
        app_details[6],
        app_details[7],
        app_details[8],
        app_details[9],
        app_details[10],
        app_details[11],
        app_details[12],
        app_details[13],
        app_details[15],
        app_details[19],
        app_details[18],
        app_details[20],
        app_details[21],
        app_details[22],
        app_details[23],
        app_details[24],
        app_details[25],
        app_details[26],
        app_details[27],
        app_details[28],
        app_details[29],
        status_application
      ]
    );
  }

  await pool.query(
    "UPDATE applications_" +
    cycle_id +
    " SET \
    full_name = a.full_name,guardian=a.guardian, fathers_name = a.fathers_name, profile_image_url = a.profile_image_url, \
    date_of_birth = a.date_of_birth, aadhar_card_number = a.aadhar_card_number, category = a.category, \
    category_certificate_url = a.category_certificate_url, is_pwd = a.is_pwd,pwd_type=a.pwd_type,pwd_url=a.pwd_url, marital_status = a.marital_status, \
    nationality = a.nationality, gender = a.gender, status_student = a.status_student, \
    communication_address = a.communication_address, communication_city = a.communication_city, \
    communication_state = a.communication_state, communication_pincode = a.communication_pincode, \
    permanent_address = a.permanent_address, permanent_city = a.permanent_state, \
    permanent_state = a.permanent_city, permanent_pincode = a.permanent_pincode, \
    mobile_number = a.mobile_number, alternate_mobile_number = a.alternate_mobile_number, \
    degree_10th = a.degree_10th, board_10th = a.board_10th, percentage_cgpa_format_10th = a.percentage_cgpa_format_10th, \
    percentage_cgpa_value_10th = a.percentage_cgpa_value_10th, year_of_passing_10th = a.year_of_passing_10th, \
    remarks_10th = a.remarks_10th, marksheet_10th_url = a.marksheet_10th_url, \
    degree_12th = a.degree_12th, board_12th = a.board_12th, percentage_cgpa_format_12th = a.percentage_cgpa_format_12th, \
    percentage_cgpa_value_12th = a.percentage_cgpa_value_12th, year_of_passing_12th = a.year_of_passing_12th, \
    remarks_12th = a.remarks_12th, marksheet_12th_url = a.marksheet_12th_url,  degrees = a.degrees, degrees2 = a.degrees2, \
    other_remarks = a.other_remarks, other_remarks2 = a.other_remarks2, is_last_degree_completed = a.is_last_degree_completed, is_last_job_completed = a.is_last_job_completed \
    FROM applicants as a WHERE a.email_id = $1 AND applications_" +
    cycle_id +
    ".email_id = a.email_id AND applications_" +
    cycle_id +
    ".offering_id = $2;",
    [email, app_details[20]]
  );
  let promises = [];
  let vals = Object.values(req.files);

  const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions', 'APPLICATION_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }
          url = format(
            `${process.env.STORAGE_BASE_URL}/MtechAdmissions/APPLICATION_Details/${filename}`

          );
          if (f[0].fieldname === "transaction_slip") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET transaction_slip_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "self_attested_copies") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET self_attested_copies_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "signature") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET signature_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          }

          resolve();

        });
      })
    );
  }

  // app_details[20] is offering_id
  /** Get offering_details */
  const offering_details = await pool.query(
    "SELECT department, specialization FROM mtech_offerings_" +
    cycle_id +
    " WHERE offering_id = $1",
    [app_details[20]]
  );
  let dep = offering_details.rows[0].department;
  let spec = offering_details.rows[0].specialization;

  /** Get application ID */
  let app_id = await pool.query(
    `SELECT application_id FROM applications_${cycle_id} WHERE email_id = $1 LIMIT 1`,
    [email]
  );
  /** Email application submission */
  if(page === 5) auth.application_submission(email, app_id, dep, spec);

  Promise.allSettled(promises).then(res.status(200).send("Ok"));
};

/**
 * Get open positions
 */
const get_open_positions = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  var email = jwt.decode(authToken).userEmail;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_offerings_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["mtech_offerings_" + cycle_id]
  );

  let offering_table_exists = check_offerings_table.rows[0].exists;

  if (offering_table_exists === false) {
    return res.send([]);
  }

  const results = await pool.query(
    "SELECT * FROM mtech_offerings_" +
    cycle_id +
    " WHERE is_draft_mode = FALSE;"
  );

  return res.send(results.rows);
};

/**
 * Get user info for navbar
 */
const get_user_info = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  var email = jwt.decode(authToken).userEmail;

  const results = await pool.query(
    "SELECT full_name, profile_image_url, email_id FROM applicants WHERE email_id = $1;",
    [email]
  );

  return res.send(results.rows[0]);
};

/**
 * Get offering info
 */
const get_offering_info = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  let offering_id = req.headers.offering_id;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_offerings_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["mtech_offerings_" + cycle_id]
  );

  let offering_table_exists = check_offerings_table.rows[0].exists;

  if (offering_table_exists === false) {
    return res.send("1"); /** No offerings yet */
  }

  const results = await pool.query(
    "SELECT * FROM mtech_offerings_" + cycle_id + " WHERE offering_id = $1;",
    [offering_id]
  );

  return res.send(results.rows[0]);
};

/**
 * Get applications of a user
 */
const get_applications = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  var email = jwt.decode(authToken).userEmail;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_applications_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["applications_" + cycle_id]
  );

  let applications_table_exists = check_applications_table.rows[0].exists;

  if (applications_table_exists === false) {
    return res.send([]); /** No offerings yet, therefore, no applications */
  }

  const results = await pool.query(
    "SELECT application_id, " +
    "mtech_offerings_" +
    cycle_id +
    ".offering_id, deadline,  department, specialization, status, status_remark, is_result_published, is_accepting_applications, status_student FROM applications_" +
    cycle_id +
    ", mtech_offerings_" +
    cycle_id +
    " WHERE email_id = $1 AND applications_" +
    cycle_id +
    ".offering_id = mtech_offerings_" +
    cycle_id +
    ".offering_id;",
    [email]
  );

  return res.send(results.rows);
};

/**
 * Get info for a particular application
 */
const get_application_info = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  var application_id = req.headers.application_id;
  var email = jwt.decode(authToken).userEmail;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_applications_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["applications_" + cycle_id]
  );
  let applications_table_exists = check_applications_table.rows[0].exists;

  if (applications_table_exists === false) {
    return res.send("1"); /** No offerings yet, therefore, no applications */
  }

  const query_result = await pool.query(
    "SELECT email_id FROM applications_" +
    cycle_id +
    " WHERE application_id = $1;",
    [application_id]
  );

  if (query_result.rows.length === 0) {
    return res.send("1");
  }

  email_corresponding_to_application = query_result.rows[0].email_id;

  if (email_corresponding_to_application !== email) {
    return res.send("1");
  }

  const results = await pool.query(
    "SELECT * FROM applications_" +
    cycle_id +
    ", mtech_offerings_" +
    cycle_id +
    " WHERE applications_" +
    cycle_id +
    ".offering_id = mtech_offerings_" +
    cycle_id +
    ".offering_id AND applications_" +
    cycle_id +
    ".application_id = $1;",
    [application_id]
  );

  return res.send(results.rows[0]);
};

/** Reapply application */
const reapply_save_application_info = async (req, res, next) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  var info = req.body;

  /*Delete application using Email ID and Offering ID*/
  // const results = await pool.query(
  //   "DELETE from applications_" +
  //   cycle_id +
  //   " WHERE email_id = $1 AND offering_id = $2",
  //   [email, info.offering_id]
  // );

  app_details = JSON.parse(info.applicant_details);
  page = JSON.parse(info.page)
  stat = JSON.parse(info.stat)
  let status_application = 0;
  if(page === 5) status_application = 1;

  app_save_result = await pool.query(
    "UPDATE applications_" +
    cycle_id +
    " SET email_id = $1, amount = $2, transaction_id = $3, bank = $4, date_of_transaction = $5, qualifying_examination = $6, \
    branch_code = $7, year = $8, gate_enrollment_number = $9, coap_registeration_number = $10, all_india_rank = $11, gate_score = $12, valid_upto = $13, \
    remarks = $14, date_of_declaration = $15, place_of_declaration = $16, offering_id = $17, is_sponsored_applicant = $18, name_of_sponsoring_org = $19, name_of_working_org = $20, address_of_org = $21, \
    designation = $22, post_type = $23, duration_post_start = $24, duration_post_end = $25, years_of_service = $26, status=$27 WHERE applications_" +
    cycle_id +
    ".email_id = $1 AND applications_" +
    cycle_id +
    ".offering_id = $17;",
    [
      email,
      app_details[1],
      app_details[2],
      app_details[3],
      app_details[5],
      app_details[6],
      app_details[7],
      app_details[8],
      app_details[9],
      app_details[10],
      app_details[11],
      app_details[12],
      app_details[13],
      app_details[15],
      app_details[19],
      app_details[18],
      app_details[20],
      app_details[21],
      app_details[22],
      app_details[23],
      app_details[24],
      app_details[25],
      app_details[26],
      app_details[27],
      app_details[28],
      app_details[29],
      status_application
    ]
  );

  await pool.query(
    "UPDATE applications_" +
    cycle_id +
    " SET \
  full_name = a.full_name,guardian=a.guardian, fathers_name = a.fathers_name, profile_image_url = a.profile_image_url, \
  date_of_birth = a.date_of_birth, aadhar_card_number = a.aadhar_card_number, category = a.category, \
  category_certificate_url = a.category_certificate_url, is_pwd = a.is_pwd,pwd_type=a.pwd_type,pwd_url=a.pwd_url, marital_status = a.marital_status, \
  nationality = a.nationality, gender = a.gender, status_student = a.status_student, \
  communication_address = a.communication_address, communication_city = a.communication_city, \
  communication_state = a.communication_state, communication_pincode = a.communication_pincode, \
  permanent_address = a.permanent_address, permanent_city = a.permanent_state, \
  permanent_state = a.permanent_city, permanent_pincode = a.permanent_pincode, \
  mobile_number = a.mobile_number, alternate_mobile_number = a.alternate_mobile_number, \
  degree_10th = a.degree_10th, board_10th = a.board_10th, percentage_cgpa_format_10th = a.percentage_cgpa_format_10th, \
  percentage_cgpa_value_10th = a.percentage_cgpa_value_10th, year_of_passing_10th = a.year_of_passing_10th, \
  remarks_10th = a.remarks_10th, marksheet_10th_url = a.marksheet_10th_url, \
  degree_12th = a.degree_12th, board_12th = a.board_12th, percentage_cgpa_format_12th = a.percentage_cgpa_format_12th, \
  percentage_cgpa_value_12th = a.percentage_cgpa_value_12th, year_of_passing_12th = a.year_of_passing_12th, \
  remarks_12th = a.remarks_12th, marksheet_12th_url = a.marksheet_12th_url,  degrees = a.degrees, \
  other_remarks = a.other_remarks, is_last_degree_completed = a.is_last_degree_completed \
  FROM applicants as a WHERE a.email_id = $1 AND applications_" +
    cycle_id +
    ".email_id = a.email_id AND applications_" +
    cycle_id +
    ".offering_id = $2;",
    [email, app_details[20]]
  );

  let promises = [];
  let vals = Object.values(req.files);
  const uploadDir = path.join(__dirname, 'public', 'MtechAdmissions', 'REAPPLY_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }
          url = format(
            `${process.env.STORAGE_BASE_URL}/MtechAdmissions/REAPPLY_Details/${filename}`

          );
          if (f[0].fieldname === "transaction_slip") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET transaction_slip_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "self_attested_copies") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET self_attested_copies_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          } else if (f[0].fieldname === "signature") {
            await pool.query(
              "UPDATE applications_" +
              cycle_id +
              " SET signature_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          }

            resolve();
        });
      })
    );
  }

  // app_details[20] is offering_id
  /** Get offering_details */
  const offering_details = await pool.query(
    "SELECT department, specialization FROM mtech_offerings_" +
    cycle_id +
    " WHERE offering_id = $1",
    [app_details[20]]
  );
  let dep = offering_details.rows[0].department;
  let spec = offering_details.rows[0].specialization;

  /** Get application ID */
  let app_id = await pool.query(
    `SELECT application_id FROM applications_${cycle_id} WHERE email_id = $1 LIMIT 1`,
    [email]
  );
  /** Email application submission */
  if(page === 5) auth.application_submission(email, app_id, dep, spec);

  Promise.allSettled(promises).then(res.status(200).send("Ok"));
};

/**
 * Get applicant personal info for apply page
 */
const reapply_check_applicant_info = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  /** Check if profile data is filled */
  const profile_full_check = await pool.query(
    "SELECT full_name, mobile_number, degree_10th from applicants WHERE email_id = $1;",
    [email]
  );
  let profile_full_check_data = profile_full_check.rows[0];

  if (
    profile_full_check_data.full_name === null ||
    profile_full_check_data.mobile_number === null ||
    profile_full_check_data.degree_10th === null
  ) {
    return res.send("2"); /** Profile not complete */
  }

  let offering_id = req.headers.offering_id;

  const cycle = await pool.query("SELECT cycle_id from current_cycle;");
  let cycle_id = cycle.rows[0].cycle_id;

  const check_offerings_table = await pool.query(
    "SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = $1);",
    ["mtech_offerings_" + cycle_id]
  );
  let offering_table_exists = check_offerings_table.rows[0].exists;

  if (offering_table_exists === false) {
    return res.send("2"); /** No offerings yet */
  }

  /** Check related to the existence of offering */
  const offering_exists_check = await pool.query(
    "SELECT * from mtech_offerings_" + cycle_id + " WHERE offering_id = $1;",
    [offering_id]
  );
  let offering_exists_check_data = offering_exists_check.rows;

  if (offering_exists_check_data.length === 0) {
    return res.send("2"); /** No such offering */
  }

  /** If draft */
  if (offering_exists_check_data[0].is_draft_mode === true) {
    return res.send("2");
  }

  /** If not accepting applications */
  if (offering_exists_check_data[0].is_accepting_applications === false) {
    return res.send("2");
  }

  /** Check if already not applied */
  const application_filled_check = await pool.query(
    "SELECT application_id from applications_" +
    cycle_id +
    " WHERE offering_id = $1 AND email_id = $2;",
    [offering_id, email]
  );

  const previous_info = await pool.query(
    "SELECT * from applications_" +
    cycle_id +
    " WHERE offering_id = $1 AND email_id = $2;",
    [offering_id, email]
  );

  let application_filled_check_data = application_filled_check.rows;

  if (application_filled_check_data.length === 0) {
    return res.send("3"); /** Already not applied */
  }

  const results = await pool.query(
    "SELECT full_name, category, is_pwd from applicants WHERE email_id = $1;",
    [email]
  );

  let category_fees;
  if (results.rows[0].is_pwd === "YES") {
    let temp = await pool.query(
      "SELECT fees_pwd FROM admission_cycles WHERE cycle_id = $1",
      [cycle_id]
    );
    category_fees = temp.rows[0]["fees_pwd"];
  } else {
    let temp = await pool.query(
      "SELECT fees_" +
      results.rows[0].category.toLowerCase() +
      " FROM admission_cycles WHERE cycle_id = $1",
      [cycle_id]
    );
    category_fees =
      temp.rows[0]["fees_" + results.rows[0].category.toLowerCase()];
  }

  return res.send({
    previous_info : previous_info,
    full_name: results.rows[0].full_name,
    category: results.rows[0].category,
    category_fees: category_fees,
  });
};

module.exports = {
  save_personal_info,
  save_communication_details,
  save_education_details,
  save_experience_details,
  get_profile_info,
  check_applicant_info,
  save_application_info,
  get_open_positions,
  get_user_info,
  get_offering_info,
  get_applications,
  get_application_info,
  reapply_save_application_info,
  reapply_check_applicant_info,
};
