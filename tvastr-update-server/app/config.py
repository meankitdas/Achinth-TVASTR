"""Environment configuration — loaded from .env file."""
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
STORAGE_BUCKET: str = "updates"
SIGNED_URL_EXPIRY: int = 3600  # 1 hour — supports large file downloads (3GB+)
