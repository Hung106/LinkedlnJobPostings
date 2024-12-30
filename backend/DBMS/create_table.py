import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# Cấu hình chuỗi kết nối SQL Server
connection_string = "mssql+pyodbc://ZRMR/DATH-KTDL?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(connection_string)

# Hàm thực thi các lệnh SQL từ file
def run_sql_file(filename, engine):
    try:
        # Mở và đọc nội dung file SQL
        with open(filename, 'r') as file:
            sql_commands = file.read().split(';')
            # Kết nối với cơ sở dữ liệu
            with engine.connect() as connection:
                # Lặp qua các câu lệnh SQL và thực thi
                for command in sql_commands:
                    if command.strip():
                        try:
                            connection.execute(command)
                            print(f"Thực thi lệnh SQL: {command}")
                        except SQLAlchemyError as err:
                            print(f"Đã xảy ra lỗi khi thực thi lệnh SQL: {err}")
    except Exception as e:
        print(f"Đã xảy ra lỗi khi mở file: {e}")

# Ví dụ sử dụng hàm để thực thi các câu lệnh SQL từ file
run_sql_file('your_sql_file.sql', engine)