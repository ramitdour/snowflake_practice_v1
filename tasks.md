# Task List: Snowflake Practice Portal Refinement

## UI Fidelity (Pearson VUE / Snowflake Exact Match)
- [x] **Rethink Main Layout:**
    - [x] `Header`: Matches exactly. Text: `Practice Exam: Core - [Name]`.
    - [x] `Toolbar`: Removed `Calculator`, `Scratch Pad`, etc. Only `Comment` and `Flag for Review` remain.
    - [x] `Question Area`: Label format (A. B. C. D.) with correct padding and radio/checkbox alignment.
    - [x] `Footer`: Buttons positioned exactly: Help/End on left, Prev/Nav/Next on right.
    - [x] **Zoom Issue:** Fixed by switching to flex-col and h-screen containers.

## Functional Changes
- [x] **Landing Screen:**
    - [x] Input 1: Candidate Name.
    - [x] Input 2: Number of Questions (1-100).
- [x] **Data Logic:**
    - [x] Randomly selects `N` questions from the pool.
- [x] **Remove Examples:** Deleted the `example` syntax display from the question view.

## Analysis & Scraping
- [x] **Extract exact CSS colors and fonts:** Applied from provided screenshots and web views.
