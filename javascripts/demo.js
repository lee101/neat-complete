$(document).ready(function(){
  widget = new NeatComplete.Widget(document.getElementById('location'),{footerContent:"search powered by GeoNames.",emptyContent:"No results found."})
  widget.addService("test",function(query,response_fn){
    $.ajax({
      url: "http://ws.geonames.org/searchJSON",
      dataType: "jsonp",
      data: {featureClass: "P", style: "full", maxRows: 12, name_startsWith: query, username: 'cameron_prebble' },
      success: function( data ) {
        response_fn(query, $.map( data.geonames, function( item ) {
          return {
            value: item.name + ((item.adminName1 && item.adminName1 != item.name) ? ", " + item.adminName1 : "") + ", " + item.countryName,
            score: item.score,
            data: item
          }
        }));
      }
    });
  });
});
