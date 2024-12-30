from flask import request, jsonify
from sqlalchemy import text
from app.db import engine  # Import từ file db.py
from app.utils import generate_unique_id

#=========================================GET=========================================#

def get_all_companies():
    try:
        with engine.connect() as connection:
            query = text('SELECT TOP 100 * FROM Company')
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
def create_company():
    try:
        data = request.get_json()
        
        company_id = data['company_id']
        company_size = data['company_size']
        description = data['description']
        company_name = data['company_name']
        company_url = data['company_url']
        
        with engine.connect() as connection:
            query = text('''
                INSERT INTO Company (Company_id, Company_size, description, Company_name, Company_url) 
                VALUES (:company_id, :company_size, :description, :company_name, :company_url)
            ''')
            result = connection.execute(query, {
                'company_id': company_id,
                'company_size': company_size,
                'description': description,
                'company_name': company_name,
                'company_url': company_url
            })
            print(f"Number of affected rows: {result.rowcount}")
        
            if all(key in data for key in ['country', 'state', 'city', 'zip_code', 'number', 'street']):
                location_query = text(f'''
                    INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                    VALUES ({company_id}, '{data['country']}', '{data['state']}', '{data['city']}', '{data['zip_code']}', '{data['number']}', '{data['street']}')
                ''')
                connection.execute(location_query)

            if 'industry_id' in data:
                industry_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({company_id}, {data['industry_id']})
                ''')
                connection.execute(industry_query)
            elif 'industry_name' in data:
                get_industry_query = text(f'''
                    SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = '{data['industry_name']}'
                ''')
                result = connection.execute(get_industry_query).fetchone()

                if result:
                    industry_id = result['industry_id']
                else:
                    insert_industry_query = text(f'''
                        INSERT INTO Industry_Has_Industry_Name (industry_name) 
                        VALUES ('{data['industry_name']}')
                    ''')
                    connection.execute(insert_industry_query)
                    
                    industry_id = connection.execute(get_industry_query).fetchone()['industry_id']
                
                industry_insert_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({company_id}, {industry_id})
                ''')
                connection.execute(industry_insert_query)

        return jsonify({
            "success": True,
            "message": "Company created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

def create_location(data):
    try:
        with engine.connect() as connection:
            location_query = text(''' 
                INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                VALUES (:company_id, :country, :state, :city, :zip_code, :number, :street)
            ''')
            result = connection.execute(location_query, {
                'company_id': data['company_id'],
                'country': data['country'],
                'state': data['state'],
                'city': data['city'],
                'zip_code': data['zip_code'],
                'number': data['number'],
                'street': data['street']
            })
            
        return jsonify({
            "success": True,
            "message": "Location created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})


def create_industry(data):
    try:
        with engine.connect() as connection:
            if 'industry_id' in data:
                industry_query = text(''' 
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES (:company_id, :industry_id)
                ''')
                result = connection.execute(industry_query, {
                    'company_id': data['company_id'],
                    'industry_id': data['industry_id']
                })
            elif 'industry_name' in data:
                get_industry_query = text('''
                    SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = :industry_name
                ''')
                result = connection.execute(get_industry_query, {'industry_name': data['industry_name']}).fetchone()

                if result:
                    industry_id = result['industry_id']
                else:
                    insert_industry_query = text('''
                        INSERT INTO Industry_Has_Industry_Name (industry_name) 
                        VALUES (:industry_name)
                    ''')
                    connection.execute(insert_industry_query, {'industry_name': data['industry_name']})

                    industry_id = connection.execute(get_industry_query, {'industry_name': data['industry_name']}).fetchone()['industry_id']

                industry_insert_query = text('''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES (:company_id, :industry_id)
                ''')
                connection.execute(industry_insert_query, {
                    'company_id': data['company_id'],
                    'industry_id': industry_id
                })
        
        return jsonify({
            "success": True,
            "message": "Industry created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

#=========================================PUT============================================#
#=========================================DELETE=========================================#
def delete_company(id):
    try:
        with engine.connect() as connection:
            delete_industry_query = text('''
                DELETE FROM Company_Has_Industry WHERE company_id = :company_id
            ''')
            connection.execute(delete_industry_query, {'company_id': id})

            delete_location_query = text('''
                DELETE FROM company_location WHERE company_id = :company_id
            ''')
            connection.execute(delete_location_query, {'company_id': id})

            delete_company_query = text('''
                DELETE FROM Company WHERE company_id = :company_id
            ''')
            connection.execute(delete_company_query, {'company_id': id})

        return jsonify({
            "success": True,
            "message": "Company and related data deleted successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

#=========================================CHART=========================================#
def get_chart_company_postings(id):
    try:
        with engine.connect() as connection:
            query = text(f"""
                SELECT
                    ps.original_listed_time,
                    COUNT(*) AS post_count
                FROM Posting_State ps
                JOIN Posting p ON ps.posting_state_id = p.posting_id
                WHERE p.company_id = {id}
                GROUP BY ps.original_listed_time
                ORDER BY ps.original_listed_time
            """)
            result = connection.execute(query)
            chart_data = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": chart_data
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

