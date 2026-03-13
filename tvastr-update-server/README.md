# Tvastr Update Server

FastAPI backend that validates license keys and serves signed download URLs for Tvastr factory AI systems.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/check-update` | Check for newer version |
| GET | `/api/download/{product}/{version}` | Generate signed download URL |
| GET | `/docs` | Interactive API docs (Swagger) |

### `GET /api/check-update`

```
?product=Rejection Analysis System
&version=1.2.0
&license_key=TVASTR-RAS-DEMO-001
```

**Response (update available):**
```json
{
  "update_available": true,
  "latest_version": "1.3.0",
  "release_date": "2025-03-01",
  "changelog": "Defect classifier accuracy +8%...",
  "download_url": "https://...signed-url...",
  "checksum": "sha256..."
}
```

### `GET /api/download/{product}/{version}`

```
/api/download/Rejection Analysis System/1.3.0?license_key=TVASTR-RAS-DEMO-001
```

**Response:**
```json
{
  "product": "Rejection Analysis System",
  "version": "1.3.0",
  "download_url": "https://...signed-url...",
  "checksum": null,
  "expires_in_seconds": 60
}
```

## Setup

### 1. Create virtual environment

```bash
cd tvastr-update-server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get `SUPABASE_SERVICE_ROLE_KEY` from:
Supabase Dashboard → Project Settings → API → service_role key

### 3. Run locally

```bash
uvicorn app.main:app --reload --port 8000
```

API available at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

## Adding a new product version

1. Upload the installer zip to Supabase Storage → bucket `updates`:
   - Path: `{product-folder}/{version}.zip`
   - Example: `rejection-analysis-system/1.4.0.zip`

2. Insert a row into the `versions` table:
```sql
insert into versions (product_id, version_number, release_date, changelog, file_path, checksum)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '1.4.0',
  '2025-06-01',
  'Your changelog here.',
  'rejection-analysis-system/1.4.0.zip',
  null  -- optional sha256
);
```

## Deployment

Deploy to any platform that supports Python:
- **Railway**: Connect repo, set env vars, deploy
- **Render**: Web service, Python, set env vars
- **Docker**: `docker build -t tvastr-update-server . && docker run -p 8000:8000`

Set `allow_origins` in `app/main.py` to your frontend domain before deploying to production.
