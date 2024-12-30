from flask import Blueprint, jsonify, request
from app.models import db
from sqlalchemy import func
from app.models import db, Posting, PostingState, AdditionalInfo

dashboard_bp = Blueprint('dashboard', __name__)

# GET: /job_title_frequency_by_location - Phân tích tần suất việc làm theo vị trí
@dashboard_bp.route('/job_title_frequency_by_location', methods=['GET'])
def job_title_frequency_by_location():
    location = request.args.get('location')
    query = db.session.query(
        Posting.title,
        Posting.location,
        func.count().label('frequency')
    ).filter(Posting.location == location).group_by(
        Posting.title, Posting.location
    ).order_by(
        func.count().desc()
    ).limit(20).all()

    result = [{
        "title": row.title,
        "location": row.location,
        "frequency": row.frequency
    } for row in query]
    return jsonify(result)

# GET: /salary_distribution_by_location - Phân bố lương theo vị trí
@dashboard_bp.route('/salary_distribution_by_location', methods=['GET'])
def salary_distribution_by_location():
    query = db.session.query(
        Posting.location,
        Posting.pay_period,
        func.avg(Posting.min_salary).label('avg_min_salary'),
        func.avg(Posting.med_salary).label('avg_med_salary'),
        func.avg(Posting.max_salary).label('avg_max_salary')
    ).group_by(Posting.location, Posting.pay_period).all()

    result = [{
        "location": row.location,
        "pay_period": row.pay_period,
        "avg_min_salary": row.avg_min_salary,
        "avg_med_salary": row.avg_med_salary,
        "avg_max_salary": row.avg_max_salary
    } for row in query]
    return jsonify(result)