import re
from flask import request, jsonify

# Hàm validate dữ liệu của company khi tạo mới 
def validate_company_data(func):
    def wrapper(*args, **kwargs):
        data = request.json
        errors = []

        # Kiểm tra company_id
        company_id = data.get("company_id")
        if not company_id or (isinstance(company_id, str) and company_id.strip() == ""):
            errors.append("Company ID is required.")

        # Kiểm tra và chuẩn hóa company_name
        name = data.get("name")
        if not name or (isinstance(name, str) and name.strip() == ""):
            errors.append("Company name is required.")
        else:
            name = re.sub(r"[^a-zA-Z0-9 &\-|]", "", name)
            name = re.sub(r"\s+", " ", name).strip()
            data["name"] = name

        # KIểm tra và làm sạch description
        description = data.get("description")
        if description:
            description = re.sub(r"[\n\r\t]", " ", description)
            description = re.sub(r"\s+", " ", description).strip()
            data["description"] = description

        # Kiểm tra URL
        url = data.get("company_url")
        if url:
            url_pattern = re.compile(
                r"^(https?://)?([\da-z.-]+)\.([a-z.]{2,6})([/?].*)?$", re.IGNORECASE
            )
            if not url_pattern.match(url):
                errors.append("Invalid URL format.")
        
        # Kiểm tra và chuẩn hóa location
        state = data.get("state")
        if state:
            state = state.strip().upper()
            if len(state) != 2 and not re.match(r"[A-Za-z]+", state):
                errors.append("State contains invalid characters or format.")
        
        country = data.get("country")
        if country:
            errors.append("Country is required and must be in ISO 2-letter format.")
        
        city = data.get("city")
        if city:
            city = re.sub(r"[^A-Za-z\s,/-]", "", city.strip())
            if not city:
                errors.append("City contains invalid characters or is empty.")
        
        zip_code = data.get("zip_code")
        if zip_code:
            if not re.match(r"^[A-Za-z0-9\s-]+$", zip_code.strip()):
                errors.append("Zip code is invalid.")
        
        number = data.get("number")
        if number:
            if not re.match(r"^\d+(-\d+)*$", number.strip()):
                errors.append("Number (street number) is invalid.")
        
        street = data.get("street")
        if street:
            if not re.match(r"[A-Za-z0-9\s,:\-+]+", street.strip()):
                errors.append("Street name contains invalid characters.")
        
        # Kiểm tra và chuẩn hóa industry_name
        industry_name = data.get("industry_name")
        if industry_name:
            if not re.match(r"^[A-Za-z0-9\s,:\-]+$", industry_name.strip()):
                errors.append("Industry name contains invalid characters.")
        
        # Kiểm tra và chuẩn hóa speciality
        speciality = data.get("speciality")
        if speciality:
            speciality = re.sub(r"[^a-zA-Z0-9,;/&\s]", "", speciality)
            speciality = re.sub(r"\s+", " ", speciality).strip()
            data["speciality"] = speciality
        
        # Kiểm tra follower_count và employee_count
        follower_count = data.get("follower_count")
        employee_count = data.get("employee_count")

        if (follower_count or employee_count) and not (follower_count and employee_count):
            errors.append("both must exist.")
    
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(*args, **kwargs)

    return wrapper

# Hàm validate location_id khi tạo mới
def validate_location_data(func):
    def wrapper(id, *args, **kwargs):
        data = request.json
        errors = []
        
        state = data.get("state")
        if state:
            state = state.strip().upper()
            if len(state) != 2 and not re.match(r"[A-Za-z]+", state):
                errors.append("State contains invalid characters or format.")
        
        country = data.get("country")
        if not country or not re.match(r"^[A-Z]{2}$", country.strip()):
            errors.append("Country is required and must be in ISO 2-letter format.")
        
        city = data.get("city")
        if city:
            city = re.sub(r"[^A-Za-z\s,/-]", "", city.strip())
            if not city:
                errors.append("City contains invalid characters or is empty.")
        
        zip_code = data.get("zip_code")
        if zip_code:
            if not re.match(r"^[A-Za-z0-9\s-]+$", zip_code.strip()):
                errors.append("Zip code is invalid.")
        
        number = data.get("number")
        if number:
            if not re.match(r"^\d+(-\d+)*$", number.strip()):
                errors.append("Number (street number) is invalid.")
        
        street = data.get("street")
        if street:
            if not re.match(r"[A-Za-z0-9\s,:\-+]+", street.strip()):
                errors.append("Street name contains invalid characters.")
        
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(id, *args, **kwargs)
    return wrapper

# Hàm validate industry_id khi tạo mới
def validate_industry_data(func):
    def wrapper(id, *args, **kwargs):
        data = request.json
        errors = []
        industry_id = data.get("industry_id")
        industry_name = data.get("industry_name")

        if not industry_id and not industry_name:
            errors.append("At least one of 'industry_id' or 'industry_name' is required.")

        if industry_name:
            if not re.match(r"^[A-Za-z0-9\s,:\-]+$", industry_name.strip()):
                errors.append("Industry name contains invalid characters.")

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(id, *args, **kwargs)
    return wrapper

# Hàm validate speciality_id khi tạo mới
def validate_speciality_data(func):
    def wrapper(id, *args, **kwargs):
        data = request.json
        errors = []

        speciality_id = data.get("speciality_id")
        speciality = data.get("speciality")

        if not speciality_id and not speciality:
            errors.append("At least one of 'speciality_id' or 'speciality' is required.")

        if speciality:
            speciality = re.sub(r"[^a-zA-Z0-9,;/&\s]", "", speciality)
            data["speciality"] = speciality

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(id, *args, **kwargs)
    return wrapper

# Hàm validate employee_count_id khi tạo mới
def validate_employee_count_data(func):
    def wrapper(id, *args, **kwargs):
        data = request.json
        errors = []
        
        follower_count = data.get("follower_count")
        employee_count = data.get("employee_count")

        if not follower_count or not employee_count:
            errors.append("Both 'follower_count' and 'employee_count' are required.")

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(id, *args, **kwargs)
    return wrapper

# Hàm validate dữ liệu khi update company
def validate_update_company_data(func):
    def wrapper(*args, **kwargs):
        data = request.json
        errors = []

        #Chuẩn hóa company_name
        name = data.get("name")
        if name:
            name = re.sub(r"[^a-zA-Z0-9 &\-|]", "", name)
            name = re.sub(r"\s+", " ", name).strip()
            data["name"] = name

        #Làm sạch description
        description = data.get("description")
        if description:
            description = re.sub(r"[\n\r\t]", " ", description)
            description = re.sub(r"\s+", " ", description).strip()
            data["description"] = description

        # Kiểm tra URL
        url = data.get("company_url")
        if url:
            url_pattern = re.compile(
                r"^(https?://)?([\da-z.-]+)\.([a-z.]{2,6})([/?].*)?$", re.IGNORECASE
            )
            if not url_pattern.match(url):
                errors.append("Invalid URL format.")
        
        # Kiểm tra và chuẩn hóa location
        state = data.get("state")
        if state:
            state = state.strip().upper()
            if len(state) != 2 and not re.match(r"[A-Za-z]+", state):
                errors.append("State contains invalid characters or format.")
        
        country = data.get("country")
        if country:
            errors.append("Country is required and must be in ISO 2-letter format.")
        
        city = data.get("city")
        if city:
            city = re.sub(r"[^A-Za-z\s,/-]", "", city.strip())
            if not city:
                errors.append("City contains invalid characters or is empty.")
        
        zip_code = data.get("zip_code")
        if zip_code:
            if not re.match(r"^[A-Za-z0-9\s-]+$", zip_code.strip()):
                errors.append("Zip code is invalid.")
        
        number = data.get("number")
        if number:
            if not re.match(r"^\d+(-\d+)*$", number.strip()):
                errors.append("Number (street number) is invalid.")
        
        street = data.get("street")
        if street:
            if not re.match(r"[A-Za-z0-9\s,:\-+]+", street.strip()):
                errors.append("Street name contains invalid characters.")
        
        # Kiểm tra và chuẩn hóa industry_name
        industry_name = data.get("industry_name")
        if industry_name:
            if not re.match(r"^[A-Za-z0-9\s,:\-]+$", industry_name.strip()):
                errors.append("Industry name contains invalid characters.")
        
        # Kiểm tra và chuẩn hóa speciality
        speciality = data.get("speciality")
        if speciality:
            speciality = re.sub(r"[^a-zA-Z0-9,;/&\s]", "", speciality)
            speciality = re.sub(r"\s+", " ", speciality).strip()
            data["speciality"] = speciality
        
        # Kiểm tra follower_count và employee_count
        follower_count = data.get("follower_count")
        employee_count = data.get("employee_count")

        if (follower_count or employee_count) and not (follower_count and employee_count):
            errors.append("both must exist.")
    
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        return func(*args, **kwargs)

    return wrapper