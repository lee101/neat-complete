window.NeatComplete ?= {}

# @private
class NeatComplete._Service extends NeatComplete.Dispatch

  constructor:(@widget, @name, @search_fn, @options={})->
    @results = []    
    @response = (q,data)=>
      @_response.apply(@,arguments)

  search:(q)->
    @last_query = q
    @ready = false
    @search_fn(q,@response)

  _response:(q,data)=>
    @results = []
    if @last_query is q
      @results = []
      for datum in data
        @results.push new NeatComplete._Result(@, datum)
      @ready = true
      @widget.showResults()