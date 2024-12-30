import pandas as pd
import numpy as np
import re
from sqlalchemy import create_engine

connection_string = "mssql+pyodbc://ZRMR/1?driver=ODBC+Driver+17+for+SQL+Server" #SỬA LẠI

engine = create_engine(connection_string)

def clean_text(text):
    if isinstance(text, str):  # Chỉ xử lý khi text là chuỗi
        # Loại bỏ ký tự không phải ASCII (chẳng hạn emoji)
        text = re.sub(r'[^\x00-\x7F]+', '', text)
    return text

def Company():
    companies = pd.read_csv('companies/companies.csv')
    
    attribute = ['company_id', 'company_size', 'description', 'name', 'url']
    Company = companies[attribute].copy()

    for col in attribute:
        Company[col] = Company[col].apply(clean_text)

    Company.rename(columns={
        'name': 'company_name',
        'url': 'company_url'
    }, inplace=True)

    try:
        Company.to_sql('Company', con=engine, if_exists='append', index=False)
        print("Company has been inserted successfully!")
    except Exception as e:
        print(f"Company: An error occurred during insertion: {e}")
        
def Company_Has_Industry():
    company_industries = pd.read_csv('companies/company_industries.csv').copy()
    company_industries.rename(columns={
        'industry': 'industry_name'
    }, inplace=True)
    industries = pd.read_csv('mappings/industries.csv').copy()
    merged_df = pd.merge(company_industries, industries, on='industry_name', how='left')
    Company_Has_Industry = merged_df[['company_id', 'industry_id']]
    Company_Has_Industry.dropna(inplace=True)
    try:
        Company_Has_Industry.to_sql('Company_Has_Industry', con=engine, if_exists='append', index=False)
        print("Company_Has_Industry has been inserted successfully!")
    except Exception as e:
        print(f"Company_Has_Industry: An error occurred during insertion: {e}")
    
def Company_Industry():
    industries = pd.read_csv('mappings/industries.csv')
    try:
        industries.to_sql('Company_Industry', con=engine, if_exists='append', index=False)
        print("Company_Industry has been inserted successfully!")
    except Exception as e:
        print(f"Company_Industry: An error occurred during insertion: {e}")

def split_address(address):
    # Kiểm tra nếu giá trị là NaN hoặc không phải chuỗi
    if not isinstance(address, str):
        return None, None
    
    # Áp dụng regex cho các địa chỉ có dạng "số tên đường" hoặc "tên đường số"
    match = re.match(r'^\s*(\d+)\s+(.+)$|^(.+?)\s+(\d+)\s*$', address)
    if match:
        if match.group(1):  # Nếu số nhà ở đầu
            return match.group(1), match.group(2)
        else:               # Nếu số nhà ở cuối
            return match.group(4), match.group(3)
    return None, address  # Trả về None nếu không có số nhà, giữ lại tên đường

def Company_Location():
    company = pd.read_csv('companies/companies.csv')
    Company_Location = company[['zip_code', 'address', 'state', 'country', 'city', 'company_id']].copy()
    Company_Location.rename(columns={
        'zip_code': 'zipcode'
    }, inplace=True)
    

    Company_Location = Company_Location[Company_Location['zipcode'].apply(lambda x: len(x) <= 15 if isinstance(x, str) else True)]
    Company_Location[['number', 'street']] = Company_Location['address'].apply(split_address).apply(pd.Series)
    Company_Location.replace(['0', 0, '-'], np.nan, inplace=True)
    
    
    Company_Location.dropna(subset=['zipcode', 'number', 'street', 'state', 'country', 'city'], how='all', inplace=True)
    Company_Location['location_id'] = range(1, len(Company_Location)+1)
    Company_Location = Company_Location[['location_id', 'zipcode', 'number', 'street', 
                                         'state', 'country', 'city', 'company_id']]
    try:
        Company_Location.to_sql('Company_Location', con=engine, if_exists='append', index=False)
        print("Company_Location has been inserted successfully!")
    except Exception as e:
        print(f"Company_Location: An error occurred during insertion: {e}")
        
def Company_Has_Speciality():
    company_specialities = pd.read_csv('companies/company_specialities.csv')

    Company_Has_Speciality = company_specialities[['company_id']].copy()
    Company_Has_Speciality['speciality_id'] = range(1, len(company_specialities) + 1)
    
    try: 
        Company_Has_Speciality.to_sql('Company_Has_Speciality', con=engine, if_exists='append', index=False)
        print("Company_Has_Speciality has been inserted successfully!")
    except Exception as e:
        print(f'Company_Has_Speciality: An error occurred during insertion: {e}')

def Company_Speciality():
    specialities = pd.read_csv('companies/company_specialities.csv')
    specialities.dropna(inplace=True) 
    try:
        specialities.to_sql('Company_Speciality', con=engine, if_exists='append', index=False)
        print("Company_Speciality has been inserted successfully!")
    except Exception as e:
        print(f"Company_Speciality: An error occurred during insertion: {e}")
    
def Employee_Count():
    employee_counts = pd.read_csv('companies/employee_counts.csv')
    employee_counts['employee_count_id'] = range(1, len(employee_counts) + 1)
    employee_counts['time_recorded'] = pd.to_datetime(employee_counts['time_recorded'] / 1000, unit='s')   
    employee_counts.dropna(inplace=True)

    try:
        employee_counts.to_sql('Employee_Count', con=engine, if_exists='append', index=False)
        print("Employee_Count has been inserted successfully!")
    except Exception as e:
        print(f"Employee_Count: An error occurred during insertion: {e}")

def Job_Has_Industry():
    job_industries = pd.read_csv('jobs/job_industries.csv')
    industry_mappings = pd.read_csv('mappings/industries.csv')
    merged_df = pd.merge(job_industries, industry_mappings, on='industry_name', how='left')
    Job_Has_Industry = merged_df[['job_id', 'industry_id']].dropna()
    try:
        Job_Has_Industry.to_sql('Job_Has_Industry', con=engine, if_exists='append', index=False)
        print("Job_Has_Industry has been inserted successfully!")
    except Exception as e:
        print(f"Job_Has_Industry: An error occurred during insertion: {e}")    
        
def Address():
    print("ok")   
 
def Posting():
    postings = pd.read_csv('postings.csv')
    Posting = postings[['title', 'description', 'job_posting_url', 'application_type',
                         'skills_desc', 'formatted_work_type', 'zip_code', 'remote_allowed', 'location', 'company_id', 'job_id']].copy()
    Posting.rename(columns={
        'description': 'posting_description',
        'skills_desc': 'skills_description',
        'formatted_work_type': 'formatted_worktype'
    }, inplace = True)
    
    Posting['title'] = Posting['title'].replace({ 
        r'\s*/\s*': ' or ', # Thay thế tất cả các dạng A/B, A / B, A/ B, A /B thành "or" 
        r'\s*&\s*': ' and ', # Thay thế tất cả các dạng A&B, A & B, A& B, A &B thành "and" 
    }, regex=True)
    
    Posting['title'] = Posting['title'].replace({ 
        'Part - Time': 'Part-Time', 
        'Part- Time': 'Part-Time', 
        'Part -Time': 'Part-Time' 
    })
    
    Posting['title'] = Posting['title'].replace({
        ' - ': ', ',
        '-': ', ',
        ' -': ', ',
        '- ': ', '
    })
    
    Posting['title'] = Posting['title'].str.strip()
    
    Posting['remote_allowed'] = Posting['remote_allowed'].fillna(0).astype(int)
    
    Posting['posting_id'] = range(1, len(Posting) + 1) # tạo ra id tuần tự 1 -> length
    column_order = ["posting_id", "title", "posting_description", "job_posting_url", 
                "application_type", "skills_description", "formatted_worktype", 
                "zip_code", "remote_allowed", "location", "company_id", "job_id"]
    Posting = Posting[column_order]

    try:
        Posting.to_sql('Posting', con=engine, if_exists='append', index=False)
        print("Posting has been inserted successfully!")
    except Exception as e:
        print(f"Posting: An error occurred during insertion: {e}")
       
def Posting_State():
    postings = pd.read_csv('postings.csv')
    
    Posting_State = postings[['original_listed_time', 'listed_time', 'applies', 'views', 'expiry']].copy()
    
    Posting_State['original_listed_time'] = pd.to_datetime(Posting_State['original_listed_time'] / 1000, unit='s')
    Posting_State['expiry'] = pd.to_datetime(Posting_State['expiry'] / 1000, unit='s')
    Posting_State['listed_time'] = pd.to_datetime(Posting_State['listed_time'] / 1000, unit='s')
    
    Posting_State['posting_state_id'] = range(1, len(Posting_State) + 1)
    Posting_State['posting_id'] = range(1, len(Posting_State) + 1)
    
    Posting_State['timezone_offset'] = 0  # giá trị mặc định là 0
    
    Posting_State['applies'] = Posting_State['applies'].fillna(0).astype(int)
    Posting_State['views'] = Posting_State['views'].fillna(0).astype(int)
    
    Posting_State['apply_rate'] = Posting_State['applies'] / Posting_State['views'].replace(0, pd.NA)
    
    Posting_State['remaining_time'] = (Posting_State['expiry'] - Posting_State['original_listed_time']).dt.days

    column_order = ["posting_state_id", "timezone_offset", 'original_listed_time', 'listed_time', 
                    'applies', 'views', 'expiry', 'posting_id', 'apply_rate', 'remaining_time']
    Posting_State = Posting_State[column_order]
    
    try:
        Posting_State.to_sql('Posting_State', con=engine, if_exists='append', index=False)
        print("Posting_State has been inserted successfully!")
    except Exception as e:
        print(f"Posting_State: An error occurred during insertion: {e}")

def Additional_Info():
    postings = pd.read_csv('postings.csv')
    
    Additional_Info = postings[['formatted_experience_level', 'posting_domain', 'application_url', 'closed_time']].copy()
    Additional_Info.rename(columns={
        'closed_time':'close_time'
    }, inplace=True)
    Additional_Info['additional_info_id'] = range(1, len(Additional_Info) + 1)
    Additional_Info['posting_id'] = range(1, len(Additional_Info) + 1)
    Additional_Info['close_time'] = pd.to_datetime(Additional_Info['close_time'] / 1000, unit='s')
    
    # Additional_Info['application_url'] = Additional_Info['application_url'].str.strip()
    # Additional_Info['application_url'] = Additional_Info['application_url'].replace('', None)
    
    column_order = ['additional_info_id', 'formatted_experience_level', 'posting_domain', 'application_url', 'close_time', 'posting_id']
    Additional_Info = Additional_Info[column_order]
    
    Additional_Info.dropna(subset=['formatted_experience_level', 'posting_domain', 'application_url', 'close_time'], how='all', inplace=True)
    
    try:
        Additional_Info.to_sql('Additional_Info', con=engine, if_exists='append', index=False)
        print("Additional_Info has been inserted successfully!")
    except Exception as e:
        print(f"Additional_Info: An error occurred during insertion: {e}")

def Job():
    job = pd.read_csv('jobs/job_industries.csv') # cái này có nhiều unique job id nhất 127125
    Job = job[['job_id']].drop_duplicates()
    Job['job_description'] = ""
    
    posting = pd.read_csv('postings.csv')  # Assuming the posting table is in this CSV file

    # Merge job and posting tables on 'job_id' to get the job descriptions
    merged_df = pd.merge(Job, posting[['job_id', 'title']], on='job_id', how='left')

    # Update the job_description in the Job dataframe
    Job['job_description'] = merged_df['title']

    try:
        Job.to_sql('Job', con=engine, if_exists='append', index=False)
        print("Job has been inserted successfully!")
    except Exception as e:
        print(f"Job: An error occurred during insertion: {e}")

def Skill():
    skills = pd.read_csv('mappings/skills.csv')
    skills['category'] = ""
    try:
        skills.to_sql('Skill', con=engine, if_exists='append', index=False)
        print("skills has been inserted successfully!")
    except Exception as e:
        print(f"skills: An error occurred during insertion: {e}")
        
def Benefit():
    benefit = pd.read_csv('jobs/benefits.csv')
    Benefit = benefit[['inferred']]
    Benefit['benefit_id'] = range(1, len(benefit) + 1)
    Benefit = Benefit[['benefit_id', 'inferred']]
    try:
        Benefit.to_sql('Benefit', con=engine, if_exists='append', index=False)
        print("Benefit has been inserted successfully!")
    except Exception as e:
        print(f"Benefit: An error occurred during insertion: {e}")       

def Benefit_Type():
    benefits = pd.read_csv('jobs/benefits.csv')
    Benefit_Type = benefits[['type']].drop_duplicates()
    Benefit_Type['benefit_type_id'] = range(1, len(Benefit_Type)+1)
    Benefit_Type = Benefit_Type[['benefit_type_id', 'type']]
    
    try: 
        Benefit_Type.to_sql('Benefit_Type', con=engine, if_exists='append', index=False)
        print("Benefit has been inserted successfully")
    except Exception as e:
        print(f'Benefit Type: An error occurred during insertion: {e}')
        
def Benefit_Has_Benefit_Type():
    benefit_type = pd.read_csv('jobs/benefits.csv').copy()
    benefits = pd.read_csv('jobs/benefits.csv').copy()
    benefits['benefit_id'] = range(1, len(benefits)+1)
    temp = pd.merge(benefits, benefit_type, on="type", how="left")
    
    Benefit_Has_Benefit_Type = temp[['benefit_id', 'benefit_type_id']].copy()
    
    try: 
        Benefit_Has_Benefit_Type.to_sql('Benefit_Has_Benefit_Type', con=engine, if_exists='append', index=False)
        print("Benefit_Has_Benefit_Type has been inserted successfully")
    except Exception as e:
        print(f'Benefit_Has_Benefit_Type: An error occurred during insertion: {e}')
      
def Job_Has_Benefit():
    benefits = pd.read_csv('jobs/benefits.csv')
    Job_Has_Benefit = benefits[['job_id']].copy()
    Job_Has_Benefit['benefit_id'] = range(1, len(benefits)+1)
    
    try: 
        Job_Has_Benefit.to_sql('Job_Has_Benefit', con=engine, if_exists='append', index=False)
        print("Job_Has_Benefit has been inserted successfully")
    except Exception as e:
        print(f'Job_Has_Benefit: An error occurred during insertion: {e}')
        
def Requires():
    skill = pd.read_csv('jobs/job_skills.csv')
    Requires = skill[['job_id', 'skill_abr']].copy()
    try: 
        Requires.to_sql('Requires', con=engine, if_exists='append', index=False)
        print("Requires has been inserted successfully")
    except Exception as e:
        print(f'Requires: An error occurred during insertion: {e}')
             
def Salary():
    salary = pd.read_csv('jobs/salaries.csv')
    posting = pd.read_csv('postings.csv')
    Salary_from_job_salary = salary[['salary_id', 'job_id', 'currency', 'compensation_type', 'pay_period']].copy()
    Salary_from_posting = posting[['job_id', 'currency', 'compensation_type', 'pay_period']].copy()
    Salary = pd.concat([Salary_from_job_salary, Salary_from_posting]).drop_duplicates(subset='job_id', keep='first')
    Salary['salary_id'] = range(1, len(Salary)+1)

    try: 
        Salary.to_sql('Salary', con=engine, if_exists='append', index=False)
        print("Salary has been inserted successfully")
    except Exception as e:
        print(f'Salary: An error occurred during insertion: {e}')
    
def Salary_Type():
    salary = pd.read_csv('jobs/salaries.csv')
    posting = pd.read_csv('postings.csv')
    Salary_from_job_salary = salary[['salary_id', 'job_id', 'min_salary', 'max_salary', 'med_salary']].copy()
    Salary_from_posting = posting[['job_id', 'min_salary', 'max_salary', 'med_salary']].copy()
    Salary = pd.concat([Salary_from_job_salary, Salary_from_posting]).drop_duplicates(subset='job_id', keep='first')
    Salary['salary_id'] = range(1, len(Salary)+1)
    Salary = Salary.rename(columns={
        'max_salary': 'max',
        'min_salary': 'min',
        'med_salary': 'med'
    })
    
    Salary_Type = pd.melt(Salary, id_vars=['salary_id'], 
                          value_vars=['max', 'med', 'min'], 
                          var_name='salary_type', 
                          value_name='value')
    Salary_Type = Salary_Type.dropna(subset=['value'])
    
    try: 
        Salary_Type.to_sql('Salary_Type', con=engine, if_exists='append', index=False)
        print("Salary_Type has been inserted successfully")
    except Exception as e:
        print(f'Salary_Type: An error occurred during insertion: {e}') 
             
# Gọi hàm để chạy

Company()
Company_Has_Industry()
Company_Industry()
split_address() 
Company_Location()
Company_Has_Speciality()
Company_Speciality()
Employee_Count() 
Job_Has_Industry() 
Address()
Posting() 
Posting_State() 
Additional_Info() 
Job()
Skill()
Benefit()
Benefit_Type() 
Benefit_Has_Benefit_Type()
Job_Has_Benefit()
Requires()
Salary()
Salary_Type()