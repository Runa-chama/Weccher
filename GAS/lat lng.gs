function doGet(e) {
  var p = e.parameter;
  var address = p.address;
  console.log(address);
  var geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  var response = geocoder.geocode(address);
  console.log(response);
  if (response['results'][0] == null){
    return ContentService.createTextOutput().setContent('Error');
  }
  else{
    var lat = response['results'][0]['geometry']['location']['lat'];
    var lng = response['results'][0]['geometry']['location']['lng'];
    var formated_address = response['results'][0]['formatted_address'];
    console.log("lat:"+lat+"\nlng:"+lng);
    console.log(formated_address);
    
    return ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON).setContent(JSON.stringify({lat,lng,formated_address}));
  }
}