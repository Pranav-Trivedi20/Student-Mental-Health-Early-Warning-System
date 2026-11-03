import os 
from dotenv import load_dotenv

load_dotenv()
DATABASE_CONNECTION_URL = os.getenv("DATABASE_URL")