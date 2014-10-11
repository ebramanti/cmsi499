//Setup to allow easy adding more options later
function saveOptions() {
  var serverURL = document.getElementById("serverURL");
  var options = {
    "serverURL": serverURL.value
  }
  return options;
};

var cancelButton = document.getElementById("cancel-button");
cancelButton.addEventListener("click",
  function() {
    console.log("Cancel");
    var location = "pebblejs://close";
    document.location = location;
  },
false);

var submitButton = document.getElementById("save-button");
submitButton.addEventListener("click",
  function() {
    console.log("Submit");
    var options = saveOptions();
    var location = "pebblejs://close#" + encodeURIComponent(JSON.stringify(options));
    document.location = location;
  },
false);
