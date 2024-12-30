from flask import Blueprint
from app.controllers import company_controller
from app.middlewares import company_middleware
# GET: /company
# GET: /company/id
# GET: /company/industries  
# GET: /company/specialities
# GET: /company/industries/id (GET industries từ company_id)
# GET: /company/industry/id (GET industry theo industry_id)
# GET: /company/speciality/id
# GET: /company/location/id
# GET: /company/employee_count/id

# POST: /company
# PUT: /company/id
# DELETE: /company/id

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
# company_routes.route('/<id>', methods=['PUT'])(company_controller.update_company)

#=================================DELETE=================================#
company_routes.route('/<id>', methods=['DELETE'])(company_controller.delete_company)



#===================================CHART=================================#
company_routes.route('/chart_company_postings/<id>', methods=['GET'])(company_controller.get_chart_company_postings)