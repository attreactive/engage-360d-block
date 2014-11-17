/**
* Engage-360D Block
*/

var React = require('react');
var cls = require("cls");
var $ = require('jquery');

var Renderer = cls.extend({
  init: function() {
    this._blocks = {};
    this._scheduledTasks = [];
    this._contentLoaded = document.readyState == "complete" || document.readyState == "loaded";

    if (!this._contentLoaded) {
      $(this._renderScheduled.bind(this));
    }
  },

  registerBlock: function(key, component) {
    this._blocks[key] = component;
  },

  renderBlock: function(key, elementId, props) {
    if (!this._blocks[key]) {
      throw new TypeError('Unregistered block "' + key + '"');
    }

    if (!props) {
      props = elementId;
      elementId = key;
    }

    var task = function() {
      var Block = this._blocks[key];
      var rootElement = document.getElementById(elementId);
      React.renderComponent(Block(props), rootElement);
    }.bind(this);

    if (this._contentLoaded) {
      task();
    } else {
      this._scheduledTasks.push(task);
    }
  },

  _renderScheduled: function() {
    this._scheduledTasks.forEach(function(task) {
      task();
    });

    this._scheduledTasks = [];
    this._contentLoaded = true;
  }
});

module.exports = Renderer;
