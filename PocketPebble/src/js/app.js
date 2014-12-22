var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var config = require('config').Config;

var App = {};
App.token = config.CONSUMER_KEY;
App.redirect_uri = "pebblejs://close";
App.data = {};

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
    ajax(
      {
        url: "https://getpocket.com/v3/oauth/request",
        method: "post",
        type: "json",
        data: {
          consumer_key: config.CONSUMER_KEY,
          redirect_uri: App.redirect_uri
        },
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Accept': 'application/json'
        }
      },
      function(data) {
        var reqToken = data.code;
        Pebble.openURL("https://getpocket.com/auth/authorize?request_token=" + reqToken + "&redirect_uri=" + App.redirect_uri);

        Pebble.addEventListener("webviewclosed", function(e) {
          console.log("configuration closed");
          ajax(
            {
              url: "https://getpocket.com/v3/oauth/authorize",
              method: "post",
              type: "json",
              data: {
                consumer_key: config.CONSUMER_KEY,
                code: reqToken
              },
              headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Accept': 'application/json'
              }
            },
            function(data) {
              Settings.option("access_token", data.access_token);
              console.log("Authenticated " + data.username);
            },
            function(error) {
              console.log("Unable to get auth token.")
            }
          );
        });
      },
      function(error) {
        Pebble.openURL(App.redirect_uri);
      }
    );
});

App.access_token = Settings.option("access_token") || null;

// App logic goes here.

// App.init = function() {
//
// };

if (App.access_token) {
  ajax(
    {
      url: 'https://getpocket.com/v3/get',
      type: 'json',
      method: 'post',
      data: {
        consumer_key: config.CONSUMER_KEY,
        access_token: App.access_token,
        count: 1
      }
    },
    function(data) {
      console.log("It worked!");
      var card = new UI.Card({
        title: 'Logged in.',
        body: data.access_token,
        scrollable: false
      });
      card.show();
      //App.init();
    },
    function(failure) {
      console.log("I don't know how to error properly yet.");
    }
  );
} else {
  var card = new UI.Card({
    title: 'Please login to Pocket.',
    body: 'Halp us halp you.',
    scrollable: false
  });
  card.show();
}
