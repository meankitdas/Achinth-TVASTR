# Cline Prompt: Update Server S3 Configuration

## Context
The tvastr-update-server already has S3 integration via boto3. We need to:
1. Increase the signed URL expiry time to support large file downloads (3GB installers)
2. Ensure the S3 bucket name is configurable (installers may be in a different bucket than other files, but using the same IAM user credentials)

## Task

Navigate to the `tvastr-update-server` directory and make the following changes:

### 1. Update `app/config.py`
Change the `SIGNED_URL_EXPIRY` from 60 seconds to 3600 seconds (1 hour):

```python
SIGNED_URL_EXPIRY = 3600  # Changed from 60 to support large file downloads
```

### 2. Verify S3 Bucket Configuration
Ensure that `app/config.py` loads the `S3_BUCKET_NAME` from environment variables. It should already have:

```python
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
```

This allows different buckets to be specified in `.env` while using the same AWS credentials.

### 3. Update `.env.example` (if needed)
Make sure `.env.example` in the update server directory documents the S3 bucket name clearly:

```
# AWS S3 Configuration (same IAM user can access multiple buckets)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-installer-bucket-name
```

### 4. Verify `app/services/version_service.py` or `app/s3.py`
Confirm that the S3 pre-signed URL generation uses the `S3_BUCKET_NAME` from config and the `SIGNED_URL_EXPIRY` setting.

The function should look similar to:
```python
def generate_presigned_url(s3_key: str, expires_in: int = SIGNED_URL_EXPIRY) -> str:
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": S3_BUCKET_NAME,
            "Key": s3_key
        },
        ExpiresIn=expires_in
    )
    return url
```

## Expected Outcome

- Signed URLs will be valid for 1 hour (3600 seconds) instead of 60 seconds
- The S3 bucket name is configurable via `.env`, allowing installers to be stored in a separate bucket
- The same AWS IAM credentials work across multiple S3 buckets

## Testing

After making these changes:
1. Update your `.env` file with the actual installer bucket name
2. Restart the update server
3. Test a download request - the signed URL should be valid for 1 hour
4. Verify that large files (3GB) can be downloaded without URL expiration issues

## Notes

- The installers will be in a different S3 bucket than other release files, but the same IAM user credentials are used
- Make sure the IAM user has `s3:GetObject` permission on both buckets
- The 1-hour expiry provides sufficient time for downloading large installers even on slower connections
