window.NeatComplete ?= {}

###*
  * Compiled from src/result.coffee
###

class NeatComplete._Result
  constructor:(@service,@options)->
    @widget       = @service.widget
    @value        = @options?.value
    @score        = @options?.score || 0
    @identifier   = @options?.identifier
    @data         = @options?.data || {}
    
  render:->
    @li = document.createElement("li")
    @li.innerHTML = @value
    @li.setAttribute "class", "nc_item"
    @addEvents()
    @li
  
  addEvents:->
    NeatComplete.addDomEvent @li, "click", (e)=>
      @widget.selectHighlighted()
      if e.preventDefault
        e.preventDefault()
      else
        e.returnValue = false
    
    NeatComplete.addDomEvent @li, "mouseover", =>
      @highlight()
    NeatComplete.addDomEvent @li, "mouseout", =>
      @unhighlight()
    NeatComplete.addDomEvent @li, "mousedown",=>
      @widget.mouseDownOnSelect = true
    NeatComplete.addDomEvent @li, "mouseup", =>
      @widget.mouseDownOnSelect = false
      
    
      
  highlight:->
    @widget.highlighted?.unhighlight()
    @li.className = "#{@li.className} nc_hover"
    @widget.highlighted = @
    
  unhighlight:->
    @widget.highlighted = null
    @li.className = @li.className.replace(new RegExp("nc_hover","gi"),"")