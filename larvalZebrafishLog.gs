function newSheet(){
  // Creates a spreadsheet named 'Larval Zebrafish Log'
  // The 'Current larvae' sheet is used to keep track of live fish, and the 'Past larvae' sheet is used to track euthanized fish
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Larval Zebrafish Log');
  ss.getSheetByName('Sheet1').setName('Current larvae');
  ss.insertSheet('Past larvae');
  var sheet = ss.getSheetByName('Current larvae');
  addHeader(sheet);
  setCondFormatting(sheet);
  var sheet = ss.getSheetByName('Past larvae');
  addHeader(sheet);
}

function addHeader(sheet){
  // Adds and formats the header

  var colNames = ['DOB', 'Genotype', 'Parent (F)', 'Parent(M)', 'Background', 'Researcher', '# of Plates', 'Fed?', 'Date Last Fed', 'Euthanized?'];
  var headerRow = [colNames];
  var headerRange = sheet.getRange(1, 1, 1, colNames.length);
  headerRange.setValues(headerRow)
            .setFontWeight('bold')
            .setFontLine('underline')
            .setHorizontalAlignment('center')
            .setFontSize(12)
            .setFontFamily('Calibri');
  sheet.setFrozenRows(1);
}

function setCondFormatting(sheet){
  // Sets the conditional formatting rules for the 'Current larvae' sheet

  var range = sheet.getRange(2, 1,sheet.getMaxRows()-1, sheet.getLastColumn()); // range for the end of the sheet

  // If the fish are 3 dpf or younger, sets the background to light blue
  // This is to mark larvae that have not reached the feeding age and need to be cleaned
  var cleaningRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"", $A2>=TODAY()-3)')
      .setBackground('#cfe2f3')
      .setRanges([range])
      .build();

  // If the 'Date Last Fed' column is before today, sets the background to light yellow
  // This is to mark larvae that have not been fed today
  var feedingRule = SpreadsheetApp.newConditionalFormatRule()
      .whenDateBefore(SpreadsheetApp.RelativeDate.TODAY)
      .setBackground("#fce8b2")
      .setRanges([sheet.getRange("I2:I")])
      .build();

  // If the fish are older than 14 dpf, sets the background to red
  // This is to mark larvae that need to be euthanized
  var oldFishRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"", $A2<TODAY()-14)')
      .setBackground('#ea4335')
      .setRanges([range])
      .build();

  var rules = sheet.getConditionalFormatRules();
  rules.push(cleaningRule, feedingRule, oldFishRule);
  sheet.setConditionalFormatRules(rules);
}

function onEdit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() == "Current larvae"){
    var editedCell = sheet.getActiveCell();
    var columnToSortBy = 1; // sorts the sheet by date of birth
    var feedingCheckboxColumn = 8;
    var euthanizedColumn = 10;

    // When new larvae are added, automatically adds the feeding and euthanized checkboxes and sorts the table by DOB 
    if(editedCell.getColumn() == columnToSortBy){
      var row = editedCell.getRow();
      sheet.getRange(row, feedingCheckboxColumn).insertCheckboxes();
      sheet.getRange(row, euthanizedColumn).insertCheckboxes();
      var tableRange = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn());
      sort(tableRange);
    }

    // When the 'Fed?' checkbox is checked, updates the date on the 'Date Last Fed' column to today
    if (editedCell.getColumn() == feedingCheckboxColumn){
      if (editedCell.getValue() == true){
        var dateLastFed = editedCell.offset(0, 1);
        dateLastFed.setValue(new Date());
      }
    }

    // When the 'Euthanized?' checkbox is checked, removes the row from 'Current larvae' sheet and moves it to 'Past larvae'
    if (editedCell.getColumn() == euthanizedColumn){
      if (editedCell.getValue() == true){
        var pastFish = sheet.getRange(editedCell.getRow(), 1, 1, sheet.getLastColumn());
        var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Past larvae');
        var emptyRow = targetSheet.getLastRow() + 1;
        pastFish.copyTo(targetSheet.getRange(emptyRow, 1, 1, sheet.getLastColumn()));
        pastFish.clear({contentsOnly: true, validationsOnly: true});
        var tableRange = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn());
        sort(tableRange);
      }
    }
  }
}

function sort(tableRange){
  // Sorts the given range by the first column (DOB) from younger to older fish
  columnToSortBy = 1;
  tableRange.sort({column: columnToSortBy, ascending: false});
}

function onOpen(e) {
  var sheet = SpreadsheetApp.getActiveSheet();

  // Unchecks the 'Fed?' checkbox the next day
  if (sheet.getName() == "Current larvae"){
    var dates = sheet.getRange("I2:I").getValues();
    var today = new Date().getDate();
    for (n=0; n<dates.length; ++n){
      if (dates[n][0] != ""){
        if (dates[n][0].getDate() != today){
          sheet.getRange(n+2, 8).setValue(false);
        }
      }
    }
  }
}


