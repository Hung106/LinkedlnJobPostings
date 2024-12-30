import time
import random

def generate_unique_id():
    """
    Tạo một ID duy nhất dựa trên thời gian hiện tại và một số ngẫu nhiên.
    """
    return f"{int((time.time() * 1000 + random.randint(1000, 9999)) / 10000)}"