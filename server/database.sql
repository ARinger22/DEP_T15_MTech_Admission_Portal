CREATE TABLE signup_verification (
    email_id TEXT PRIMARY KEY,
    hashed_otp TEXT,
    expiration_time TIMESTAMP
);
CREATE TABLE forgot_password_verification (
    email_id TEXT PRIMARY KEY,
    hashed_otp TEXT,
    expiration_time TIMESTAMP
);
CREATE TABLE login_verification (
    email_id TEXT PRIMARY KEY,
    hashed_otp TEXT,
    expiration_time TIMESTAMP
);

CREATE TABLE applicants (
    -- Primary Keys
    email_id TEXT PRIMARY KEY,
    passwd TEXT,
    applicant_id SERIAL,

    -- Personal Details
    full_name TEXT,
    guardian TEXT,
    fathers_name TEXT,
    profile_image_url TEXT,
    date_of_birth TEXT,
    aadhar_card_number TEXT,
    category TEXT,
    category_certificate_url TEXT,
    is_pwd TEXT,
    pwd_type TEXT,
    pwd_url TEXT,
    marital_status TEXT,
    nationality TEXT,
    gender TEXT,
    status_student TEXT,

    -- Communication Details
    communication_address TEXT,
    communication_city TEXT,
    communication_state TEXT,
    communication_pincode TEXT,

    permanent_address TEXT,
    permanent_city TEXT,
    permanent_state TEXT,
    permanent_pincode TEXT,

    mobile_number TEXT,
    alternate_mobile_number TEXT,

    -- Educational Details
    degree_10th TEXT,
    board_10th TEXT,
    percentage_cgpa_format_10th TEXT,
    percentage_cgpa_value_10th TEXT,
    year_of_passing_10th TEXT,
    remarks_10th TEXT,
    marksheet_10th_url TEXT,

    degree_12th TEXT,
    board_12th TEXT,
    percentage_cgpa_format_12th TEXT,
    percentage_cgpa_value_12th TEXT,
    year_of_passing_12th TEXT,
    remarks_12th TEXT,
    marksheet_12th_url TEXT,

    degrees TEXT[][],
    degrees2 TEXT[][],
    other_remarks TEXT,
    other_remarks2 TEXT,
    is_last_degree_completed TEXT,
    is_last_job_completed TEXT
);

CREATE TABLE admins(
  name TEXT, 
  passwd TEXT,
  email_id TEXT PRIMARY KEY,
  admin_type INT NOT NULL,
  department TEXT[]
);
-- 0 for super-admin, 1 for faculty-admins, 2 for applicant, 3 for Staff

CREATE OR REPLACE FUNCTION insert_into_login_verification()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    INSERT INTO login_verification(email_id) VALUES(new.email_id);
	RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_insert_into_admins
  AFTER INSERT
  ON admins
  FOR EACH ROW
  EXECUTE PROCEDURE insert_into_login_verification();

CREATE TRIGGER trigger_insert_into_applicants
  AFTER INSERT
  ON applicants
  FOR EACH ROW
  EXECUTE PROCEDURE insert_into_login_verification();

CREATE TABLE current_cycle(
  cycle_id INT PRIMARY KEY NOT NULL
);

CREATE TABLE admission_cycles(
  cycle_id SERIAL PRIMARY KEY,
  NAME TEXT,
  duration_start TEXT,
  duration_end TEXT,
  fees_gen TEXT,
  fees_ews TEXT,
  fees_obc TEXT,
  fees_sc TEXT,
  fees_st TEXT,
  fees_pwd TEXT,
  brochure_url TEXT,
  rank_list_url TEXT
);

CREATE TABLE deleted_admission_cycles(
  cycle_id INT PRIMARY KEY,
  NAME TEXT,
  duration_start TEXT,
  duration_end TEXT,
  fees_gen TEXT,
  fees_ews TEXT,
  fees_obc TEXT,
  fees_sc TEXT,
  fees_st TEXT,
  fees_pwd TEXT,
  brochure_url TEXT,
  rank_list_url TEXT
);

CREATE OR REPLACE FUNCTION insert_into_deleted_admission_cycles()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  INSERT INTO deleted_admission_cycles VALUES(OLD.cycle_id, OLD.NAME, OLD.duration_start, OLD.duration_end, OLD.fees_gen, OLD.fees_ews, OLD.fees_obc, OLD.fees_sc, OLD.fees_st, OLD.fees_pwd, OLD.brochure_url, OLD.rank_list_url);
  RETURN OLD;
END;
$$;

CREATE TRIGGER trigger_delete_from_admission_cycles
  AFTER DELETE
  ON admission_cycles
  FOR EACH ROW
  EXECUTE PROCEDURE insert_into_deleted_admission_cycles();

-- Type = 'application' || 'offering' || 'admin'
CREATE TABLE templates (
  template_id SERIAL PRIMARY KEY,
  email_id TEXT,
  name TEXT,
  type TEXT,
  column_list TEXT[],
  column_list_compact TEXT[]
);

-- PERMANENT INSERT
INSERT INTO TEMPLATES(email_id,name,type,column_list,column_list_compact) VALUES('default@template', 'Default Applicant List', 'APPLICANT LIST', ARRAY['application_id', 'full_name','guardian', 'fathers_name', 'profile_image_url', 'date_of_birth', 'aadhar_card_number',
'category', 'is_pwd','pwd_type', 'marital_status', 'nationality', 'category_certificate_url','pwd_url','gender','status_student', 'communication_address', 'communication_city',
'communication_state', 'communication_pincode', 'permanent_address', 'permanent_city', 'permanent_state',
'permanent_pincode', 'mobile_number', 'alternate_mobile_number', 'email_id', 'degree_10th', 'board_10th', 'percentage_cgpa_format_10th','percentage_cgpa_value_10th',
'year_of_passing_10th', 'remarks_10th', 'marksheet_10th_url', 'degree_12th', 'board_12th', 'percentage_cgpa_format_12th', 'percentage_cgpa_value_12th',
'year_of_passing_12th', 'remarks_12th', 'marksheet_12th_url', 'degrees', 'degrees2', 'other_remarks', 'other_remarks2', 'is_last_degree_completed', 'is_last_job_completed', 'amount', 'transaction_id', 'bank', 
'date_of_transaction', 'qualifying_examination', 'branch_code', 'year', 'gate_enrollment_number', 'coap_registeration_number', 'all_india_rank', 'gate_score', 'valid_upto','self_attested_copies_url', 'remarks','signature_url',
'date_of_declaration', 'place_of_declaration','is_sponsored_applicant','name_of_sponsoring_org','name_of_working_org','address_of_org','designation','post_type','duration_post_start','duration_post_end','years_of_service'], 
ARRAY['Application ID','Full Name','Father''s Name','Email Address','Profile Image','Date of Birth','Aadhar Card Number','Category','Category Certificate','Belongs to PWD','Marital Status','Nationality','Gender','status_student', 'Communication Address','Permanent Address','Mobile Number','Alternate Mobile Number','Educational Details: 10th',
'Educational Details: 12th','Educational Details: College','Educational Remarks','Last Degree Completion Status','Qualifying Exmaination','Branch Code','GATE Examination Year','GATE Enrollment Number',
'COAP Registration Number','All India Rank','GATE Score','Valid Upto','Self Attested Copies of GATE','Qualifying Exam Remarks','Amount','Transaction ID','Bank','Transaction Slip','Date of Transaction','Signature','Date of Declaration','Place of Declaration','Status','Status Remarks','is_sponsored_applicant','name_of_sponsoring_org','name_of_working_org','address_of_org','designation','post_type','duration_post_start','duration_post_end','years_of_service']);

-- Always executed because admin will only be allowed to update it
INSERT INTO current_cycle(cycle_id) VALUES(0);

-- Do always
INSERT INTO admins(name, email_id,passwd ,admin_type, department) VALUES('Admin', 'mtechadmin@iitrpr.ac.in','root', 0, '{Academics}');
UPDATE admins SET department = ARRAY['Biomedical Engineering', 'Chemical Engineering','Civil Engineering','Computer Science and Engineering','Electrical Engineering','Mechanical Engineering','Chemisty','Humanities and Social Sciences','Metallurgical and Material Engineering','Physics'] WHERE email_id = 'mtechadmin@iitrpr.ac.in';
