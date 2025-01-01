from flask import Blueprint
from app.controllers import company_controller
from app.middlewares import company_middleware

#==================================================================================================#
#==================================Các routes cho company==========================================#
#==================================================================================================#
# GET: /company (GET tất cả company)
# GET: /company/id (GET company theo id)
# GET: /company/industries  (GET tất cả industries)
# GET: /company/specialities (GET tất cả specialities)
# GET: /company/industries/id (GET industries từ company_id)
# GET: /company/industry/id (GET industry theo industry_id)
# GET: /company/speciality/id (GET speciality theo company_id)
# GET: /company/location/id (GET location theo company_id)
# GET: /company/employee_count/id (GET employee_count theo company_id)

# POST: /company (POST company)
# POST: /company/location/id (POST location theo company_id)
# POST: /company/industry/id (POST industry theo company_id)
# POST: /company/speciality (POST speciality)
# POST: /company/employee_count/id (POST employee_count theo company_id)

# PUT: /company/id (PUT company theo id)
# PUT: /company/location/id (PUT location theo company_id)
# PUT: /company/industry/id (PUT industry theo company_id)
# PUT: /company/speciality/id (PUT speciality theo company_id)
# PUT: /company/employee_count/id (PUT employee_count theo company_id)

# DELETE: /company/id (DELETE company theo id)
# DELETE: /company/location/id (DELETE location theo company_id)
# DELETE: /company/industry/id (DELETE industry theo company_id)
# DELETE: /company/speciality/id (DELETE speciality theo company_id)
# DELETE: /company/employee_count/id (DELETE employee_count theo company_id)

# GET: /company/chart_company_postings/id (GET chart company_postings theo company_id)

company_routes = Blueprint('company_routes', __name__)

#=================================GET=================================#
company_routes.route('/', methods=['GET'])(company_controller.get_all_companies)
company_routes.route('/industries', methods=['GET'])(company_controller.get_all_industries)
company_routes.route('/specialities', methods=['GET'])(company_controller.get_all_specialities)
company_routes.route('/<id>', methods=['GET'])(company_controller.get_company_by_id)
company_routes.route('/industries/<id>', methods=['GET'])(company_controller.get_industries_by_company_id)
company_routes.route('/industry/<id>', methods=['GET'])(company_controller.get_industry_by_id)
company_routes.route('/speciality/<id>', methods=['GET'])(company_controller.get_speciality_by_id)
company_routes.route('/location/<id>', methods=['GET'])(company_controller.get_location_by_id)
company_routes.route('/employee_count/<id>', methods=['GET'])(company_controller.get_employee_count_by_id)

#=================================POST=================================#
@company_routes.route('/', methods=['POST'], endpoint='create_company')
@company_middleware.validate_company_data
def create_company_route():
    return company_controller.create_company()

@company_routes.route('/location/<id>', methods=['POST'], endpoint = 'create_location')
@company_middleware.validate_location_data
def create_location_route(id):
    return company_controller.create_location(id)

@company_routes.route('/industry/<int:id>', methods=['POST'], endpoint='create_industry')
@company_middleware.validate_industry_data
def create_industry_route(id):
    return company_controller.create_industry(id)

@company_routes.route('/speciality', methods=['POST'], endpoint='create_speciality')
@company_middleware.validate_speciality_data
def create_speciality_route():
    return company_controller.create_speciality()

@company_routes.route('/employee_count/<id>', methods=['POST'], endpoint='create_employee_count')
@company_middleware.validate_employee_count_data
def create_employee_count_route(id):
    return company_controller.create_employee_count(id)

#=================================PUT=================================#
@company_routes.route('/<id>', methods=['PUT'], endpoint='update_company')
@company_middleware.validate_update_company_data
def update_company_route(id):
    return company_controller.update_company(id)

@company_routes.route('/location/<id>', methods=['PUT'], endpoint='update_location')
@company_middleware.validate_location_data
def update_location_route(id):
    return company_controller.update_location(id)

@company_routes.route('/industry/<id>', methods=['PUT'] ,endpoint='update_industry')
@company_middleware.validate_industry_data
def update_industry_route(id):
    return company_controller.update_industry(id)

@company_routes.route('/speciality/<id>', methods=['PUT'] ,endpoint='update_speciality')
@company_middleware.validate_speciality_data
def update_speciality_route(id):
    return company_controller.update_speciality(id)

@company_routes.route('/employee_count/<id>', methods=['PUT'] ,endpoint='update_employee_count')
@company_middleware.validate_employee_count_data
def update_employee_count_route(id):
    return company_controller.update_employee_count(id)

#=================================DELETE=================================#
company_routes.route('/<id>', methods=['DELETE'])(company_controller.delete_company)
company_routes.route('/location/<id>', methods=['DELETE'])(company_controller.delete_location)
company_routes.route('/industry/<id>', methods=['DELETE'])(company_controller.delete_industry)
company_routes.route('/speciality/<id>', methods=['DELETE'])(company_controller.delete_speciality)
company_routes.route('/employee_count/<id>', methods=['DELETE'])(company_controller.delete_employee_count)
company_routes.route('/industry_by_id/<id>', methods=['DELETE'])(company_controller.delete_industry_by_industry_id)
company_routes.route('/speciality_by_id/<id>', methods=['DELETE'])(company_controller.delete_speciality_by_speciality_id)
#===================================CHART=================================#
company_routes.route('/chart_company_postings/<id>', methods=['GET'])(company_controller.get_chart_company_postings)    