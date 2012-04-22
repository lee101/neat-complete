window.NeatComplete or= {}

###*
  * Compiled from src/widget.coffee
###

class NeatComplete.Widget
  constructor:(@element,@options={})->
    console?.log(@element)
    @services = []
    @_addListeners()
    
  addService:(name,search_function)->
    @services.push new NeatComplete.Service(this,name,search_function)


  _addListeners:->
    NeatComplete.addDomEvent @element, "keypress", (e)=>
      keyCode = e.which || e.keyCode
      if keyCode is 13
        @selectHighlighted()
        if e.preventDefault 
          e.preventDefault()
        else
          e.returnValue = false
        false
    
    NeatComplete.addDomEvent @element, "keydown", (e)=>
      keyCode = e.which || e.keyCode
      switch keyCode
        when 38
          @_moveHighlight(-1)
          false
        when 40
          @_moveHighlight(1)
          false
        when 9
          @_selectHighlighted() if @_highlighted?
        when 27
          @_removeSuggestions()
        when 37,39,13
        else
          clearTimeout(@_timeout) if @_timeout?
          @_timeout = setTimeout(=>
            @_getSuggestions()
          ,400)
  
  _moveHighlight:(step)->
    console?.log("Stepped: #{step}")
    
  _selectHighlighted: ->
    console?.log("Selected")
    
  _getSuggestions: ->
    @_val = @element.value
    console?.log(@_val)
      