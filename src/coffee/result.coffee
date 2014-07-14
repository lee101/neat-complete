# @private
class NeatComplete._Result
  constructor:(@service,@options)->
    @widget       = @service.widget
    @renderer     = @service.options.renderer || @widget.options.renderer
    @value        = @options?.value
    @score        = @options?.score || 0
    @identifier   = @options?.identifier
    @data         = @options?.data || {}


  render:->
    @li = document.createElement("li")
    @li.innerHTML = if @renderer? then @renderer(@value,@data) else @value
    @li.className = @widget.options.item_class
    @addEvents()
    @li

  addEvents:->
    NeatComplete.addDomEvent @li, "click", (e)=>
      @selectItem()
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

  selectItem:->
    @service.trigger("result:select",@value,@data)
    @widget.highlighted = @
    @widget.selectHighlighted()

  highlight:->
    @widget.highlighted?.unhighlight()
    @li.className = "#{@li.className} #{@widget.options.hover_class}"
    @widget.highlighted = @

  unhighlight:->
    @widget.highlighted = null
    @li.className = @li.className.replace(new RegExp(@widget.options.hover_class,"gi"),"")
