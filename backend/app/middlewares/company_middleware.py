import re
from flask import request, jsonify

def validate_company_data(func):
    def wrapper(*args, **kwargs):
        data = request.json
        errors = []
        
        company_id = data.get("company_id")
        if not company_id or (isinstance(company_id, str) and company_id.strip() == ""):
            errors.append("Company ID is required.")
        
        name = data.get("name")
        if not name or (isinstance(name, str) and name.strip() == ""):
            errors.append("Company name is required.")
        
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(*args, **kwargs)
    
    return wrapper
