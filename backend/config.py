import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # Cấu hình kết nối SQL Server
    DB_SERVER = 'localhost'
    DB_DATABASE = 'linkedln_job_posting'
    DB_USERNAME = 'posting'
    DB_PASSWORD = 'posting'
    DB_DRIVER = 'ODBC Driver 17 for SQL Server'
    
    # Connection string
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}/{DB_DATABASE}"
        f"?driver={DB_DRIVER.replace(' ', '+')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
