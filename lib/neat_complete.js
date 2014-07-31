(function() {
  var __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(function() {
        return factory(root);
      });
    } else {
      return root.NeatComplete = factory(root);
    }
  })(this, function(root) {
    var NeatComplete;
    NeatComplete = {};
    NeatComplete.addDomEvent = function(elem, event, fn) {
      if (elem.attachEvent != null) {
        elem["e" + event + fn] = fn;
        elem["" + event + fn] = function() {
          return elem["e" + event + fn](window.event);
        };
        return elem.attachEvent("on" + event, elem["" + event + fn]);
      } else {
        return elem.addEventListener(event, fn, false);
      }
    };
    NeatComplete.removeDomEvent = function(elem, event, fn) {
      if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, elem["" + event + fn]);
      } else {
        return elem.removeEventListener(event, fn, false);
      }
    };
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement) {
        var k, len, n, t;
        if (typeof this === "undefined" || this === null) {
          throw new TypeError();
        }
        t = Object(this);
        len = t.length >>> 0;
        if (len === 0) {
          return -1;
        }
        n = 0;
        if (arguments.length > 0) {
          n = Number(arguments[1]);
          if (n !== n) {
            n = 0;
          } else {
            if (n !== 0 && n !== Infinity && n !== -Infinity) {
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
          }
        }
        if (n >= len) {
          return -1;
        }
        k = (n >= 0 ? n : Math.max(len - Math.abs(n), 0));
        while (k < len) {
          if (k in t && t[k] === searchElement) {
            return k;
          }
          k++;
        }
        return -1;
      };
    }
    NeatComplete.Dispatch = (function() {
      function Dispatch() {}

      Dispatch.prototype.setOption = function(key, value) {
        this.options[key] = value;
        return this;
      };

      Dispatch.prototype.getOption = function(key) {
        return this.options[key];
      };

      Dispatch.prototype.on = function(event_name, callback) {
        var _base;
        if (this.subs == null) {
          this.subs = {};
        }
        if ((_base = this.subs)[event_name] == null) {
          _base[event_name] = [];
        }
        this.subs[event_name].push(callback);
        return this;
      };

      Dispatch.prototype.trigger = function() {
        var args, callback, event_name, _i, _len, _ref, _ref1;
        event_name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (((_ref = this.subs) != null ? _ref[event_name] : void 0) != null) {
          _ref1 = this.subs[event_name];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            callback = _ref1[_i];
            callback.apply(this, args);
          }
        }
        return this;
      };

      return Dispatch;

    })();
    NeatComplete.Widget = (function(_super) {
      __extends(Widget, _super);

      function Widget(element, options) {
        this.element = element;
        this.options = options != null ? options : {};
        this._onBlur = __bind(this._onBlur, this);
        this._onKeyDown = __bind(this._onKeyDown, this);
        this._onKeyPress = __bind(this._onKeyPress, this);
        this._onFocus = __bind(this._onFocus, this);
        this.enabled = true;
        this.element.setAttribute('autocomplete', 'off');
        this.services = [];
        this._applyDefaults();
        if (this.getOption('container') == null) {
          this.setOption('container', window.document.body);
        }
        this._addListeners();
        this.output = document.createElement("ul");
        this.output.className = this.options.list_class;
        this._applyStyle("display", "none");
        this._applyStyle("position", this.options.position);
        this.options.container.appendChild(this.output);
        this;
      }

      Widget.prototype.defaults = {
        max_results: 10,
        list_class: 'nc_list',
        item_class: 'nc_item',
        hover_class: 'nc_hover',
        footer_class: 'nc_footer',
        empty_class: 'nc_empty',
        error_class: 'nc_error',
        position: 'absolute'
      };

      Widget.prototype.addService = function(name, search_function, options) {
        var service;
        if (options == null) {
          options = {};
        }
        this.services.push(service = new NeatComplete.Service(this, name, search_function, options));
        return service;
      };

      Widget.prototype.disable = function() {
        this.enabled = false;
        return this;
      };

      Widget.prototype.enable = function() {
        this.enabled = true;
        return this;
      };

      Widget.prototype.destroy = function() {
        document.body.removeChild(this.output);
        this.element.removeAttribute("autocomplete");
      };

      Widget.prototype._applyDefaults = function() {
        var key, value, _ref, _results;
        _ref = this.defaults;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          if (this.getOption(key) == null) {
            _results.push(this.setOption(key, value));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Widget.prototype._addListeners = function() {
        NeatComplete.addDomEvent(this.element, "focus", this._onFocus);
        NeatComplete.addDomEvent(this.element, "keypress", this._onKeyPress);
        NeatComplete.addDomEvent(this.element, "keydown", this._onKeyDown);
        return NeatComplete.addDomEvent(this.element, "blur", this._onBlur);
      };

      Widget.prototype._removeListeners = function() {
        NeatComplete.removeDomEvent(this.element, "focus", this._onFocus);
        NeatComplete.removeDomEvent(this.element, "keypress", this._onKeyPress);
        NeatComplete.removeDomEvent(this.element, "keydown", this._onKeyDown);
        return NeatComplete.removeDomEvent(this.element, "blur", this._onBlur);
      };

      Widget.prototype._onFocus = function(e) {
        return this.focused = true;
      };

      Widget.prototype._onKeyPress = function(e) {
        var keyCode, _ref;
        keyCode = e.which || e.keyCode;
        if (this.visible && keyCode === 13) {
          if ((_ref = this.highlighted) != null) {
            _ref.selectItem();
          }
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
          return false;
        }
      };

      Widget.prototype._onKeyDown = function(e) {
        var keyCode, _ref;
        keyCode = e.which || e.keyCode;
        switch (keyCode) {
          case 38:
            if (this.visible) {
              this._moveHighlight(-1);
            }
            return false;
          case 40:
            if (this.visible) {
              this._moveHighlight(1);
            }
            return false;
          case 9:
            if (this.visible) {
              return (_ref = this.highlighted) != null ? _ref.selectItem() : void 0;
            }
            break;
          case 27:
            return this._hideResults();
          case 37:
          case 39:
          case 13:
            break;
          default:
            if (this._timeout != null) {
              clearTimeout(this._timeout);
            }
            return this._timeout = setTimeout((function(_this) {
              return function() {
                return _this._getSuggestions();
              };
            })(this), 400);
        }
      };

      Widget.prototype._onBlur = function(e) {
        if (!this.mouseDownOnSelect) {
          this.focused = false;
          return this._hideResults();
        }
      };

      Widget.prototype._moveHighlight = function(step) {
        var current_index, _ref, _ref1;
        current_index = this.highlighted != null ? this.results.indexOf(this.highlighted) : -1;
        if ((_ref = this.highlighted) != null) {
          _ref.unhighlight();
        }
        current_index += step;
        if (current_index < -1) {
          current_index = this.results.length - 1;
        } else if (current_index >= this.results.length) {
          current_index = -1;
        }
        if ((_ref1 = this.results[current_index]) != null) {
          _ref1.highlight();
        }
        return this.element.value = this.highlighted != null ? this.highlighted.value : this._val;
      };

      Widget.prototype._getSuggestions = function() {
        var service, _i, _len, _ref, _results;
        if (!this.enabled) {
          return;
        }
        this._val = this.element.value;
        this.error_content = null;
        if (this._val !== '') {
          _ref = this.services;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            service = _ref[_i];
            _results.push(service.search(this._val));
          }
          return _results;
        } else {
          return this._hideResults();
        }
      };

      Widget.prototype._applyStyle = function(attr, value) {
        return this.output.style[attr] = value;
      };

      Widget.prototype._getPosition = function() {
        var coords, el;
        el = this.element;
        coords = {
          top: el.offsetTop + el.offsetHeight,
          left: el.offsetLeft
        };
        while (el = el.offsetParent) {
          coords.top += el.offsetTop;
          coords.left += el.offsetLeft;
        }
        return coords;
      };

      Widget.prototype._hideResults = function() {
        var service, _i, _len, _ref, _results;
        this.visible = false;
        this._applyStyle("display", "none");
        this.results = [];
        _ref = this.services;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          service = _ref[_i];
          _results.push(service.results = []);
        }
        return _results;
      };

      Widget.prototype._displayResults = function() {
        var coords;
        this.visible = true;
        coords = this._getPosition();
        if (this.options.container === document.body) {
          this._applyStyle("left", "" + coords.left + "px");
          this._applyStyle("top", "" + coords.top + "px");
        }
        return this._applyStyle("display", "block");
      };

      Widget.prototype._renderItem = function(content, cls) {
        var item;
        item = document.createElement("li");
        item.innerHTML = content;
        if (cls != null) {
          item.className = cls;
        }
        NeatComplete.addDomEvent(item, "mousedown", (function(_this) {
          return function() {
            return _this.mouseDownOnSelect = true;
          };
        })(this));
        NeatComplete.addDomEvent(item, "mouseup", (function(_this) {
          return function() {
            return _this.mouseDownOnSelect = false;
          };
        })(this));
        return item;
      };

      Widget.prototype._renderFooter = function() {
        return this._renderItem(this.options.footer_content, this.options.footer_class);
      };

      Widget.prototype._renderEmpty = function() {
        return this._renderItem(this.options.empty_content, this.options.empty_class);
      };

      Widget.prototype._servicesReady = function() {
        var service, states, _i, _len, _ref;
        states = [];
        _ref = this.services;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          service = _ref[_i];
          states.push(service.ready);
        }
        return states.indexOf(false) < 0;
      };

      Widget.prototype.showResults = function() {
        var footer, result, service, _i, _j, _len, _len1, _ref, _ref1;
        if (this._servicesReady()) {
          this.results = [];
          this.output.innerHTML = "";
          _ref = this.services;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            service = _ref[_i];
            this.results = this.results.concat(service.results);
          }
          if (this.results.length) {
            this.results = this.results.sort(function(a, b) {
              return b.score - a.score;
            });
            this.results = this.results.slice(0, +(this.getOption("max_results") - 1) + 1 || 9e9);
            _ref1 = this.results;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              result = _ref1[_j];
              this.output.appendChild(result.render());
            }
            if ((this.options.footer_content != null) && (footer = this._renderFooter()) !== "") {
              this.output.appendChild(footer);
            }
            this._displayResults();
          } else if (this.error_content) {
            this.output.appendChild(this._renderItem(this.error_content, this.options.error_class));
            this._displayResults();
          } else {
            if (this.options.empty_content != null) {
              this.output.appendChild(this._renderEmpty());
              this._displayResults();
            } else {
              this._hideResults();
            }
            this.trigger("results:empty");
          }
          this.trigger("results:update");
        }
      };

      Widget.prototype.selectHighlighted = function() {
        this.element.value = this.highlighted.value;
        this._hideResults();
        this.trigger("result:select", this.highlighted.value, this.highlighted.data);
      };

      return Widget;

    })(NeatComplete.Dispatch);
    NeatComplete.Service = (function(_super) {
      __extends(Service, _super);

      function Service(widget, name, search_fn, options) {
        this.widget = widget;
        this.name = name;
        this.search_fn = search_fn;
        this.options = options != null ? options : {};
        this._response = __bind(this._response, this);
        this.results = [];
        this.response = (function(_this) {
          return function(q, data) {
            return _this._response.apply(_this, arguments);
          };
        })(this);
      }

      Service.prototype.search = function(q) {
        this.last_query = q;
        this.ready = false;
        return this.search_fn(q, this.response);
      };

      Service.prototype._response = function(q, data) {
        var datum, _i, _len;
        this.results = [];
        if (this.last_query === q) {
          this.results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            this.results.push(new NeatComplete._Result(this, datum));
          }
          this.ready = true;
          return this.widget.showResults();
        }
      };

      return Service;

    })(NeatComplete.Dispatch);
    NeatComplete._Result = (function() {
      function _Result(service, options) {
        var _ref, _ref1, _ref2, _ref3;
        this.service = service;
        this.options = options;
        this.widget = this.service.widget;
        this.renderer = this.service.options.renderer || this.widget.options.renderer;
        this.value = (_ref = this.options) != null ? _ref.value : void 0;
        this.score = ((_ref1 = this.options) != null ? _ref1.score : void 0) || 0;
        this.identifier = (_ref2 = this.options) != null ? _ref2.identifier : void 0;
        this.data = ((_ref3 = this.options) != null ? _ref3.data : void 0) || {};
      }

      _Result.prototype.render = function() {
        this.li = document.createElement("li");
        this.li.innerHTML = this.renderer != null ? this.renderer(this.value, this.data) : this.value;
        this.li.className = this.widget.options.item_class;
        this.addEvents();
        return this.li;
      };

      _Result.prototype.addEvents = function() {
        NeatComplete.addDomEvent(this.li, "click", (function(_this) {
          return function(e) {
            _this.selectItem();
            if (e.preventDefault) {
              return e.preventDefault();
            } else {
              return e.returnValue = false;
            }
          };
        })(this));
        NeatComplete.addDomEvent(this.li, "mouseover", (function(_this) {
          return function() {
            return _this.highlight();
          };
        })(this));
        NeatComplete.addDomEvent(this.li, "mouseout", (function(_this) {
          return function() {
            return _this.unhighlight();
          };
        })(this));
        NeatComplete.addDomEvent(this.li, "mousedown", (function(_this) {
          return function() {
            return _this.widget.mouseDownOnSelect = true;
          };
        })(this));
        return NeatComplete.addDomEvent(this.li, "mouseup", (function(_this) {
          return function() {
            return _this.widget.mouseDownOnSelect = false;
          };
        })(this));
      };

      _Result.prototype.selectItem = function() {
        this.service.trigger("result:select", this.value, this.data);
        this.widget.highlighted = this;
        return this.widget.selectHighlighted();
      };

      _Result.prototype.highlight = function() {
        var _ref;
        if ((_ref = this.widget.highlighted) != null) {
          _ref.unhighlight();
        }
        this.li.className = "" + this.li.className + " " + this.widget.options.hover_class;
        return this.widget.highlighted = this;
      };

      _Result.prototype.unhighlight = function() {
        this.widget.highlighted = null;
        return this.li.className = this.li.className.replace(new RegExp(this.widget.options.hover_class, "gi"), "");
      };

      return _Result;

    })();
    return NeatComplete;
  });

}).call(this);
