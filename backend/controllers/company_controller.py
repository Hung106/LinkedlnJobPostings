from flask import request, jsonify
from sqlalchemy import text
from db import engine  # Import từ file db.py
from utils import generate_unique_id

#=========================================GET=========================================#

def get_all_companies():
    try:
        with engine.connect() as connection:
            query = text('SELECT DISTINCT * FROM Company')
            result = connection.execute(query)
            companies = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": companies
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_all_industries():
    try:
        with engine.connect() as connection:
            query = text('SELECT DISTINCT * FROM Industry_Has_Industry_Name')
            result = connection.execute(query)
            industries = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": industries
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_all_specialities():
    try:
        with engine.connect() as connection:
            query = text('SELECT DISTINCT * FROM Company_Speciality')
            result = connection.execute(query)
            specialities = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": specialities
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_company_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f'SELECT DISTINCT * FROM Company WHERE Company_id = {id}')
            result = connection.execute(query)
            company = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": company
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_industries_by_company_id(id):
    try:
        with engine.connect() as connection:
            query = text(f"""
                SELECT DISTINCT ci.Company_id, ci.Industry_id, i.Industry_name
                FROM Company_Has_Industry ci
                JOIN Industry_Has_Industry_Name i ON ci.Industry_id = i.Industry_id
                WHERE ci.Company_id = {id}
            """)
            result = connection.execute(query)
            industries = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": industries
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_industry_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f"""
                SELECT DISTINCT i.Industry_name, c.*
                FROM Industry_Has_Industry_Name i
                JOIN Company_Has_Industry ci ON i.Industry_id = ci.Industry_id
                JOIN Company c ON ci.Company_id = c.Company_id
                WHERE i.Industry_id = {id}
            """)


            
            result = connection.execute(query)
            industry = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": industry
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_location_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f'SELECT DISTINCT * FROM Company_Location WHERE Company_id = {id}')
            result = connection.execute(query)
            location = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": location
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_employee_count_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f'SELECT DISTINCT * FROM Employee_Count WHERE Company_id = {id}')
            result = connection.execute(query)
            employee_count = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": employee_count
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    
#=========================================POST=========================================#
# def create_company(data):
#     try:
#         with engine.connect() as connection:
#             query = text('INSERT INTO Company (Company_name, Company_description, Company_address, Company_phon
# e, Company_email, Company_website) VALUES (:Company_name, :Company_description, :Company_address, :Company_phone, :Company_email, :Company_website)')
#             result = connection.execute(query, data)
#         return jsonify(
#                 {
#                 "success": True,
#                 "message": "Company created successfully"
#                 }
#             )
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)})
# def create_location(data):
#     try:
#         with engine.connect() as connection:
#             query = text('INSERT INTO Company_Location (Company_id, Location_id) VALUES (:Company_id, :Location_id)')
#             result = connection.execute(query, data)
#         return jsonify(
#                 {
#                 "success": True,
#                 "message": "Location created successfully"
#                 }
#             )
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)})
# def create_employee_count(data):
#     try:
#         with engine.connect() as connection:
#             query = text('INSERT INTO Employee_Count (Company_id, Employee_count) VALUES (:Company_id, :Employee_count)')
#             result = connection.execute(query, data)
#         return jsonify(
#                 {
#                 "success": True,
#                 "message": "Employee count created successfully"
#                 }
#             )
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)})
# def create_industry(data):
#     try:
#         with engine.connect() as connection:
#             query = text('INSERT INTO Company_Has_Industry (Company_id, Industry_id) VALUES (:Company_id, :Industry_id)')
#             result = connection.execute(query, data)
#         return jsonify(
#                 {
#                 "success": True,
#                 "message": "Industry created successfully"
#                 }
#             )
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)})

#=========================================PUT=========================================#

