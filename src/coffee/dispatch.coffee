class NeatComplete.Dispatch

  # Sets value of option
  # @param key [String] name of option
  # @param value [*] value of option
  setOption: (key,value) ->
    @options[key] = value
    @

  # Gets value of option
  # @param key [String] name of option
  getOption: (key) ->
    @options[key]

  # Adds an event listener
  # @param event_name [String] name of event
  # @param callback [Function] callback function to be fired on event
  on: (event_name,callback) ->
    @subs ?= {}
    @subs[event_name] ?= []
    @subs[event_name].push(callback)
    @

  # Manually trigger event
  # @param event_name [String] name of event
  # @param args [*] arguments to be passed to callback
  trigger: (event_name,args...) ->
    if @subs?[event_name]?
      for callback in @subs[event_name]
        `callback.apply(this, args)` #coffeescript does something funky when trying to call the apply method

    @
