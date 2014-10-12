var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

var App = {};
App.serverURL = Settings.option("serverURL") || "www.google.com";
App.data = {};

Settings.config(
  {
    url: "http://my.cs.lmu.edu/~tbramant/serverstats/ServerStats.html?site=" + App.serverURL
  },
  function(e) {
    console.log('opening configurable');
  },
  function(e) {
    App.serverURL = e.options.serverURL;
    console.log('closed configurable');
    console.log("new serverURL: " + e.options.serverURL);
  }
);

App.init = function() {
  App.menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Server Name',
        subtitle: App.serverURL
      }, {
        title: 'Server Status',
        subtitle: App.data.serverStatus
      }, {
        title: 'IP Address',
        subtitle: App.data.ip || "Unknown"
      }, {
        title: 'IP Location',
        subtitle: App.data.ipLocation || "Unknown"
      }, {
        title: 'Region',
        subtitle: App.data.regionLocation || "Unknown"
      }]
    }]
  });
  App.loading = new UI.Card({
    body: "Loading...",
    textAlign: "center"
  });
  App.menu.on('select', function() {
    var priorStatus = App.data.serverStatus;
    var priorServer = App.menu.items(0)[0].subtitle;
    App.loading.show();
    ajax(
      {
        url: 'http://ip-api.com/json/' + App.serverURL,
        type: 'json',
        method: 'get'
      },
      function(data) {
        if (data.status == "fail") {
          console.log("Fail on Select Callback");
          App.data.serverStatus = 'Offline';
        } else {
          console.log("Success on Select Callback");
          App.data.serverStatus = 'Online';
        }
        if (App.serverURL != priorServer) {
          App.menu.item(0, 0, {subtitle: App.serverURL});
          App.menu.item(0, 2, {subtitle: data.query});
          App.menu.item(0, 3, {subtitle: data.city + ', ' + data.region});
          App.menu.item(0, 4, {subtitle: data.lat + ', ' + data.lon});
        }
        if (App.data.serverStatus != priorStatus) {
          console.log("Change in server state!");
          App.menu.item(0, 1, {subtitle: App.data.serverStatus});
        }
      },
      function(failure) {
        console.log("Non-200 Fail on Select Callback");
        App.data.serverStatus = 'Offline';
        if (App.serverURL != priorServer) {
          App.menu.item(0, 0, {subtitle: "ERROR"});
        }
        App.menu.item(0, 1, {subtitle: App.data.serverStatus});
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
    url: 'http://ip-api.com/json/' + App.serverURL,
    type: 'json',
    method: 'get',
  },
  function(data) {
    console.log(data.status.toUpperCase());
    if (data.status == "fail") {
      App.data.serverStatus = 'Offline';
      App.init();
    } else {
      App.data.ip = data.query;
      App.data.regionLocation = data.city + ', ' + data.region;
      App.data.ipLocation = data.lat + ', ' + data.lon;
      App.data.serverStatus = 'Online';
      App.init();
    }
  },
  function(failure) {
    App.data.serverStatus = 'API_ERROR';
    App.init();
  }
);
