import re
from flask import request, jsonify

def validate_company_data(func):
    def wrapper(*args, **kwargs):
        data = request.json
        errors = []
        
        company_id = data.get("company_id")
        if not company_id or (isinstance(company_id, str) and company_id.strip() == ""):
            errors.append("Company ID is required.")
        
        company_name = data.get("company_name")
        if not company_name or (isinstance(company_name, str) and company_name.strip() == ""):
            errors.append("Company name is required.")
        
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(*args, **kwargs)
    
    return wrapper
