-- Create independent tables first
-- Table: Company
CREATE TABLE Company (
    company_id BIGINT PRIMARY KEY,
    company_size SMALLINT,
    description TEXT,
    company_name VARCHAR(255),
    company_url VARCHAR(255)
);

-- Table: Job
CREATE TABLE Job (
    job_id BIGINT PRIMARY KEY,
    job_description TEXT  
);

-- Table: Skill
CREATE TABLE Skill (
    skill_abr VARCHAR(10) PRIMARY KEY,
    skill_name VARCHAR(255),
    category VARCHAR(100)
);

-- Table: Benefit
CREATE TABLE Benefit (
    benefit_id INT PRIMARY KEY,
    inferred VARCHAR(255)
);

-- Table: Benefit Type
CREATE TABLE Benefit_Type (
    benefit_type_id INT PRIMARY KEY,
    type VARCHAR(100)
);

-- Table: Company Industry
CREATE TABLE Company_Industry (
    industry_id INT PRIMARY KEY,
    industry_name VARCHAR(255)
);

-- Now create tables with foreign key dependencies but omit the foreign key constraints
-- Table: Posting
CREATE TABLE Posting (
    posting_id INT PRIMARY KEY,
    title VARCHAR(255),
    posting_description TEXT,
    job_posting_url VARCHAR(255),
    application_type VARCHAR(100),
    skills_description TEXT,
    formatted_worktype VARCHAR(100),
    zip_code VARCHAR(10),
    remote_allowed BIT,
    location VARCHAR(255),
    company_id BIGINT,
    job_id BIGINT
);

-- Table: Posting State
CREATE TABLE Posting_State (
    posting_state_id INT PRIMARY KEY,
    timezone_offset INT,
    original_listed_time TIMESTAMP,
    listed_time DATETIME,
    applies INT,
    views INT,
    expiry DATETIME,
    posting_id INT,
    apply_rate FLOAT,
    remaining_time INT
);

-- Table: Additional Info
CREATE TABLE Additional_Info (
    additional_info_id INT PRIMARY KEY,
    formatted_experience_level VARCHAR(100),
    posting_domain VARCHAR(255),
    application_url VARCHAR(1000),
    close_time TIMESTAMP,
    posting_id INT
);

-- Table: Salary
CREATE TABLE Salary (
    salary_id INT PRIMARY KEY,
    job_id BIGINT,
    currency VARCHAR(10),
    compensation_type VARCHAR(50),
    pay_period VARCHAR(50)
);

-- Table: Salary Type
CREATE TABLE Salary_Type (
    salary_type VARCHAR(10),
    salary_id INT,
    value FLOAT,
    PRIMARY KEY (salary_id, salary_type)
);

-- Table: Requires
CREATE TABLE Requires (
    skill_abr VARCHAR(10),
    job_id BIGINT,
    PRIMARY KEY (skill_abr, job_id)
);

-- Table: Job Benefit
CREATE TABLE Job_Has_Benefit (
    job_id BIGINT,
    benefit_id INT,
    PRIMARY KEY (job_id, benefit_id)
);

-- Table: Benefit Has Benefit Type
CREATE TABLE Benefit_Has_Benefit_Type (
    benefit_id INT,
    benefit_type_id INT,
    PRIMARY KEY (benefit_id, benefit_type_id)
);

-- Table: Job Industry
CREATE TABLE Job_Has_Industry (
    job_id BIGINT,
    industry_id INT,
    PRIMARY KEY (job_id, industry_id)
);

-- Table: Company Industry
CREATE TABLE Company_Has_Industry (
    company_id BIGINT,
    industry_id INT,
    PRIMARY KEY (company_id, industry_id)
);

-- Table: Company Specialties
CREATE TABLE Company_Specialty (
    specialty_id INT PRIMARY KEY,
    specialty VARCHAR(255)
);

-- Table: Company Has Specialty
CREATE TABLE Company_Has_Specialty (
    company_id BIGINT,
    specialty_id INT,
    PRIMARY KEY (company_id, specialty_id)
);

-- Table: Employee Count
CREATE TABLE Employee_Count (
    time_recorded TIMESTAMP,
    company_id BIGINT,
    employee_count INT,
    follower_count INT,
    PRIMARY KEY (time_recorded, company_id)
);

-- Table: Company Location
CREATE TABLE Company_Location (
    location_id INT PRIMARY KEY,
    zipcode VARCHAR(15),
    number VARCHAR(10),
    street VARCHAR(255),
    state VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(150),
    company_id BIGINT
);

-- Table: Address
CREATE TABLE Address (
    address_id INT,
    location_id INT,
    number VARCHAR(10),
    street VARCHAR(255),
    PRIMARY KEY (address_id, location_id)
);
ALTER TABLE Employee_Count ADD employee_count_id INT;