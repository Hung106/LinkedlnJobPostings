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
# PUT: /company/id (PUT company theo id)
# PUT: /company/location/id (PUT location theo company_id)
# PUT: /company/industry/id (PUT industry theo company_id)
# PUT: /company/speciality/id (PUT speciality theo company_id)
# DELETE: /company/id (DELETE company theo id)
# GET: /company/chart_company_postings/id (GET chart company_postings theo company_id)

company_routes = Blueprint('company_routes', __name__)

#=================================GET=================================#
company_routes.route('/', methods=['GET'])(company_controller.get_all_companies)
company_routes.route('/industries', methods=['GET'])(company_controller.get_all_industries)
company_routes.route('/specialities', methods=['GET'])(company_controller.get_all_specialities)
company_routes.route('/<id>', methods=['GET'])(company_controller.get_company_by_id)
company_routes.route('/industries/<id>', methods=['GET'])(company_controller.get_industries_by_company_id)
company_routes.route('/industry/<id>', methods=['GET'])(company_controller.get_industry_by_id)
# company_routes.route('/speciality/<id>', methods=['GET'])(company_controller.get_speciality_by_id)
company_routes.route('/location/<id>', methods=['GET'])(company_controller.get_location_by_id)
company_routes.route('/employee_count/<id>', methods=['GET'])(company_controller.get_employee_count_by_id)

#=================================POST=================================#
@company_routes.route('/', methods=['POST'])
@company_middleware.validate_company_data
def create_company_route():
    return company_controller.create_company()
@company_routes.route('/location/<id>', methods=['POST'])
def create_location_route(id):
    return company_controller.create_location(id)
@company_routes.route('/industry/<id>', methods=['POST'])
def create_industry_route(id):
    return company_controller.create_industry(id)
# @company_routes.route('/speciality', methods=['POST'])(company_controller.create_speciality)
# def create_speciality_route():
#     return company_controller.create_speciality()
#=================================PUT=================================#
@company_routes.route('/<id>', methods=['PUT'])
def update_company_route(id):
    return company_controller.update_company(id)
@company_routes.route('/location/<id>', methods=['PUT'])
def update_location_route(id):
    return company_controller.update_location(id)
@company_routes.route('/industry/<id>', methods=['PUT'])
def update_industry_route(id):
    return company_controller.update_industry(id)
# @company_routes.route('/speciality/<id>', methods=['PUT'])
# def update_speciality_route(id):
#     return company_controller.update_speciality(id)
#=================================DELETE=================================#
company_routes.route('/<id>', methods=['DELETE'])(company_controller.delete_company)



#===================================CHART=================================#
company_routes.route('/chart_company_postings/<id>', methods=['GET'])(company_controller.get_chart_company_postings)    