# Idaho Data Ingestion Walkthrough

## Overview
This document details the process for ingesting senior center data for the state of Idaho (ID). As no direct downloadable dataset was available, we scraped a list of centers from `careforidaho.org` and manually enriched the data with addresses.

## Steps Taken

### 1. Data Collection
- **Source**: [Care for Idaho - Senior Centers](https://careforidaho.org/list11_Idaho_senior_centers.htm)
- **Method**: Scraped using a browser subagent. Alternatively, manual search for missing addresses.
- **Enrichment**: Since the source only listed names and phone numbers, we performed web searches to identify street addresses for 18 centers.

### 2. Data Cleaning
- Created `id_raw/id_centers.json` with 18 verified centers.
- Removed non-center entries (agencies, meal delivery services).
- Standardized city names.

### 3. Ingestion
- Created `scripts/ingest_id.js` to process the JSON file.
- Handled missing zip codes by allowing initial ingestion with `null` coordinates and zips, then filling them in during geocoding.

### 4. Geocoding & Verification
- Used `scripts/geocode_missing.js` to geocode all 18 centers.
- **Success Rate**: 100% (17 via Nominatim, 1 manually added coordinates for Tensed, ID).
- **Date**: 2026-02-08

### 5. Zip Code Validation
- Added 18 new zip codes to `zipcodes.json` based on the geocoded locations.
- Verified that all centers are within 25 miles of their zip code centroid using `scripts/check_coordinate_sanity.js`.

## Results
- **Total ID Centers Added**: 18
- **Geocoded**: 18
- **Coordinates Verified**: Yes, 0 suspicious outliers.

## Next Steps
- Proceed to the next state in the backlog.
