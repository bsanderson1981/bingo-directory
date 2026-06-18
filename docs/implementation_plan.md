# Idaho Data Ingestion Plan

## Goal Description
Ingest senior center data for Idaho (ID) into the `senior-center-locator` application.

## Proposed Changes

### Data Sources
- **Primary**: [careforidaho.org](https://careforidaho.org/list11_Idaho_senior_centers.htm)
- **Secondary**: Manual addition from Google Maps/Search if primary is insufficient.

### Files

#### [NEW] [id_centers.json](file:///Users/bsanderson/Development/senior-center-locator/frontend/public/data/id_raw/id_centers.json)
- Raw data file for ID centers.

#### [NEW] [ingest_id.js](file:///Users/bsanderson/Development/senior-center-locator/frontend/scripts/ingest_id.js)
- Script to ingest ID data into `us_centers.json`.

#### [MODIFY] [us_centers.json](file:///Users/bsanderson/Development/senior-center-locator/frontend/public/data/us_centers.json)
- Add ID centers.

#### [MODIFY] [zipcodes.json](file:///Users/bsanderson/Development/senior-center-locator/frontend/public/data/zipcodes.json)
- Add missing ID zip codes if any.

## Verification Plan

### Automated Tests
- Run `node frontend/scripts/ingest_id.js`
- Run `node frontend/scripts/check_coordinate_sanity.js`
- Run `node frontend/scripts/geocode_missing.js`

### Manual Verification
- Inspect `us_centers.json` for ID entries.
- verify a sample of addresses on Google Maps.
