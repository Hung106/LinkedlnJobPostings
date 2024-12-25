from flask import Flask
from flask_cors import CORS
from config import Config
from routes.company_routes import company_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)


    # Register blueprints
    # from .routes.job_routes import job_bp
    # from .routes.benefit_routes import benefit_bp
    # app.register_blueprint(job_bp, url_prefix='/api')
    # app.register_blueprint(benefit_bp, url_prefix='/api')
    app.register_blueprint(company_routes, url_prefix='/api/company')

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)