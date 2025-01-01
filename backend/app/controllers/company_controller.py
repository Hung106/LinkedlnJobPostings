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
            query = text('SELECT * FROM Industry_Has_Industry_Name')
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
            query = text('SELECT * FROM Company_Speciality')
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
            query = text(f'SELECT * FROM Company WHERE Company_id = {id}')
            query = text(f'SELECT * FROM Company WHERE Company_id = {id}')
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
                SELECT ci.Company_id, ci.Industry_id, i.Industry_name
                SELECT ci.Company_id, ci.Industry_id, i.Industry_name
                FROM Company_Has_Industry ci
                JOIN Company_Industry i ON ci.Industry_id = i.Industry_id
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
                SELECT i.Industry_name, c.*
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
def get_speciality_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f'''
                SELECT chs.company_id, chs.speciality_id, cs.speciality
                FROM Company_Has_Speciality AS chs
                JOIN Company_Speciality AS cs
                ON chs.speciality_id = cs.speciality_id
                WHERE chs.company_id = {id}
            ''')
            result = connection.execute(query)
            speciality = [dict(row._mapping) for row in result]
        return jsonify(
                {
                "success": True,
                "data": speciality
                }
            )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def get_location_by_id(id):
    try:
        with engine.connect() as connection:
            query = text(f'SELECT * FROM Company_Location WHERE Company_id = {id}')
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
            query = text(f'SELECT * FROM Employee_Count WHERE Company_id = {id}')
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
from sqlalchemy import text
from flask import request, jsonify
from sqlalchemy.exc import SQLAlchemyError

def create_company():
    try:
        data = request.get_json()

        # Kiểm tra dữ liệu đầu vào
        required_fields = ['company_id', 'company_size', 'description', 'name', 'url']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400

        company_id = int(data['company_id'])
        company_size = int(data['company_size'])
        description = data['description']
        company_name = data['company_name']
        company_url = data['company_url']
        
        with engine.connect() as connection:
            query = text(f'''
                INSERT INTO Company (Company_id, Company_size, description, Company_name, Company_url) 
                VALUES ({company_id}, {company_size}, '{description}', '{company_name}', '{company_url}')
                COMMIT;
            ''')
            connection.execute(query)

            #Check if location is in data
            if 'country' in data:
                location_query = text('''
                    INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                    VALUES ({company_id}, '{country}', {f"'{state}'" if state else "0"}, {f"'{city}'" if city else "0"}, {f"'{zip_code}'" if zip_code else "NULL"}, {f"'{number}'" if number else "NULL"}, {f"'{street}'" if street else "NULL"})
                    COMMIT;
                ''')

                connection.execute(location_query)
            
            #Check if industry_id or industry_name is in data
            if 'industry_id' in data:
                industry_query = text('''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({company_id}, {data['industry_id']})
                    COMMIT;
                ''')
                connection.execute(industry_query, {
                    "company_id": company_id,
                    "industry_id": data['industry_id']
                })
                print("Inserted into Company_Has_Industry successfully")
            elif 'industry_name' in data:
                industry_name = data['industry_name']
                get_industry_query = text('''
                    SELECT industry_id FROM Industry_Has_Industry_Name WHERE industry_name = :industry_name
                ''')
                result = connection.execute(get_industry_query).fetchone()
                if result:
                    industry_id = result[0]
                else:
                    insert_industry_query = text('''
                        INSERT INTO Industry_Has_Industry_Name (industry_name) 
                        VALUES ('{data['industry_name']}')
                        COMMIT;
                    ''')
                    connection.execute(insert_industry_query)
                    
                    industry_id = connection.execute(get_industry_query).fetchone()[0]
                
                industry_insert_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({company_id}, {industry_id})
                    COMMIT;
                ''')
                connection.execute(industry_insert_query)
            
            #Check if speciality_id or speciality is in data
            if 'speciality_id' in data:
                speciality_query = text(f''' 
                    INSERT INTO Company_Has_Speciality (company_id, speciality_id) 
                    VALUES ({company_id}, {data['speciality_id']}) 
                    COMMIT;
                ''')
                connection.execute(speciality_query)
            elif 'speciality' in data:
                get_speciality_query = text(f'''
                    SELECT speciality_id FROM Company_Speciality WHERE speciality = '{data['speciality']}'
                ''')
                result = connection.execute(get_speciality_query).fetchone()
                if result:
                    speciality_id = result[0]
                else:
                    insert_speciality_query = text(f'''
                        INSERT INTO Company_Speciality (speciality) 
                        VALUES ('{data['speciality']}')
                        COMMIT;
                    ''')
                    connection.execute(insert_speciality_query)
                    
                    speciality_id = connection.execute(get_speciality_query).fetchone()[0]
                speciality_insert_query = text(f'''
                    INSERT INTO Company_Has_Speciality (company_id, speciality_id)
                    VALUES ({company_id}, {speciality_id})
                    COMMIT;
                ''')
                connection.execute(speciality_insert_query)
            
            #check if employee_count is in data
            if 'employee_count' in data:
                employee_count_query = text(f'''
                    INSERT INTO Employee_Count (Company_id, Employee_count, Follower_count, Time_recorded)
                    VALUES ({company_id}, {data['employee_count']}, {data['follower_count']}, {current_timestamp})
                    COMMIT;
                ''')
                connection.execute(employee_count_query, {
                    "company_id": company_id,
                    "employee_count": data.get('employee_count'),
                    "follower_count": data.get('follower_count', 0)
                })
                print("Inserted into Employee_Count successfully")

        return jsonify({
            "success": True,
            "message": "Company created successfully"
        }), 201

    except SQLAlchemyError as e:
        print("SQLAlchemy Error:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500
    except KeyError as e:
        print("Missing Key Error:", e)
        return jsonify({"success": False, "message": f"Missing key: {e}"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_location(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            company_id = id
            country = data['country']
            state = data.get('state', None)
            city = data.get('city', None)
            zip_code = data.get('zip_code', None)
            number = data.get('number', None)
            street = data.get('street', None)

            location_query = text(f'''
                INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                VALUES ({company_id}, '{country}', {f"'{state}'" if state else "0"}, {f"'{city}'" if city else "0"}, {f"'{zip_code}'" if zip_code else "NULL"}, {f"'{number}'" if number else "NULL"}, {f"'{street}'" if street else "NULL"})
                COMMIT;
            ''')

            connection.execute(location_query)
        
        return jsonify({
            "success": True,
            "message": "Location created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_industry(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            if 'industry_id' in data:
                industry_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({id}, {data['industry_id']})
                    COMMIT;
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
                        COMMIT;
                    ''')
                    connection.execute(insert_industry_query)
                    
                    industry_id = connection.execute(get_industry_query).fetchone()[0]
                
                industry_insert_query = text(f'''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES ({id}, {industry_id})
                    COMMIT;
                ''')
                connection.execute(industry_insert_query)
        
        return jsonify({
            "success": True,
            "message": "Industry created successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_speciality(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            if 'speciality_id' in data:
                speciality_query = text(f'''
                    INSERT INTO Company_Has_Speciality (company_id, speciality_id)
                    VALUES ({id}, {data['speciality_id']})
                    COMMIT;
                ''')
                connection.execute(speciality_query)
            elif 'speciality' in data:
                get_speciality_query = text(f'''
                    SELECT speciality_id FROM Company_Speciality WHERE speciality = '{data['speciality']}'
                ''')
                result = connection.execute(get_speciality_query).fetchone()
                if result:
                    speciality_id = result[0]
                else:
                    insert_speciality_query = text(f'''
                        INSERT INTO Company_Speciality (speciality)
                        VALUES ('{data['speciality']}')
                        COMMIT;
                    ''')
                    connection.execute(insert_speciality_query)

                    speciality_id = connection.execute(get_speciality_query).fetchone()[0]

                speciality_insert_query = text(f'''
                    INSERT INTO Company_Has_Speciality (company_id, speciality_id)
                    VALUES ({id}, {speciality_id})
                    COMMIT;
                ''')
                connection.execute(speciality_insert_query)

        return jsonify({
            "success": True,
            "message": "Speciality created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def create_employee_count(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            employee_count_query = text(f'''
                    INSERT INTO Employee_Count (Company_id, Employee_count, Follower_count, Time_recoded)
                    VALUES ({id}, {data['employee_count']}, {data['Follower_count']}, {current_timestamp})
                    COMMIT;
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

        company_size = data.get('company_size')
        description = data.get('description')
        name = data.get('name')
        url = data.get('url')

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
                COMMIT;
            ''')

            with engine.connect() as connection:
                connection.execute(update_query)

        #update location if location is in data
        if any(key in data for key in ['country', 'state', 'city', 'zip_code', 'number', 'street']):
            fields_to_update = []

            if 'country' in data:
                fields_to_update.append(f"country = '{data['country']}'")
            if 'state' in data:
                fields_to_update.append(f"state = '{data['state']}'" if data['state'] else "state = 0")
            if 'city' in data:
                fields_to_update.append(f"city = '{data['city']}'" if data['city'] else "city = 0")
            if 'zip_code' in data:
                fields_to_update.append(f"zip_code = '{data['zip_code']}'" if data['zip_code'] else "zip_code = NULL")
            if 'number' in data:
                fields_to_update.append(f"number = '{data['number']}'" if data['number'] else "number = NULL")
            if 'street' in data:
                fields_to_update.append(f"street = '{data['street']}'" if data['street'] else "street = NULL")

            if fields_to_update:
                update_query =text(f'''
                    UPDATE company_location
                    SET {', '.join(fields_to_update)}
                    WHERE company_id = {id};
                    COMMIT;
                ''')
                with engine.connect() as connection:
                    connection.execute(update_query)

        #update industry if industry is in data
        if 'industry_id' in data or 'industry_new_id' in data or 'industry_new_name' in data:

            with engine.connect() as connection:
                if 'industry_new_id' in data:
                    industry_new_id = data['industry_new_id']
                    update_query = text(f'''
                        UPDATE Company_Has_Industry
                        SET industry_id = {industry_new_id}
                        WHERE company_id = {id} AND industry_id = {data.get('industry_id', 0)};
                        COMMIT;
                    ''')
                    connection.execute(update_query)

                elif 'industry_new_name' in data:
                    industry_new_name = data['industry_new_name']
                    select_query = text(f'''
                        SELECT industry_id FROM Industry_Has_Industry_Name
                        WHERE industry_name = '{industry_new_name}';
                    ''')
                    result = connection.execute(select_query).fetchone()

                    if result:
                        industry_new_id = result[0]
                        update_query = text(f'''
                            UPDATE Company_Has_Industry
                            SET industry_id = {industry_new_id}
                            WHERE company_id = {id} AND industry_id = {data.get('industry_id', 0)};
                            COMMIT;
                        ''')
                        connection.execute(update_query)

        #update speciality if speciality is in data
        if 'speciality_id' in data or 'speciality_new_id' in data or 'speciality_new_name' in data:
            with engine.connect() as connection:
                if 'speciality_new_id' in data:
                    speciality_new_id = data['speciality_new_id']
                    update_query = text(f'''
                        UPDATE Company_Has_Speciality
                        SET speciality_id = {speciality_new_id}
                        WHERE company_id = {id} AND speciality_id = {data.get('speciality_id', 0)};
                        COMMIT;
                    ''')
                    connection.execute(update_query)

                elif 'speciality_new_name' in data:
                    speciality_new_name = data['speciality_new_name']
                    select_query = text(f'''
                        SELECT speciality_id FROM Company_Speciality
                        WHERE speciality = '{speciality_new_name}';
                    ''')
                    result = connection.execute(select_query).fetchone()

                    if result:
                        speciality_new_id = result[0]
                        update_query = text(f'''
                            UPDATE Company_Has_Speciality
                            SET speciality_id = {speciality_new_id}
                            WHERE company_id = {id} AND speciality_id = {data.get('speciality_id', 0)};
                            COMMIT;
                        ''')
                        connection.execute(update_query)
                    
        #update employee_count if employee_count is in data
        if 'time_recorded' in data:
            with engine.connect() as connection:
                update_query = text(f'''
                    UPDATE Employee_Count
                    SET Employee_count = {data['employee_count']}, Follower_count = {data['follower_count']}, time_recorded = {current_timestamp}
                    WHERE Company_id = {id} AND Time_recorded = {data['time_recorded']}
                    COMMIT;
                ''')
                connection.execute(update_query)

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
                COMMIT;
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
        with engine.connect() as connection:
            if 'industry_new_id' in data:
                industry_new_id = data['industry_new_id']
                update_query = text(f'''
                    UPDATE Company_Has_Industry
                    SET industry_id = {industry_new_id}
                    WHERE company_id = {id} AND industry_id = {data.get('industry_id', 0)};
                    COMMIT;
                ''')
                connection.execute(update_query)

            elif 'industry_new_name' in data:
                industry_new_name = data['industry_new_name']
                select_query = text(f'''
                    SELECT industry_id FROM Industry_Has_Industry_Name
                    WHERE industry_name = '{industry_new_name}';
                ''')
                result = connection.execute(select_query).fetchone()

                if result:
                    industry_new_id = result[0]
                    update_query = text(f'''
                        UPDATE Company_Has_Industry
                        SET industry_id = {industry_new_id}
                        WHERE company_id = {id} AND industry_id = {data.get('industry_id', 0)};
                        COMMIT;
                    ''')
                    connection.execute(update_query)
        return jsonify({
            "success": True,
            "message": "Industry updated successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def update_speciality(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            if 'speciality_new_id' in data:
                speciality_new_id = data['speciality_new_id']
                update_query = text(f'''
                    UPDATE Company_Has_Speciality
                    SET speciality_id = {speciality_new_id}
                    WHERE company_id = {id} AND speciality_id = {data.get('speciality_id', 0)};
                    COMMIT;
                ''')
                connection.execute(update_query)

            elif 'speciality_new_name' in data:
                speciality_new_name = data['speciality_new_name']
                select_query = text(f'''
                    SELECT speciality_id FROM Company_Speciality
                    WHERE speciality = '{speciality_new_name}';
                ''')
                result = connection.execute(select_query).fetchone()

                if result:
                    speciality_new_id = result[0]
                    update_query = text(f'''
                        UPDATE Company_Has_Speciality
                        SET speciality_id = {speciality_new_id}
                        WHERE company_id = {id} AND speciality_id = {data.get('speciality_id', 0)};
                        COMMIT;
                    ''')
                    connection.execute(update_query)
            return jsonify({"success": True, 
                "message": "Speciality updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def update_employee_count(id):
    try:
        data = request.get_json()
        update_query = text(f'''
            UPDATE Employee_Count
            SET Employee_count = {data['employee_count']}
            WHERE Company_id = {id}
            COMMIT;
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
                COMMIT;
            ''')
            connection.execute(delete_industry_query, {'company_id': id})

            delete_location_query = text(f'''
                DELETE FROM company_location WHERE company_id = {id}
                COMMIT;
            ''')
            connection.execute(delete_location_query, {'company_id': id})

            delete_speciality_query = text(f'''
                DELETE FROM Company_Has_Speciality WHERE company_id = {id}
                COMMIT;
            ''')
            connection.execute(delete_speciality_query)

            delete_employee_count_query = text(f'''
                DELETE FROM Employee_Count WHERE company_id = {id}
                COMMIT;
            ''')
            connection.execute(delete_employee_count_query)
            delete_company_query = text(f'''
                DELETE FROM Company WHERE company_id = {id}
                COMMIT;
            ''')
            connection.execute(delete_company_query, {'company_id': id})

        return jsonify({
            "success": True,
            "message": "Company and related data deleted successfully"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_location(id):
    try:
        with engine.connect() as connection:
            query = text(f'DELETE FROM company_location WHERE company_id = {id} COMMIT;')
            connection.execute(query,)
        
        return jsonify({
            "success": True,
            "message": "Location deleted successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_industry(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            query = text(f'DELETE FROM Company_Has_Industry WHERE company_id = {id} AND industry_id ={data["industry_id"]} COMMIT;')
            connection.execute(query)

        return jsonify({
            "success": True,
            "message": "Industry deleted successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_speciality(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            query = text(f'DELETE FROM Company_Has_Speciality WHERE company_id = {id} AND speciality_id ={data["speciality_id"]} COMMIT;')
            connection.execute(query)

        return jsonify({
            "success": True,
            "message": "Speciality deleted successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_employee_count(id):
    try:
        data = request.get_json()
        with engine.connect() as connection:
            query = text(f'DELETE FROM Employee_Count WHERE company_id = {id} AND employee_count_id ={data["time_recorded"]} COMMIT;')
            connection.execute(query)

        return jsonify({
            "success": True,
            "message": "Employee count deleted successfully"
        })  
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})   
def delete_industry_by_industry_id(id):
    try:
        with engine.connect() as connection:
                
            query_1 = text(f'DELETE FROM Company_Has_Industry WHERE industry_id = {id} COMMIT;')
            connection.execute(query_1)

            query_2 = text(f'DELETE FROM Industry_Has_Industry_Name WHERE industry_id = {id} COMMIT;')
            connection.execute(query_2)

            return jsonify({
                "success": True,
                "message": "Industry deleted successfully"
            })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
def delete_speciality_by_speciality_id(id):
    try:
        with engine.connect() as connection:
            query_1 = text(f'DELETE FROM Company_Has_Speciality WHERE speciality_id = {id} COMMIT;')
            connection.execute(query_1)

            query_2 = text(f'DELETE FROM Company_Speciality WHERE speciality_id = {id} COMMIT;')
            connection.execute(query_2)

            return jsonify({
                "success": True,
                "message": "Speciality deleted successfully"
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

