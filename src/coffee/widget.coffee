window.NeatComplete ?= {}

###*
  * Compiled from src/widget.coffee
###

class NeatComplete.Widget
  max_results : 10
  
  constructor:(@element,@options={})->
    console?.log(@element)
    @element.setAttribute 'autocomplete','off'
    @services = []
    @_addListeners()
    @output = document.createElement("ul")
    @output.setAttribute "class", "nc_list"
    @_applyStyle "display",  "none"
    @_applyStyle "position", "absolute"
    document.body.appendChild @output
    
    
  addService:(name,search_function)->
    @services.push new NeatComplete._Service(this,name,search_function)

  on:(event_name,callback)->
    @subs ?= {}
    @subs[event_name] ?= []
    @subs[event_name].push(callback)
  
  trigger:(event_name,args...)->
    callback(args...) for callback in @subs[event_name] if @subs?[event_name]?
  
  _addListeners:->
    NeatComplete.addDomEvent @element, "focus", (e)=>
      @focused = true
    
    NeatComplete.addDomEvent @element, "keypress", (e)=>
      keyCode = e.which || e.keyCode
      if keyCode is 13
        @selectHighlighted() if @highlighted?
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
          @_hideResults()
        when 37,39,13
        else
          clearTimeout(@_timeout) if @_timeout?
          @_timeout = setTimeout(=>
            @_getSuggestions()
          ,400)
  
    NeatComplete.addDomEvent @element, "blur", (e)=>
      unless @mouseDownOnSelect
        @focused = false
        @_hideResults()
      
      
  _moveHighlight:(step)->
    current_index = if @highlighted? then @results.indexOf(@highlighted) else -1
    @highlighted?.unhighlight()
    current_index += step
    if current_index < -1
      current_index = @results.length - 1
    else if current_index >= @results.length
      current_index = -1
    
    @results[current_index]?.highlight()
    @element.value = if @highlighted? then @highlighted.value else @_val
      
  _getSuggestions: ->
    @_val = @element.value
    unless @_val is ''
      for service in @services
        service.search @_val
    else
      @_hideResults()
      
  _applyStyle: (attr,value)->
    @output.style[attr] = value
    
  _getPosition: ()->
    el = @element
    coords =
      top: el.offsetTop + el.offsetHeight
      left: el.offsetLeft
    
    while el = el.offsetParent
      coords.top += el.offsetTop
      coords.left += el.offsetLeft
    coords
  
  _hideResults:->
    
    @_applyStyle "display", "none"
    @results = []
    service.results = [] for service in @services
  
  _displayResults:()->
    coords = @_getPosition()
    @_applyStyle "left", "#{coords.left}px"
    @_applyStyle "top", "#{coords.top}px"
    @_applyStyle "display", "block"
    
  showResults: ()->
    @results = []
    @output.innerHTML = ""
    @results = @results.concat(service.results) for service in @services
    @results = @results.sort (a,b)-> b.score - a.score
    
    @results = @results[0..(@max_results-1)]
    for result in @results
      @output.appendChild(result.render())
    
    if @results.length then @_displayResults() else @_hideResults()
    @trigger "update:results"
    
    
  selectHighlighted: ->
    @element.value = @highlighted.value
    @_hideResults()
    @trigger "select:result", @highlighted.value, @highlighted.data
    