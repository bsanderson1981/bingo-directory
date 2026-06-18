# Debugging Missing AK Data

- [x] Count AK entries in `us_centers.json` <!-- id: 0 -->
- [x] Count entries in `ak_raw/ak_centers.json` <!-- id: 1 -->
- [x] Check git log for `us_centers.json` to confirm when it was last updated <!-- id: 2 -->
- [x] Verify if local commits are pushed to origin <!-- id: 3 -->
- [x] Compare raw names vs ingested names to ensure all are present <!-- id: 4 -->
- [x] **Geocode missing AK and AL centers** (Script running, incremental verification) <!-- id: 6 -->
    - [x] Create `scripts/geocode_missing.js` <!-- id: 7 -->
    - [x] Run geocoding script <!-- id: 8 -->
    - [x] Verify coordinates in `us_centers.json` <!-- id: 9 -->
- [x] **Generate final report of missing coordinates** <!-- id: 10 -->
- [x] **Georgia (GA)** <!-- id: 99 -->
    - [x] Identify Primary Data Sources (Dept of Aging, AAAs) <!-- id: 100 -->
    - [x] Download/Scrape Raw Data (`ga_raw/`) <!-- id: 101 -->
    - [x] Convert to JSON (`ga_centers.json`) <!-- id: 102 -->
    - [x] **Proactive ZIP Code Check** (Ensure all GA zips exist in `zipcodes.json`) <!-- id: 103 -->
    - [x] Create `scripts/ingest_ga.js` <!-- id: 104 -->
    - [x] Run ingestion and verify <!-- id: 105 -->
    - [x] Geocode new GA centers <!-- id: 106 -->
    - [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 107 -->
- [x] **Hawaii (HI)** <!-- id: 108 -->
    - [x] Identify Primary Data Sources (HI Executive Office on Aging, County ADRCs) <!-- id: 109 -->
    - [x] Download/Scrape Raw Data (`hi_raw/`) <!-- id: 110 -->
    - [x] Convert to JSON (`hi_centers.json`) <!-- id: 111 -->
    - [x] **Proactive ZIP Code Check** (Ensure all HI zips exist in `zipcodes.json`) <!-- id: 112 -->
    - [x] Create `scripts/ingest_hi.js` <!-- id: 113 -->
    - [x] Run ingestion and verify <!-- id: 114 -->
    - [x] Geocode new HI centers <!-- id: 115 -->
    - [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 116 -->
- [x] **Idaho (ID)** <!-- id: 117 -->
    - [x] Identify Primary Data Sources (ID Commission on Aging, Area Agencies on Aging) <!-- id: 118 -->
    - [x] Download/Scrape Raw Data (`id_raw/`) <!-- id: 119 -->
    - [x] Convert to JSON (`id_centers.json`) <!-- id: 120 -->
    - [x] **Proactive ZIP Code Check** (Ensure all ID zips exist in `zipcodes.json`) <!-- id: 121 -->
    - [x] Create `scripts/ingest_id.js` <!-- id: 122 -->
    - [x] Run ingestion and verify <!-- id: 123 -->
    - [x] Geocode new ID centers <!-- id: 124 -->
    - [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 125 -->

# AZ Data Deep Search Status
- [x] Identify AZ data sources (State agencies, AAAs) <!-- id: 12 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 13 -->
- [x] Create `az_raw/az_centers.json` with consolidated data <!-- id: 14 -->
- [x] Create `scripts/ingest_az.js` <!-- id: 15 -->
- [ ] Ingest and Geocode <!-- id: 34 -->

# SEO Optimization
- [x] Analyze `index.html` for meta tags and title <!-- id: 35 -->
- [x] Review main content (App.jsx, Landing Page) for keywords <!-- id: 36 -->
- [x] Generate keyword recommendations <!-- id: 37 -->
- [x] Implement SEO improvements (Meta tags, H1/H2 updates) <!-- id: 38 -->
- [x] Geocode new AZ centers <!-- id: 17 -->
- [x] Manual fix for Maricopa Community Senior Center <!-- id: 18 -->

# AR Data Deep Search Status
- [x] Identify AR data sources (State agencies, AAAs) <!-- id: 23 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 24 -->
- [x] Create `ar_raw/ar_centers.json` with consolidated data <!-- id: 25 -->
- [x] **Proactive ZIP Code Check** (Ensure all AR zips exist in `zipcodes.json`) <!-- id: 26 -->
- [x] Create `scripts/ingest_ar.js` <!-- id: 27 -->
- [x] Run ingestion and verify <!-- id: 28 -->
- [x] Geocode new AR centers <!-- id: 29 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 30 -->

# AL Data Deep Search Status
- [x] Identify AL data sources (State agencies, AAAs) <!-- id: 39 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 40 -->
- [x] Create `al_raw/al_centers.json` with consolidated data <!-- id: 41 -->
- [x] **Proactive ZIP Code Check** (Ensure all AL zips exist in `zipcodes.json`) <!-- id: 42 -->
- [x] Create `scripts/ingest_al.js` <!-- id: 43 -->
- [x] Run ingestion and verify <!-- id: 44 -->
- [x] Geocode new AL centers <!-- id: 45 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 46 -->

# CA Data Deep Search Status
- [x] Identify CA data sources (State agencies, AAAs) <!-- id: 47 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 48 -->
- [x] Create `ca_raw/ca_centers.json` with consolidated data <!-- id: 49 -->
- [x] **Proactive ZIP Code Check** (Ensure all CA zips exist in `zipcodes.json`) <!-- id: 50 -->
- [x] Create `scripts/ingest_ca.js` <!-- id: 51 -->
- [x] Run ingestion and verify <!-- id: 52 -->
- [x] Geocode new CA centers <!-- id: 53 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 54 -->

# CO Data Deep Search Status
- [x] Identify CO data sources (State agencies, AAAs) <!-- id: 55 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 56 -->
- [x] Create `co_raw/co_centers.json` with consolidated data <!-- id: 57 -->
- [x] **Proactive ZIP Code Check** (Ensure all CO zips exist in `zipcodes.json`) <!-- id: 58 -->
- [x] Create `scripts/ingest_co.js` <!-- id: 59 -->
- [x] Run ingestion and verify <!-- id: 60 -->
- [x] Geocode new CO centers <!-- id: 61 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 62 -->

# CT Data Deep Search Status
- [x] Identify CT data sources (State agencies, AAAs) <!-- id: 63 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 64 -->
- [x] Create `ct_raw/ct_centers.json` with consolidated data <!-- id: 65 -->
- [x] **Proactive ZIP Code Check** (Ensure all CT zips exist in `zipcodes.json`) <!-- id: 66 -->
- [x] Create `scripts/ingest_ct.js` <!-- id: 67 -->
- [x] Run ingestion and verify <!-- id: 68 -->
- [x] Geocode new CT centers <!-- id: 69 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 70 -->

# IL Data Deep Search Status
- [x] Identify IL data sources <!-- id: 130 -->
- [x] Download/Scrape Raw Data (`il_raw/`) <!-- id: 131 -->
- [x] Convert to JSON (`il_centers.json`) <!-- id: 132 -->
- [x] Create `scripts/ingest_il.js` <!-- id: 133 -->
- [x] Run ingestion and verify <!-- id: 134 -->
- [ ] Geocode new IL centers <!-- id: 135 -->

# IA Data Deep Search Status
- [x] Identify IA data sources (State agencies, AAAs) <!-- id: 136 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 137 -->
- [x] Create `ia_raw/ia_centers_raw.json` with consolidated data <!-- id: 138 -->
- [x] **Proactive ZIP Code Check** (Ensure all IA zips exist in `zipcodes.json`) <!-- id: 139 -->
- [x] Create `scripts/ingest_ia.js` <!-- id: 140 -->
- [x] Run ingestion and verify <!-- id: 141 -->
- [x] Geocode new IA centers <!-- id: 142 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 143 -->
- [x] **Physical Address Verification** (Ensure house numbers present for all 73 centers) <!-- id: 144 -->
- [x] **Comprehensive Address Audit** (Manual Google verification for all centers, fixed 30+ addresses, removed 4 invalid entries) <!-- id: 145 -->
- [x] **Iowa Website Enrichment** (Find and add websites for IA centers) <!-- id: 160 -->

# KS Data Deep Search Status
- [ ] Identify KS data sources (State agencies, AAAs) - **EXCLUDE seniorcenterdirectory.com** <!-- id: 146 -->
- [ ] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 147 -->
- [ ] Create `ks_raw/ks_centers.json` with consolidated data - **PARTIAL (51 centers found)** <!-- id: 148 -->
- [ ] **Proactive ZIP Code Check** (Ensure all KS zips exist in `zipcodes.json`) <!-- id: 149 -->
- [ ] Create `scripts/ingest_ks.js` <!-- id: 150 -->
- [ ] Run ingestion and verify <!-- id: 151 -->
- [x] Geocode new KS centers - **COMPLETE** <!-- id: 152 -->
- [ ] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 153 -->

# DE Data Deep Search Status
- [x] Identify DE data sources (State agencies, AAAs) <!-- id: 71 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 72 -->
- [x] Create `de_raw/de_centers.json` with consolidated data <!-- id: 73 -->
- [x] **Proactive ZIP Code Check** (Ensure all DE zips exist in `zipcodes.json`) <!-- id: 74 -->
- [x] Create `scripts/ingest_de.js` <!-- id: 75 -->
- [x] Run ingestion and verify <!-- id: 76 -->
- [x] Geocode new DE centers <!-- id: 77 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 78 -->

# FL Data Deep Search Status
- [x] Identify FL data sources (State agencies, AAAs) <!-- id: 79 -->
- [x] Search for downloadable datasets (CSV, PDF, Excel) <!-- id: 80 -->
- [x] Create `fl_raw/fl_centers.json` with consolidated data <!-- id: 81 -->
- [x] **Proactive ZIP Code Check** (Ensure all FL zips exist in `zipcodes.json`) <!-- id: 82 -->
- [x] Create `scripts/ingest_fl.js` <!-- id: 83 -->
- [x] Run ingestion and verify <!-- id: 84 -->
- [x] Geocode new FL centers <!-- id: 85 -->
- [x] **Coordinate Sanity Check** (Verify Center vs. Zip location distance) <!-- id: 86 -->
