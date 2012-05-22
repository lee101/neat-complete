# @author Able Technology Consulting Ltd.
# @version 0.0.1

"use strict";

window.NeatComplete ?= {}

class NeatComplete.Dispatch
  setOption:(name,value)->
    @options[name] = value
    @
  
  getOption:(name)->
    @options[name]
  
  on:(event_name,callback)->
    @subs ?= {}
    @subs[event_name] ?= []
    @subs[event_name].push(callback)
    @

  trigger:(event_name,args...)->
    callback(args...) for callback in @subs[event_name] if @subs?[event_name]?
    @
  