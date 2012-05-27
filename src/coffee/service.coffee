window.NeatComplete ?= {}

class NeatComplete.Service extends NeatComplete.Dispatch

  # @private
  constructor: (@widget, @name, @search_fn, @options={}) ->
    @results = []    
    @response = (q,data)=>
      @_response.apply(@,arguments)

  # @private
  search: (q) ->
    @last_query = q
    @ready = false
    @search_fn(q,@response)

  # @private
  _response: (q,data) =>
    @results = []
    if @last_query is q
      @results = []
      for datum in data
        @results.push new NeatComplete._Result(@, datum)
      @ready = true
      @widget.showResults()