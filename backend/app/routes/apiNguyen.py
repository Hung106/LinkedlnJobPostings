from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from sqlalchemy import create_engine, text
from collections import Counter
import re
import os
import time
import random

from dotenv import load_dotenv
load_dotenv() 

# # Khởi tạo kết nối SQLAlchemy
# connection_string = "mssql+pyodbc://@localhost/linkedin job postings?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes&Trusted_Connection=yes"
from config import Config

# Khởi tạo engine một lần và sử dụng lại
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)


# app_bp = Flask(__name__)
# CORS(app)

GN_bp = Blueprint('apiNguyen', __name__)

def generate_unique_id():
    return f"{int( (time.time() * 1000 + random.randint(1000, 9999))/10000 )}"


# Hàm để thực hiện một truy vấn mẫu
@GN_bp.route('/job', methods=['GET'])
def job():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("""
                SELECT TOP 100 
                    A.job_id, 
                    A.job_description, 
                    C.inferred, 
                    D.benefit_type_id, 
                    L.type, 
                    H.industry_id, 
                    H.industry_name,
                    F.skill_abr, 
                    F.skill_name,
                    K.salary_type,
                    K.value,
                    J.currency,
                    J.pay_period
                FROM Job A
                JOIN Job_Has_Benefit B ON A.job_id = B.job_id
                JOIN Benefit C ON B.benefit_id = C.benefit_id
                JOIN Benefit_Has_Benefit_Type D ON C.benefit_id = D.benefit_id
                JOIN Benefit_Type L on D.benefit_type_id = L.benefit_type_id
                JOIN Requires E ON A.job_id = E.job_id
                JOIN Skill F ON E.skill_abr = F.skill_abr
                JOIN Job_Has_Industry G ON A.job_id = G.job_id
                JOIN Company_Industry H ON G.industry_id = H.industry_id
                JOIN Salary J ON A.job_id = J.job_id
                JOIN Salary_Type K ON J.salary_id = K.salary_id;
            """))
            rows = [dict(row._mapping) for row in result]
            return jsonify(
                {
                    "success": True,
                    "data": rows
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )
        
@GN_bp.route('/add_job', methods=['POST'])
def add_job():
    try:
        # Lấy dữ liệu từ request (ví dụ, dữ liệu được gửi theo định dạng JSON)
        job_data = request.get_json()

        # Dữ liệu cho bảng Job
        job_id = generate_unique_id() ###
        job_description = job_data['job_description']
        
        benefit_id = generate_unique_id() ###
        inferred = job_data['inferred']
        benefit_type_id = job_data['benefit_type_id']
        
        skill_abr = job_data['skill_abr']
        
        industry_id = job_data['industry_id']
        
        currency = job_data['currency']
        pay_period = job_data['pay_period']
        
        salary_id = generate_unique_id()###
        salary_type = job_data['salary_type']
        value = job_data['value']
        #test = job_data['test']
        

        
        with engine.connect() as connection:
            # Thêm dữ liệu vào bảng Job
            with connection.begin():
                connection.execute(text("""
                    INSERT INTO Job (job_id, job_description) VALUES (:job_id, :job_description)
                """), {'job_id': job_id, 'job_description': job_description})
                
              
                
                connection.execute(text("""
                    INSERT INTO Benefit (benefit_id, inferred) VALUES (:benefit_id, :inferred)
                """), {'benefit_id': benefit_id, 'inferred': inferred})
                  # Thêm dữ liệu vào bảng Benefit
                connection.execute(text("""
                    INSERT INTO Job_Has_Benefit (job_id, benefit_id) VALUES (:job_id, :benefit_id)
                """), {'job_id': job_id, 'benefit_id': benefit_id})
                connection.execute(text("""
                    INSERT INTO Benefit_Has_Benefit_Type (benefit_id, benefit_type_id) VALUES (:benefit_id, :benefit_type_id)
                """), {'benefit_id': benefit_id, 'benefit_type_id': benefit_type_id})
                
                
                connection.execute(text("""
                    INSERT INTO Requires (job_id, skill_abr) VALUES (:job_id, :skill_abr)
                """), {'job_id': job_id, 'skill_abr': skill_abr})
                
                
                connection.execute(text("""
                    INSERT INTO Job_Has_Industry (job_id, industry_id) VALUES (:job_id, :industry_id)
                """), {'job_id': job_id, 'industry_id': industry_id})
                
                
                connection.execute(text("""
                    INSERT INTO Salary (salary_id, job_id, currency, pay_period) VALUES (:salary_id, :job_id, :currency, :pay_period)
                """), {'salary_id': salary_id, 'job_id': job_id, 'currency': currency, 'pay_period': pay_period})
                
                
                connection.execute(text("""
                    INSERT INTO Salary_Type (salary_id, salary_type, value) VALUES (:salary_id, :salary_type, :value)
                """), {'salary_id': salary_id, 'salary_type': salary_type, 'value': value})
                
        
        return jsonify({
            "success": True,
            "message": "Job created successfully"
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
        
@GN_bp.route('/update_job/<job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        # Lấy dữ liệu từ request (JSON)
        update_data = request.get_json()

        # Tạo câu lệnh SQL động để cập nhật các trường chỉ định
        with engine.connect() as connection:
            with connection.begin():
                # Cập nhật trường `job_description` nếu có
                if "job_description" in update_data:
                    connection.execute(text("""
                        UPDATE Job SET job_description = :job_description WHERE job_id = :job_id
                    """), {'job_description': update_data['job_description'], 'job_id': job_id})
                
                # Cập nhật bảng Benefit nếu có trường `inferred`
                if "inferred" in update_data:
                    connection.execute(text("""
                        UPDATE Benefit
                        SET inferred = :inferred
                        WHERE benefit_id = (
                            SELECT benefit_id FROM Job_Has_Benefit WHERE job_id = :job_id
                        )
                    """), {'inferred': update_data['inferred'], 'job_id': job_id})

                # Cập nhật bảng Benefit_Has_Benefit_Type nếu có `benefit_type_id`
                if "benefit_type_id" in update_data:
                    connection.execute(text("""
                        UPDATE Benefit_Has_Benefit_Type
                        SET benefit_type_id = :benefit_type_id
                        WHERE benefit_id = (
                            SELECT benefit_id FROM Job_Has_Benefit WHERE job_id = :job_id
                        )
                    """), {'benefit_type_id': update_data['benefit_type_id'], 'job_id': job_id})

                # Cập nhật bảng Requires nếu có `skill_abr`
                if "skill_abr" in update_data:
                    connection.execute(text("""
                        UPDATE Requires SET skill_abr = :skill_abr WHERE job_id = :job_id
                    """), {'skill_abr': update_data['skill_abr'], 'job_id': job_id})

                # Cập nhật bảng Job_Has_Industry nếu có `industry_id`
                if "industry_id" in update_data:
                    connection.execute(text("""
                        UPDATE Job_Has_Industry
                        SET industry_id = :industry_id
                        WHERE job_id = :job_id
                    """), {'industry_id': update_data['industry_id'], 'job_id': job_id})

                # Cập nhật bảng Salary nếu có `currency` hoặc `pay_period`
                if "currency" in update_data or "pay_period" in update_data:
                    params = {'job_id': job_id}
                    set_clauses = []
                    if "currency" in update_data:
                        set_clauses.append("currency = :currency")
                        params['currency'] = update_data['currency']
                    if "pay_period" in update_data:
                        set_clauses.append("pay_period = :pay_period")
                        params['pay_period'] = update_data['pay_period']

                    set_clause = ", ".join(set_clauses)
                    connection.execute(text(f"""
                        UPDATE Salary SET {set_clause} WHERE job_id = :job_id
                    """), params)

                # Cập nhật bảng Salary_Type nếu có `salary_type` hoặc `value`
                if "salary_type" in update_data or "value" in update_data:
                    params = {'job_id': job_id}
                    set_clauses = []
                    if "salary_type" in update_data:
                        set_clauses.append("salary_type = :salary_type")
                        params['salary_type'] = update_data['salary_type']
                    if "value" in update_data:
                        set_clauses.append("value = :value")
                        params['value'] = update_data['value']

                    set_clause = ", ".join(set_clauses)
                    connection.execute(text(f"""
                        UPDATE Salary_Type
                        SET {set_clause}
                        WHERE salary_id = (
                            SELECT salary_id FROM Salary WHERE job_id = :job_id
                        )
                    """), params)

        return jsonify({
            "success": True,
            "message": f"Job with job_id {job_id} updated successfully"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

@GN_bp.route('/delete_job/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        # Xóa dữ liệu từ các bảng liên quan trước khi xóa bản ghi trong bảng Job
        with engine.connect() as connection:
            with connection.begin():
                # Xóa từ bảng Job_Has_Benefit
                connection.execute(text("""
                    DELETE FROM Job_Has_Benefit WHERE job_id = :job_id
                """), {'job_id': job_id})

                # Xóa từ bảng Benefit_Has_Benefit_Type
                connection.execute(text("""
                    DELETE FROM Benefit_Has_Benefit_Type WHERE benefit_id IN (
                        SELECT benefit_id FROM Job_Has_Benefit WHERE job_id = :job_id
                    )
                """), {'job_id': job_id})

                # Xóa từ bảng Requires
                connection.execute(text("""
                    DELETE FROM Requires WHERE job_id = :job_id
                """), {'job_id': job_id})

                # Xóa từ bảng Job_Has_Industry
                connection.execute(text("""
                    DELETE FROM Job_Has_Industry WHERE job_id = :job_id
                """), {'job_id': job_id})

                # Xóa từ bảng Salary_Type
                connection.execute(text("""
                    DELETE FROM Salary_Type WHERE salary_id IN (
                        SELECT salary_id FROM Salary WHERE job_id = :job_id
                    )
                """), {'job_id': job_id})

                # Xóa từ bảng Salary
                connection.execute(text("""
                    DELETE FROM Salary WHERE job_id = :job_id
                """), {'job_id': job_id})

                # Cuối cùng, xóa từ bảng Job
                connection.execute(text("""
                    DELETE FROM Job WHERE job_id = :job_id
                """), {'job_id': job_id})

        return jsonify({
            "success": True,
            "message": f"Job with job_id {job_id} deleted successfully"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@GN_bp.route('/benefit', methods=['GET'])
def benefit():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("SELECT TOP 100 * FROM Benefit_Type"))
            rows = [dict(row._mapping) for row in result]
            return jsonify(
                {
                    "success": True,
                    "data": rows
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )
        
        
@GN_bp.route('/industry', methods=['GET'])
def industry():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("SELECT TOP 100 * FROM Company_Industry"))
            rows = [dict(row._mapping) for row in result]
            return jsonify(
                {
                    "success": True,
                    "data": rows
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )
        
@GN_bp.route('/skill', methods=['GET'])
def skill():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("SELECT TOP 100 * FROM Skill"))
            rows = [dict(row._mapping) for row in result]
            return jsonify(
                {
                    "success": True,
                    "data": rows
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )


@GN_bp.route('/worktype_count', methods=['GET'])
def worktype_count():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("SELECT formatted_worktype, count(*) as count FROM posting GROUP BY formatted_worktype"))
            rows = [dict(row._mapping) for row in result]
            return jsonify(
                {
                    "success": True,
                    "data": rows
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )
        
@GN_bp.route('/posting_title', methods=['GET'])
def posting_title():
    try:
        with engine.connect() as connection:
            # Truy vấn mẫu để lấy danh sách bảng
            result = connection.execute(text("SELECT TOP 3000 title FROM posting"))
            rows = [dict(row._mapping) for row in result]
            
            titles = [job["title"].replace("\r\n", "").strip() for job in rows]
            stopwords = {"or", "and", "else", "the", "in", "on", "at", "for", "to", "a", "an", "of", "with"}
            words = []
            for title in titles:
                for word in re.findall(r'\b\w+\b', title.lower()):
                    if word not in stopwords:
                        words.append(word)

            word_counts = Counter(words)

            top_keywords = word_counts.most_common(15)
            
            return jsonify(
                {
                    "success": True,
                    "data": top_keywords
                }
            )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )
        
        
# # Hàm thêm dữ liệu
# @app.route('/insert', methods=['POST'])
# def insert_data():
#     data = request.json
#     try:
#         with engine.connect() as connection:
#             # Thực thi câu lệnh INSERT
#             query = text("INSERT INTO Company (company_id, company_size, description, company_name, company_url) VALUES (:company_id, :company_size, :description, :company_name, :company_url)")
#             connection.execute(query, **data)
#             return jsonify({"message": "Dữ liệu đã được thêm thành công!"})
#     except Exception as e:
#         return jsonify({"message": "Đã xảy ra lỗi", "error": str(e)})

# # Hàm cập nhật dữ liệu
# @app.route('/update', methods=['PUT'])
# def update_data():
#     data = request.json
#     try:
#         with engine.connect() as connection:
#             # Thực thi câu lệnh UPDATE
#             query = text("UPDATE Company SET company_size = :company_size WHERE company_id = :company_id")
#             connection.execute(query, **data)
#             return jsonify({"message": "Dữ liệu đã được cập nhật thành công!"})
#     except Exception as e:
#         return jsonify({"message": "Đã xảy ra lỗi", "error": str(e)})

# # Hàm xóa dữ liệu
# @app.route('/delete', methods=['DELETE'])
# def delete_data():
#     data = request.json
#     try:
#         with engine.connect() as connection:
#             # Thực thi câu lệnh DELETE
#             query = text("DELETE FROM Company WHERE company_id = :company_id")
#             connection.execute(query, company_id=data['company_id'])
#             return jsonify({"message": "Dữ liệu đã được xóa thành công!"})
#     except Exception as e:
#         return jsonify({"message": "Đã xảy ra lỗi", "error": str(e)})

# if __name__ == "__main__":
#     app.debug = True
#     app.run()
