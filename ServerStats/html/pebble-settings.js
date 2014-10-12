$("#cancel-button").click(function() {
    console.log("Cancel");
    var location = "pebblejs://close";
    document.location = location;
});

$("#clear-button").click(function() {
    $("#serverURL").val("");
})

$("#save-button").click(function() {
    var serverURL = $("#serverURL").val();
    var options = {
      "serverURL": serverURL
    }
    console.log("Submit");
    var location = "pebblejs://close#" + encodeURIComponent(JSON.stringify(options));
    document.location = location;
});

$(document).ready(function() {
  var priorSite = window.location.search.substring(6)
  $("#serverURL").val(priorSite);
});
