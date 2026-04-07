-- Migration: Add stable rollback support to versions table
-- Created: 2026-04-07
-- Purpose: Enable permanent stable rollback version with dual S3 bucket support

-- Add is_stable_rollback boolean column
ALTER TABLE versions 
ADD COLUMN is_stable_rollback boolean NOT NULL DEFAULT false;

-- Add installer_file_path for installer bucket
ALTER TABLE versions 
ADD COLUMN installer_file_path text;

-- Create index for faster stable rollback lookups
CREATE INDEX idx_versions_stable_rollback 
ON versions(product_id, is_stable_rollback) 
WHERE is_stable_rollback = true;

-- Mark v1.0.0 as stable rollback for all products
-- Set installer_file_path to the installer bucket file
UPDATE versions 
SET 
    is_stable_rollback = true,
    installer_file_path = 'TvastrRAS_Installer.exe'
WHERE version_number = '1.0.0';

-- Add comment explaining the columns
COMMENT ON COLUMN versions.is_stable_rollback IS 'Marks exactly one version per product as the permanent stable rollback version';
COMMENT ON COLUMN versions.installer_file_path IS 'S3 key in the installers bucket for stable rollback downloads (separate from file_path which uses updates bucket)';
