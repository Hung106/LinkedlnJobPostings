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
            query = text('SELECT * FROM Company_Industry')
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
                FROM Company_Industry i
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
def get_specialities_by_company_id(id):
    try:
        with engine.connect() as connection:
            query = text(f"""
                SELECT i.Company_id, si.Speciality_id, si.speciality
                FROM Company_Has_Speciality i
                JOIN Company_Speciality si ON si.Speciality_id = i.Speciality_id
                WHERE i.Company_id = {id}
            """)
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
        name = data['name']
        url = data['url']

        with engine.begin() as connection:  # Đảm bảo giao dịch được commit tự động
            # Kiểm tra xem company_id đã tồn tại chưa
            existing_company = connection.execute(
                text('SELECT 1 FROM Company WHERE company_id = :company_id'),
                {"company_id": company_id}
            ).fetchone()

            if existing_company:
                return jsonify({"success": False, "message": "Company ID already exists"}), 409

            # Thêm dữ liệu vào bảng Company
            query = text('''
                INSERT INTO Company (company_id, company_size, description, name, url) 
                VALUES (:company_id, :company_size, :description, :name, :url)
            ''')
            connection.execute(query, {
                "company_id": company_id,
                "company_size": company_size,
                "description": description,
                "name": name,
                "url": url
            })
            print("Inserted into Company table successfully")

            # Xử lý location nếu có
            if 'country' in data:
                location_query = text('''
                    INSERT INTO company_location (company_id, country, state, city, zip_code, number, street) 
                    VALUES (:company_id, :country, :state, :city, :zip_code, :number, :street)
                ''')
                connection.execute(location_query, {
                    "company_id": company_id,
                    "country": data.get('country'),
                    "state": data.get('state'),
                    "city": data.get('city'),
                    "zip_code": data.get('zip_code'),
                    "number": data.get('number'),
                    "street": data.get('street')
                })
                print("Inserted into company_location successfully")

            # Xử lý industry nếu có
            if 'industry_id' in data:
                industry_query = text('''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES (:company_id, :industry_id)
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
                result = connection.execute(get_industry_query, {"industry_name": industry_name}).fetchone()

                if result:
                    industry_id = result['industry_id']
                else:
                    insert_industry_query = text('''
                        INSERT INTO Industry_Has_Industry_Name (industry_name) 
                        VALUES (:industry_name)
                    ''')
                    connection.execute(insert_industry_query, {"industry_name": industry_name})

                    # Lấy industry_id vừa thêm
                    result = connection.execute(get_industry_query, {"industry_name": industry_name}).fetchone()
                    industry_id = result['industry_id']

                industry_insert_query = text('''
                    INSERT INTO Company_Has_Industry (company_id, industry_id) 
                    VALUES (:company_id, :industry_id)
                ''')
                connection.execute(industry_insert_query, {
                    "company_id": company_id,
                    "industry_id": industry_id
                })
                print("Inserted into Company_Has_Industry successfully")

            # Xử lý employee_count nếu có
            if 'employee_count' in data:
                employee_count_query = text('''
                    INSERT INTO Employee_Count (Company_id, Employee_count, Follower_count, Time_recoded)
                    VALUES (:company_id, :employee_count, :follower_count, CURRENT_TIMESTAMP)
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
        print("General Error:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500
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

        company_size = data.get('company_size')
        description = data.get('description')
        name = data.get('name')
        url = data.get('url')

        # Cập nhật bảng Company
        if any([company_size, description, name, url]):
            update_query = text('''
                UPDATE Company
                SET company_size = :company_size,
                    description = :description,
                    name = :name,
                    url = :url
                WHERE company_id = :company_id
            ''')
            with engine.begin() as connection:
                connection.execute(update_query, {
                    "company_size": company_size,
                    "description": description,
                    "name": name,
                    "url": url,
                    "company_id": id
                })

        # Cập nhật bảng company_location
        if 'country' in data:
            location_update_query = text('''
                UPDATE company_location
                SET country = :country,
                    state = :state,
                    city = :city,
                    zip_code = :zip_code,
                    number = :number,
                    street = :street
                WHERE company_id = :company_id
            ''')
            with engine.begin() as connection:
                connection.execute(location_update_query, {
                    "country": data.get('country'),
                    "state": data.get('state'),
                    "city": data.get('city'),
                    "zip_code": data.get('zip_code'),
                    "number": data.get('number'),
                    "street": data.get('street'),
                    "company_id": id
                })

        # Cập nhật bảng Company_Has_Industry
        if 'industry_id' in data:
            industry_update_query = text('''
                UPDATE Company_Has_Industry
                SET industry_id = :industry_id
                WHERE company_id = :company_id
            ''')
            with engine.begin() as connection:
                connection.execute(industry_update_query, {
                    "industry_id": data['industry_id'],
                    "company_id": id
                })

        elif 'industry_name' in data:
            get_industry_query = text('''
                SELECT industry_id FROM Industry_Has_Industry_Name
                WHERE industry_name = :industry_name
            ''')
            with engine.begin() as connection:
                result = connection.execute(get_industry_query, {
                    "industry_name": data['industry_name']
                }).fetchone()

            if result:
                industry_id = result['industry_id']
            else:
                insert_industry_query = text('''
                    INSERT INTO Industry_Has_Industry_Name (industry_name)
                    VALUES (:industry_name)
                ''')
                with engine.begin() as connection:
                    connection.execute(insert_industry_query, {
                        "industry_name": data['industry_name']
                    })

                with engine.begin() as connection:
                    industry_id = connection.execute(get_industry_query, {
                        "industry_name": data['industry_name']
                    }).fetchone()['industry_id']

            industry_insert_query = text('''
                UPDATE Company_Has_Industry
                SET industry_id = :industry_id
                WHERE company_id = :company_id
            ''')
            with engine.begin() as connection:
                connection.execute(industry_insert_query, {
                    "industry_id": industry_id,
                    "company_id": id
                })

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
        # Sử dụng transaction để đảm bảo các thay đổi được commit hoặc rollback
        with engine.begin() as connection:
            # Xóa các bản ghi liên quan trong bảng phụ
            delete_industry_query = text('''
                DELETE FROM Company_Has_Industry WHERE company_id = :company_id
            ''')
            connection.execute(delete_industry_query, {'company_id': id})

            delete_location_query = text('''
                DELETE FROM company_location WHERE company_id = :company_id
            ''')
            connection.execute(delete_location_query, {'company_id': id})

            # Xóa bản ghi trong bảng chính
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

