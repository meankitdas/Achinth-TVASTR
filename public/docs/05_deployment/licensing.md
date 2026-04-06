# Licensing System

Technical reference for tier-based licensing and capability control.

---

## Tier System

| Tier | Features |
|------|----------|
| TIER_1 | Basic defect detection, single-image inspection, PDF reports |
| TIER_2 | + Process Intelligence (drift detection, defect graphs, analytics) |
| TIER_3 | + Plant Intelligence (dashboard, SPC, decision engine, planner) |

---

## Capability Matrix

| Capability | TIER_1 | TIER_2 | TIER_3 |
|---|:---:|:---:|:---:|
| `inspection` | ✅ | ✅ | ✅ |
| `batch_processing` | ✅ | ✅ | ✅ |
| `analytics` | ✅ | ✅ | ✅ |
| `erp_integration` | ❌ | ✅ | ✅ |
| `process_intelligence` | ❌ | ✅ | ✅ |
| `plant_intelligence` | ❌ | ❌ | ✅ |

### Capability Definitions

| Capability | Controls |
|---|---|
| `inspection` | Individual image upload + AI pipeline (always enabled) |
| `batch_processing` | Folder + SQL queue batch ingestion |
| `analytics` | Monthly KPI analytics dashboard |
| `erp_integration` | ERP SQL context lookup + SQL batch ingestion |
| `process_intelligence` | Defect graph, temporal model, drift detection, heat intelligence |
| `plant_intelligence` | PI module (25 REST endpoints + WebSocket + dashboard) |

---

## License File Format (v2)

```json
{
  "customer":    "CastCo Foundry",
  "machine_id":  "AB91F42C77E2A1D3",
  "expiry":      "2027-01-01",
  "product":     "rejection-analysis-system",
  "tier":        "TIER_2",
  "capabilities": {
    "inspection":           true,
    "batch_processing":     true,
    "analytics":            true,
    "erp_integration":      true,
    "process_intelligence": true,
    "plant_intelligence":   false
  },
  "signature":   "signed_hash"
}
```

**Fields:**
- `machine_id` — Hardware fingerprint (CPU + MAC address hash)
- `tier` — Capability level
- `expiry` — ISO date (YYYY-MM-DD)
- `capabilities` — Granular feature flags
- `signature` — HMAC validation hash

---

## Backward Compatibility (v1)

Old licenses with flat `features` list continue to work:

```json
{
  "features": ["inspection", "batch_processing", "analytics", "process_intelligence"]
}
```

License manager infers tier automatically:
- `plant_intelligence` present → TIER_3
- `process_intelligence` present → TIER_2
- Neither → TIER_1

---

## Developer / CI Mode

If `license/license.json` does not exist:
- All capabilities enabled
- No machine binding
- No expiry check
- Launcher prints `DEVELOPMENT MODE`

---

## Validation Logic

**At startup (`launcher/launcher.py`):**
```python
from core.security.license import verify_license
verify_license()
```

**Behavior:**
- No license file → DEV MODE (warning logged, continues)
- Valid license → Logs tier + features, continues
- Invalid/expired license → Blocks startup with error

---

## Code Usage

```python
from core.security.license_manager import has_capability, get_tier

# Check capability
if not has_capability("erp_integration"):
    return None   # skip SQL path, fall back to CSV

if has_capability("plant_intelligence"):
    enable_pi_module()

# Get tier
tier = get_tier()   # "TIER_1" | "TIER_2" | "TIER_3"

# Legacy API (backward compat)
from core.security.license_manager import has_feature
if has_feature("process_intelligence"):
    run_drift_detection()
```

---

## Generating Licenses (Vendor)

```bash
# TIER_1
python core/security/license.py generate \
  --customer "Acme Foundry" \
  --machine-id AB91F42C77E2A1D3 \
  --expiry 2027-01-01 \
  --tier TIER_1

# TIER_2
python core/security/license.py generate \
  --customer "Acme Foundry" \
  --machine-id AB91F42C77E2A1D3 \
  --expiry 2027-01-01 \
  --tier TIER_2

# TIER_3
python core/security/license.py generate \
  --customer "CastCo Foundry" \
  --machine-id AB91F42C77E2A1D3 \
  --expiry 2027-01-01 \
  --tier TIER_3
```

---

## Getting Machine ID

```bash
python core/security/license.py fingerprint
# → Machine fingerprint: AB91F42C77E2A1D3
```

Hardware fingerprint combines CPU serial + primary MAC address (SHA256 hash).

---

## Upgrading Customer Tier

Replace `license/license.json` with new tier file. No reinstall required — capabilities update on next launch.

---

## Testing

```bash
python dev/tools/test_license_tiers.py
# → 37/37 checks passed ✓
```

**Test coverage:**
- Dev mode (no license)
- TIER_1/2/3 validation
- Legacy v1 backward compatibility
- Corrupted file safe defaults
- ERP/PI capability guards
- Startup log output

---

## Troubleshooting

### License validation fails

**Error:**
```
[LICENSE ERROR] License file is invalid or corrupted.
```

**Fix:**
1. Verify `license/license.json` exists
2. Validate JSON format
3. Check expiry date: `"expiry": "2027-12-31"`
4. Verify machine_id matches hardware
5. For testing: delete license file → dev mode

---

### Capability check fails at import

**Error:**
```
PermissionError: This feature requires the 'process_intelligence' capability.
```

**Cause:** Code attempted to import `core.learning` module on TIER_1 license.

**Fix:**
1. Check capability before import:
   ```python
   if has_capability("process_intelligence"):
       from core.learning import defect_graph
   ```
2. Or upgrade license to TIER_2+

---

## References

- **Architecture:** `docs/architecture.md`
- **Build & Deployment:** `docs/BUILD_AND_DEPLOY.md`
