# Class for creating new widget
#
# @example
#   var widget = new NeatComplete.Widget(document.getElementById('search_field'));
#   widget.addService('basic',function(){});
#
class NeatComplete.Widget extends NeatComplete.Dispatch
  
  # Creates a new widget
  # @param element [HTMLElement] input element
  # @param options [object] options
  constructor: (@element,@options={}) ->
    @element.setAttribute 'autocomplete','off'
    @services = []
    @_applyDefaults()
    @_addListeners()
    @output = document.createElement("ul")
    @output.setAttribute "class", @options.list_class
    @_applyStyle "display",  "none"
    @_applyStyle "position", "absolute"
    document.body.appendChild @output
    @
 
  defaults:
    max_results : 10
    list_class  : 'nc_list'
    item_class  : 'nc_item'
    hover_class : 'nc_hover'
    footer_class: 'nc_footer'
    empty_class : 'nc_empty'

  
  # Add a new service 
  # @param [string] name of service
  # @param [function] search function
  # @param [object] options
  addService: (name,search_function,options={}) ->
    @services.push new NeatComplete._Service(this,name,search_function,options)
    @
    
  # @private  
  _applyDefaults: ->
    for key, value of @defaults
      @setOption(key,value) unless @getOption(key)?
  
  # @private
  _addListeners: ->
    NeatComplete.addDomEvent @element, "focus", (e)=>
      @focused = true
    
    NeatComplete.addDomEvent @element, "keypress", (e)=>
      keyCode = e.which || e.keyCode
      if keyCode is 13
        @highlighted?.selectItem()
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
          @highlighted?.selectItem()
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
      
  # @private    
  _moveHighlight: (step) ->
    current_index = if @highlighted? then @results.indexOf(@highlighted) else -1
    @highlighted?.unhighlight()
    current_index += step
    if current_index < -1
      current_index = @results.length - 1
    else if current_index >= @results.length
      current_index = -1
    
    @results[current_index]?.highlight()
    @element.value = if @highlighted? then @highlighted.value else @_val
  
  # @private    
  _getSuggestions: ->
    @_val = @element.value
    unless @_val is ''
      for service in @services
        service.search @_val
    else
      @_hideResults()
  
  # @private    
  _applyStyle: (attr,value) ->
    @output.style[attr] = value
  
  # @private  
  _getPosition: ->
    el = @element
    coords =
      top: el.offsetTop + el.offsetHeight
      left: el.offsetLeft
    
    while el = el.offsetParent
      coords.top += el.offsetTop
      coords.left += el.offsetLeft
    coords
  
  # @private
  _hideResults: ->
    
    @_applyStyle "display", "none"
    @results = []
    service.results = [] for service in @services
  
  # @private
  _displayResults: ->
    coords = @_getPosition()
    @_applyStyle "left", "#{coords.left}px"
    @_applyStyle "top", "#{coords.top}px"
    @_applyStyle "display", "block"
  
  # @private
  _renderItem: (content,cls) ->
    item = document.createElement("li")
    item.innerHTML = content
    item.setAttribute "class", cls if cls?
    item 
  
  # @private  
  _renderFooter: ->
    @_renderItem @options.footerContent, @options.footer_class
  
  # @private  
  _renderEmpty: ->
    @_renderItem @options.emptyContent, @options.empty_class
  
  # @private
  _servicesReady: ->  
    states = []
    states.push(service.ready) for service in @services
    states.indexOf(false) < 0
  
  # @private
  showResults: ->
    if @_servicesReady()
      @results = []
      @output.innerHTML = ""
      @results = @results.concat(service.results) for service in @services
      
      if @results.length 
        @results = @results.sort (a,b)-> b.score - a.score
        @results = @results[0..(@getOption("max_results")-1)]
        for result in @results
          @output.appendChild(result.render())
        
        if @options.footerContent? and (footer = @_renderFooter()) != ""
          @output.appendChild(footer)
        @_displayResults()
      else if @options.emptyContent?
        @output.appendChild(@_renderEmpty())
        @_displayResults()
        @trigger "results:empty"
      else @_hideResults()
      
      @trigger "results:update"
    
  # @private  
  selectHighlighted: ->
    @element.value = @highlighted.value
    @_hideResults()
    @trigger "result:select", @highlighted.value, @highlighted.data
    