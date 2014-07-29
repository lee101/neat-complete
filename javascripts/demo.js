$(document).ready(function(){
  var widget = new NeatComplete.Widget(document.getElementById('location'),{footer_content:"search powered by GeoNames.",empty_content:"No results found."})
  var service = widget.addService("test",function(query,response_fn){
    var options = {
      url: "http://ws.geonames.org/searchJSON",dataType: "jsonp",
      data: {featureClass: "P", style: "full", maxRows: 12, name_startsWith: query, username: 'cameron_prebble' }
    }
    var success_fn = function(data) {
      response_fn(query, $.map( data.geonames, function( item ) {
        return {
          value: item.name + ((item.adminName1 && item.adminName1 != item.name) ? ", " + item.adminName1 : "") + ", " + item.countryName,
          score: item.score,
          data: item
        }
      }));
    }
    $.ajax(options).done(success_fn);
  });
});
