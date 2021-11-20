var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('table');
var file_url=""
function doGet(e){
  const p = e.parameters;
  const t = p.t+"";
  const w = p.w+"";
  const tmaxs = p.tmax+"";
  const tmins = p.tmin+""; 
  const pres = p.pre+"";
  const times = t.split(',');
  const weathers = w.split(',');
  const temp_maxs = tmaxs.split(',');
  const temp_mins = tmins.split(',');
  const pre_sums = pres.split(',');
  
  sheet.getRange("B1:H5").setValues([times,weathers,temp_maxs,temp_mins,pre_sums]);
  Utilities.sleep(500);
  var charts = sheet.getCharts();
  var imageBlob = charts[0].getBlob().getAs('image/png').setName("chart_image.png");
  var fileID = DriveApp.getFolderById('11ZCoAkUTwEXiDo883XILVOcZyanI84OT').createFile(imageBlob).getId();
  DriveApp.getFileById(fileID).setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
  var file_url = 'https://drive.google.com/uc?id='+fileID;

  console.log(typeof file_url);
  var out = ContentService.createTextOutput(file_url);
  console.log("content:"+out.getContent());
  return out;
}