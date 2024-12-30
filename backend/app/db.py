from sqlalchemy import create_engine
from config import Config

# Khởi tạo engine một lần và sử dụng lại
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)