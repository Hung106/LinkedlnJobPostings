from flask import request, jsonify
from sqlalchemy import text
from app.db import engine  # Import từ file db.py
from app.utils import generate_unique_id
import time

current_timestamp = int(time.time())
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
            query = text(f'''
                INSERT INTO Company (Company_id, Company_size, description, Company_name, Company_url) 
                VALUES ({company_id}, {company_size}, '{description}', '{company_name}', '{company_url}')
            ''')
            connection.execute(query)

            if 'country' in data:
                country = data['country']
                state = data.get('state', None)
                city = data.get('city', None)
                zip_code = data.get('zip_code', None)
                number = data.get('number', None)
                street = data.get('street', None)

                location_query = text(f'''
                    INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                    VALUES ({company_id}, '{country}', {f"'{state}'" if state else "0"}, {f"'{city}'" if city else "0"}, {f"'{zip_code}'" if zip_code else "NULL"}, {f"'{number}'" if number else "NULL"}, {f"'{street}'" if street else "NULL"})
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
                print(result)
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
            
            if 'employee_count' in data:
                employee_count_query = text(f'''
                    INSERT INTO Employee_Count (Company_id, Employee_count, Follower_count, Time_recoded)
                    VALUES ({company_id}, {data['employee_count']}, {data['Follower_count']}, {current_timestamp})
                ''')
                connection.execute(employee_count_query)
        return jsonify({
            "success": True,
            "message": "Company created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_location():
    try:
        data = request.get_json()
        with engine.connect() as connection:
            company_id = data['company_id']
            country = data['country']
            state = data.get('state', None)
            city = data.get('city', None)
            zip_code = data.get('zip_code', None)
            number = data.get('number', None)
            street = data.get('street', None)

            location_query = text(f'''
                INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                VALUES ({company_id}, '{country}', {f"'{state}'" if state else "0"}, {f"'{city}'" if city else "0"}, {f"'{zip_code}'" if zip_code else "NULL"}, {f"'{number}'" if number else "NULL"}, {f"'{street}'" if street else "NULL"})
            ''')

            connection.execute(location_query)
        
        return jsonify({
            "success": True,
            "message": "Location created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_industry():
    try:
        data = request.get_json()
        with engine.connect() as connection:
            if 'industry_id' in data:
                industry_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({data['company_id']}, {data['industry_id']})
                ''')
                connection.execute(industry_query)
            elif 'industry_name' in data:
                get_industry_query = text(f'''
                    SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = '{data['industry_name']}'
                ''')
                result = connection.execute(get_industry_query).fetchone()
                print(result)
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
                    VALUES ({data['company_id']}, {industry_id})
                ''')
                connection.execute(industry_insert_query)
        
        return jsonify({
            "success": True,
            "message": "Industry created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_employee_count():
    try:
        data = request.get_json()
        with engine.connect() as connection:
            employee_count_query = text(f'''
                    INSERT INTO Employee_Count (Company_id, Employee_count, Follower_count, Time_recoded)
                    VALUES ({data['company_id']}, {data['employee_count']}, {data['Follower_count']}, {current_timestamp})
                ''')
            connection.execute(employee_count_query)
        return jsonify({
            "success": True,
            "message": "Employee count created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
#=========================================PUT============================================#
def update_company(id):
    try:
        data = request.get_json()

        company_size = data.get('company_size', None)
        description = data.get('description', None)
        company_name = data.get('company_name', None)
        company_url = data.get('company_url', None)

        set_clause = []
        if company_size is not None:
            set_clause.append(f"Company_size = {company_size}")
        if description is not None:
            set_clause.append(f"description = '{description}'")
        if company_name is not None:
            set_clause.append(f"Company_name = '{company_name}'")
        if company_url is not None:
            set_clause.append(f"Company_url = '{company_url}'")

        if set_clause:
            update_query = text(f'''
                UPDATE Company
                SET {', '.join(set_clause)}
                WHERE Company_id = {id}
            ''')
            print (update_query)

            with engine.connect() as connection:
                connection.execute(update_query)

        if 'country' in data:
            country = data['country']
            state = data.get('state', None)
            city = data.get('city', None)
            zip_code = data.get('zip_code', None)
            number = data.get('number', None)
            street = data.get('street', None)

            location_update_query = text(f'''
                UPDATE company_location
                SET country = '{country}', 
                    state = {f"'{state}'" if state else "NULL"},
                    city = {f"'{city}'" if city else "NULL"},
                    zip_code = {f"'{zip_code}'" if zip_code else "NULL"},
                    number = {f"'{number}'" if number else "NULL"},
                    street = {f"'{street}'" if street else "NULL"}
                WHERE company_id = {id}
            ''')

            with engine.connect() as connection:
                connection.execute(location_update_query)

        if 'industry_id' in data:
            industry_update_query = text(f'''
                UPDATE Company_Has_Industry
                SET industry_id = {data['industry_id']}
                WHERE company_id = {id}
            ''')
            with engine.connect() as connection:
                connection.execute(industry_update_query)

        elif 'industry_name' in data:
            get_industry_query = text(f'''
                SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = '{data['industry_name']}'
            ''')
            with engine.connect() as connection:
                result = connection.execute(get_industry_query).fetchone()

            if result:
                industry_id = result['industry_id']
            else:
                insert_industry_query = text(f'''
                    INSERT INTO Industry_Has_Industry_Name (industry_name) 
                    VALUES ('{data['industry_name']}')
                ''')
                with engine.connect() as connection:
                    connection.execute(insert_industry_query)

                industry_id = connection.execute(get_industry_query).fetchone()['industry_id']

            industry_insert_query = text(f'''
                UPDATE Company_Has_Industry 
                SET industry_id = {industry_id} 
                WHERE company_id = {id}
            ''')
            with engine.connect() as connection:
                connection.execute(industry_insert_query)

        return jsonify({
            "success": True,
            "message": "Company updated successfully"
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def update_location(id):
    try:
        data = request.get_json()
        
        country = data.get('country', None)
        state = data.get('state', None)
        city = data.get('city', None)
        zip_code = data.get('zip_code', None)
        number = data.get('number', None)
        street = data.get('street', None)

        set_clause = []
        if country is not None:
            set_clause.append(f"country = '{country}'")
        if state is not None:
            set_clause.append(f"state = {f"'{state}'" if state else "NULL"}")
        if city is not None:
            set_clause.append(f"city = {f"'{city}'" if city else "NULL"}")
        if zip_code is not None:
            set_clause.append(f"zip_code = {f"'{zip_code}'" if zip_code else "NULL"}")
        if number is not None:
            set_clause.append(f"number = {f"'{number}'" if number else "NULL"}")
        if street is not None:
            set_clause.append(f"street = {f"'{street}'" if street else "NULL"}")

        if set_clause:
            location_update_query = text(f'''
                UPDATE company_location
                SET {', '.join(set_clause)}
                WHERE company_id = {id}
            ''')

            with engine.connect() as connection:
                connection.execute(location_update_query)
        
        return jsonify({
            "success": True,
            "message": "Location updated successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def update_industry(id):
    try:
        data = request.get_json()

        if 'industry_id' in data:
            industry_update_query = text(f'''
                UPDATE Company_Has_Industry
                SET industry_id = {data['industry_id']}
                WHERE company_id = {id}
            ''')

            with engine.connect() as connection:
                connection.execute(industry_update_query)

        elif 'industry_name' in data:
            get_industry_query = text(f'''
                SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = '{data['industry_name']}'
            ''')

            with engine.connect() as connection:
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
                UPDATE Company_Has_Industry
                SET industry_id = {industry_id}
                WHERE company_id = {id}
            ''')

            with engine.connect() as connection:
                connection.execute(industry_insert_query)

        return jsonify({
            "success": True,
            "message": "Industry updated successfully"
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def update_employee_count(id):
    try:
        data = request.get_json()
        update_query = text(f'''
            UPDATE Employee_Count
            SET Employee_count = {data['employee_count']}
            WHERE Company_id = {id}
        ''')
        with engine.connect() as connection:
            connection.execute(update_query)
            
        return jsonify({
            "success": True,
            "message": "Employee count updated successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
#=========================================DELETE=========================================#
def delete_company(id):
    try:
        with engine.connect() as connection:
            delete_industry_query = text(f'''
                DELETE FROM Company_Has_Industry WHERE company_id = {id}
            ''')
            connection.execute(delete_industry_query)

            delete_location_query = text(f'''
                DELETE FROM company_location WHERE company_id = {id}
            ''')
            connection.execute(delete_location_query, {'company_id': id})

            delete_company_query = text(f'''
                DELETE FROM Company WHERE company_id = {id}
            ''')
            connection.execute(delete_company_query)

        return jsonify({
            "success": True,
            "message": "Company and related data deleted successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_location(id):
    try:
        with engine.connect() as connection:
            query = text(f'DELETE FROM company_location WHERE company_id = {id}')
            connection.execute(query,)
        
        return jsonify({
            "success": True,
            "message": "Location deleted successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_industry(id):
    try:
        with engine.connect() as connection:
            query = text(f'DELETE FROM Company_Has_Industry WHERE company_id = {id}')
            connection.execute(query)

        return jsonify({
            "success": True,
            "message": "Industry deleted successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
# def delete_speciality(id):
#     try:
#         with engine.connect() as connection:
#             query = text('DELETE FROM Company_Speciality WHERE company_id = :company_id')
#             connection.execute(query, {'company_id': id})

#         return jsonify({
#             "success": True,
#             "message": "Speciality deleted successfully"
#         })
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)})
def delete_employee_count(id):
    try:
        with engine.connect() as connection:
            query = text(f'DELETE FROM Employee_Count WHERE company_id = {id}')
            connection.execute(query)

        return jsonify({
            "success": True,
            "message": "Employee count deleted successfully"
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

