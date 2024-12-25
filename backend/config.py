import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # Cấu hình kết nối SQL Server
    DB_SERVER = 'MSI'
    DB_DATABASE = 'test_2_ktdl'
    DB_USERNAME = 'sa'
    DB_PASSWORD = 'khaikhai'
    DB_DRIVER = 'ODBC Driver 17 for SQL Server'
    
    # Connection string
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}/{DB_DATABASE}"
        f"?driver={DB_DRIVER.replace(' ', '+')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False