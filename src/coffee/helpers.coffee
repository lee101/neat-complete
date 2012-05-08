
window.NeatComplete ?= {}

NeatComplete.addDomEvent = (elem,event,fn)->
  if elem.attachEvent?
    elem["e#{event}#{fn}"] = fn
    elem["#{event}#{fn}"]= -> elem["e#{event}#{fn}"](window.event)
    elem.attachEvent "on#{event}",elem["#{event}#{fn}"]
  else
    elem.addEventListener event, fn, false
