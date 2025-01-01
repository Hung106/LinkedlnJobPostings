from flask import Blueprint, jsonify, request
from app.models import db, Posting, PostingState, AdditionalInfo
from flask_cors import CORS
posting_bp = Blueprint('posting', __name__)

# GET: /posting - Lấy danh sách bài đăng
@posting_bp.route('/posting', methods=['GET'])
def get_postings():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    try:
        pagination = Posting.query.order_by(Posting.posting_id).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            "postings": [posting.to_dict() for posting in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        })
    except Exception as e:
        print(f"Error in get_postings: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    
# GET: /posting_state - Lấy trạng thái bài đăng    
@posting_bp.route('/posting_state', methods=['GET'])
def get_posting_states():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    try:
        pagination = PostingState.query.order_by(PostingState.posting_state_id).paginate(page=page, per_page=per_page, error_out=False)
        
        if not pagination.items:
            return jsonify({"message": "No posting states found"}), 404

        states = [state.to_dict() if state else None for state in pagination.items]

        return jsonify({
            "states": states,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        })
    
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error in get_posting_states: {error_details}")
        return jsonify({"error": "An unexpected error occurred", "details": error_details}), 500

# GET: /additional_information - Lấy thông tin bổ sung
@posting_bp.route('/additional_information', methods=['GET'])
def get_additional_information():
    try:
        infos = AdditionalInfo.query.all()

        if not infos:
            return jsonify({
                "current_page": 1,
                "pages": 1,
                "total": 1,
                "additional_information": [None]
            }), 200

        return jsonify({
            "current_page": 1,
            "pages": 1,
            "total": len(infos),
            "additional_information": [info.to_dict() for info in infos]
        }), 200

    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error in get_additional_information: {error_details}")
        return jsonify({"error": "An unexpected error occurred", "details": error_details}), 500

# POST: /posting - Tạo bài đăng mới
@posting_bp.route('/posting', methods=['POST'])
def create_posting():
    data = request.json
    required_fields = ['title', 'location', 'company_id', 'job_id']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' is required"}), 400

    data.pop('posting_id', None)

    try:
        new_posting = Posting(**data)
        db.session.add(new_posting)
        db.session.commit()
        return jsonify({"message": "Posting created successfully", "posting": new_posting.to_dict()}), 201
    except Exception as e:
        print(f"Error while creating posting: {str(e)}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

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