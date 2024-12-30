import os

class Config:
    # Lấy chuỗi kết nối từ biến môi trường DATABASE_URI, nếu không có, dùng giá trị mặc định
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URI",  # Tên biến môi trường
        "mssql+pyodbc://@localhost/linkedin job postings?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes&Trusted_Connection=yes"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
