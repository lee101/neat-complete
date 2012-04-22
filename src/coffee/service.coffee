window.NeatComplete or= {}

###*
  * Compiled from src/service.coffee
###

class NeatComplete.Service

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
      @results = data
      @widget.showResults()