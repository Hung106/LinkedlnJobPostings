-- Add foreign key constraints using ALTER TABLE

-- Posting table
ALTER TABLE Posting
ADD FOREIGN KEY (company_id) REFERENCES Company(company_id),
ADD FOREIGN KEY (job_id) REFERENCES Job(job_id);

-- Posting_State table
ALTER TABLE Posting_State
ADD FOREIGN KEY (posting_id) REFERENCES Posting(posting_id);

-- Additional_Info table
ALTER TABLE Additional_Info
ADD FOREIGN KEY (posting_id) REFERENCES Posting(posting_id);

-- Salary table
ALTER TABLE Salary
ADD FOREIGN KEY (job_id) REFERENCES Job(job_id);

-- Salary_Type table
ALTER TABLE Salary_Type
ADD FOREIGN KEY (salary_id) REFERENCES Salary(salary_id);

-- Requires table
ALTER TABLE Requires
ADD FOREIGN KEY (skill_abr) REFERENCES Skill(skill_abr),
ADD FOREIGN KEY (job_id) REFERENCES Job(job_id);

-- Job_Has_Benefit table
ALTER TABLE Job_Has_Benefit
ADD FOREIGN KEY (job_id) REFERENCES Job(job_id),
ADD FOREIGN KEY (benefit_id) REFERENCES Benefit(benefit_id);

-- Benefit_Has_Benefit_Type table
ALTER TABLE Benefit_Has_Benefit_Type
ADD FOREIGN KEY (benefit_id) REFERENCES Benefit(benefit_id),
ADD FOREIGN KEY (benefit_type_id) REFERENCES Benefit_Type(benefit_type_id);

-- Job_Has_Industry table
ALTER TABLE Job_Has_Industry
ADD FOREIGN KEY (job_id) REFERENCES Job(job_id),
ADD FOREIGN KEY (industry_id) REFERENCES Company_Industry(industry_id);

-- Company_Has_Industry table
ALTER TABLE Company_Has_Industry
ADD FOREIGN KEY (company_id) REFERENCES Company(company_id),
ADD FOREIGN KEY (industry_id) REFERENCES Company_Industry(industry_id);

-- Company_Has_Speciality table
ALTER TABLE Company_Has_Speciality
ADD FOREIGN KEY (company_id) REFERENCES Company(company_id),
ADD FOREIGN KEY (speciality_id) REFERENCES Company_Speciality(speciality_id);

-- Employee_Count table
ALTER TABLE Employee_Count
ADD FOREIGN KEY (company_id) REFERENCES Company(company_id);

-- Company_Location table
ALTER TABLE Company_Location
ADD FOREIGN KEY (company_id) REFERENCES Company(company_id);

-- Address table
ALTER TABLE Address
ADD FOREIGN KEY (location_id) REFERENCES Company_Location(location_id);


-- Tạm thời tắt FKs để insert
set foreign_key_checks = 0
set foreign_key_checks = 1