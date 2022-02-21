# larvalZebrafishLog
 Google Apps Script for zebrafish labs to log larvae and track their feeding

##Installation

- Go to Google Sheets: https://sheets.google.com/
- Start a new blank spreadsheet.
- Go to Extensions > Apps Script
- Delete the `function myFunction() { }`
- Copy and paste the contents of `larvalZebrafishLog.gs`. Click on the 'Save project' 
button.
- Make sure that the `newSheet` function is selected at the top bar and click on Run.

![Run newSheet](https://github.com/minel-arinel/larvalZebrafishLog/blob/main/run_newSheet.PNG)

- When the 'Authorization required' window pops up, click on 'Review permissions'.

!['Authorization required' window](https://github.com/minel-arinel/larvalZebrafishLog/blob/main/authorizationRequiredWindow.PNG)

- Sign in with Google.
- If the window says 'Google hasn't verified this app', click on 'Advanced' at the bottom left
corner, then 'Go to Untitled project (unsafe)'.

!['Google hasn't verified this app' window](https://github.com/minel-arinel/larvalZebrafishLog/blob/main/googleSecurityWindow.PNG)

- On the 'Untitled project wants to access your Google Account' window, click on Allow.
- The spreadsheet is now ready to use. You can close the Apps Script window.

##Structure

This script creates a spreadsheet named **_Larval Zebrafish Log_** that is used for logging
larvae from different crosses and tracking their feeding.

The spreadsheet consists of two sheets: **_Current larvae_** and **_Past larvae_**.
_Current larvae_ is where the new crosses and the live fish are logged. When a batch is
euthanized, the row is removed from _Current larvae_ and moved to _Past larvae_.

Each sheet consists of a header with 10 columns:
1. **_DOB_**: Date of birth (MM/DD/YYYY). When a new cross is entered in this column, a checkbox
is added under the 'Fed?' and 'Euthanized?' columns, and the table is re-sorted
from younger to older fish.
2. **_Genotype_**: The genotype of the cross.
3. **_Parent (F)_**: Genotype/tank ID of the female parent of the cross.
4. **_Parent (M)_**: Genotype/tank ID of the male parent of the cross.
5. **_Background_**: The background of fish (e.g., EK, nacre, casper)
6. **_Researcher_**: The person who set up the cross
7. **_\# of Plates_**: The number of plates from the same cross
8. **_Fed?_**: Checkbox to indicate whether the cross has been fed on the current day. 
When this is checked, the date is updated on the 'Date Last Fed' column. The checkbox is 
automatically unchecked the following day.
9. **_Date Last Fed_**: The last date that the fish were fed. If this date is before the current
date, the cell is highlighted yellow to indicate unfed fish.
10. **_Euthanized?_**: Checkbox to move the row of fish from the 'Current larvae' sheet to the
'Past larvae' sheet once they are euthanized.

Highlighted cells/rows:

- If a _Date Last Fed_ cell is highlighted **yellow**, it means that the fish were last fed
before the current date.
- If a row is highlighted **blue**, it means that the fish are 3 dpf or younger. This is to
indicate embryos that are younger than the feeding age and require daily cleaning.
- If a row is highlighted **red**, it means that the fish are older than 14 dpf. This is
to indicate the larvae that need to be euthanized.