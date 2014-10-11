var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

Settings.config({
  url: "http://my.cs.lmu.edu/~tbramant/serverstats/ServerStats.html"
})

var App = {};
App.webAddress = Settings.option("serverURL") || "google.com";
App.data = {};

App.init = function() {
  App.menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Server Name',
        subtitle: App.webAddress
      }, {
        title: 'IP Address',
        subtitle: App.data.ip
      }, {
        title: 'Server Status',
        subtitle: App.data.serverStatus
      }, {
        title: 'IP Location',
        subtitle: App.data.ipLocation
      }, {
        title: 'Region',
        subtitle: App.data.regionLocation
      }]
    }]
  });
  App.loading = new UI.Card({
    body: "Loading...",
    textAlign: "center"
  });
  App.menu.on('select', function() {
    App.loading.show();
    ajax(
      {
        url: 'http://ip-api.com/json/' + App.webAddress,
        type: 'json',
        method: 'get'
      },
      function(success) {
        console.log("Success on Select Callback");
        App.data.serverStatus = 'Online';
        App.menu.item(0, 2, {subtitle: App.data.serverStatus});
      },
      function(failure) {
        App.data.serverStatus = 'Offline';
        App.menu.item(0, 2, {subtitle: App.data.serverStatus});
      }
    );
    setTimeout(function() {
      App.loading.hide();
    }, 500);
  });
  App.menu.show();
};

ajax(
  {
    url: 'http://ip-api.com/json/' + App.webAddress,
    type: 'json',
    method: 'get',
  },
  function(data) {
    App.data.ip = data.query;
    App.data.regionLocation = data.city + ', ' + data.region;
    App.data.ipLocation = data.lat + ', ' + data.lon;
    App.data.serverStatus = 'Online';
    console.log(data.status.toUpperCase());
    App.init();
  },
  function(failure) {
    App.data.serverStatus = 'Offline';
    App.init();
  }
);
