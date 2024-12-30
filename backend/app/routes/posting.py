from flask import Blueprint, jsonify, request
from app.models import db, Posting, PostingState, AdditionalInfo

posting_bp = Blueprint('posting', __name__)

# POST: /posting - Tạo bài đăng mới
@posting_bp.route('/posting', methods=['POST'])
def create_posting():
    data = request.json
    required_fields = ['title', 'location', 'company_id', 'job_id']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' is required"}), 400

    new_posting = Posting(**data)
    db.session.add(new_posting)
    db.session.commit()
    return jsonify({"message": "Posting created successfully", "posting": new_posting.to_dict()}), 201

# GET: /posting - Lấy danh sách bài đăng
@posting_bp.route('/posting', methods=['GET'])
def get_postings():
    postings = Posting.query.all()
    return jsonify([posting.to_dict() for posting in postings])

# GET: /posting_state - Lấy trạng thái bài đăng
@posting_bp.route('/posting_state', methods=['GET'])
def get_posting_states():
    states = PostingState.query.all()
    return jsonify([state.to_dict() for state in states])

# GET: /additional_information - Lấy thông tin bổ sung
@posting_bp.route('/additional_information', methods=['GET'])
def get_additional_information():
    infos = AdditionalInfo.query.all()
    return jsonify([info.to_dict() for info in infos])

# PUT: /posting/{id} - Cập nhật bài đăng
@posting_bp.route('/posting/<int:id>', methods=['PUT'])
def update_posting(id):
    data = request.json
    posting = Posting.query.get_or_404(id)
    for key, value in data.items():
        setattr(posting, key, value)
    db.session.commit()
    return jsonify({"message": "Posting updated successfully", "posting": posting.to_dict()})

# DELETE: /posting/{id} - Xóa bài đăng
@posting_bp.route('/posting/<int:id>', methods=['DELETE'])
def delete_posting(id):
    posting = Posting.query.get_or_404(id)
    db.session.delete(posting)
    db.session.commit()
    return jsonify({"message": "Posting deleted successfully"})