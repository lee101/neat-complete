window.NeatComplete ?= {}

###*
  * Compiled from src/service.coffee
###

class NeatComplete._Service

  constructor:(@widget, @name, @search_fn, @options={})->
    @results = []    
    @response = (q,data)=>
      @_response.apply(@,arguments)

  search:(q)->
    @last_query = q
    @search_fn(q,@response)

  _response:(q,data)=>
    @results = []
    if @last_query is q
      @results = []
      for datum in data
        @results.push new NeatComplete._Result(@, datum)
      console?.log @results
      @widget.showResults()