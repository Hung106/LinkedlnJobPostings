from flask import Blueprint, jsonify, request
from app.models import db
from sqlalchemy import func
from app.models import db, Posting, PostingState, AdditionalInfo
from flask_cors import CORS
dashboard_bp = Blueprint('dashboard', __name__)

# GET: /job_title_frequency_by_location - Phân tích tần suất việc làm theo vị trí
@dashboard_bp.route('/job_title_frequency_by_location', methods=['GET'])
def job_title_frequency_by_location():
    location = request.args.get('location', '').strip()
    if not location:
        return jsonify({"error": "Location parameter is required"}), 400

    query = db.session.query(
        Posting.title,
        Posting.location,
        func.count().label('frequency')
    ).filter(Posting.location.ilike(f"%{location}%"))
    query = query.group_by(Posting.title, Posting.location) \
                 .order_by(func.count().desc()) \
                 .limit(20) \
                 .all()

    result = [{
        "title": row.title,
        "location": row.location,
        "frequency": row.frequency
    } for row in query]

    if not result:
        return jsonify({"message": "No job postings found for the given location"}), 404
    
    return jsonify(result)

# GET: /salary_distribution_by_location - Phân bố lương theo vị trí
from sqlalchemy import case, func

@dashboard_bp.route('/salary_distribution_by_location', methods=['GET'])
def salary_distribution_by_location():
    location = request.args.get('location', '').strip()

    if not location:
        print("Location is missing!")
        return jsonify({"error": "Location parameter is required"}), 400

    print(f"Location received: {location}")

    try:
        query = db.session.query(
            Posting.location,
            Salary.pay_period,
            func.avg(
                case(
                    (Salary_Type.salary_type == 'min', Salary_Type.value),
                    else_=None
                )
            ).label('avg_min_salary'),
            func.avg(
                case(
                    (Salary_Type.salary_type == 'med', Salary_Type.value),
                    else_=None
                )
            ).label('avg_med_salary'),
            func.avg(
                case(
                    (Salary_Type.salary_type == 'max', Salary_Type.value),
                    else_=None
                )
            ).label('avg_max_salary')
        ).join(Salary_Type, Salary.salary_id == Salary_Type.salary_id) \
         .filter(Posting.location.ilike(f"%{location}%")) \
         .group_by(Posting.location, Salary.pay_period) \
         .order_by(Posting.location) \
         .all()

        print("Query executed successfully.")
        result = [{
            "location": row.location,
            "pay_period": row.pay_period,
            "avg_min_salary": row.avg_min_salary,
            "avg_med_salary": row.avg_med_salary,
            "avg_max_salary": row.avg_max_salary
        } for row in query]

        if not result:
            print("No salary data found for the given location.")
            return jsonify({"message": "No salary data found for the given location"}), 404

        return jsonify(result)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500