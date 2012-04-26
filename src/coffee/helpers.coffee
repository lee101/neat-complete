###*
  * Copyright 2012 Able Technology
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  * http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
###

window.NeatComplete ?= {}

###*
  * Compiled from src/helpers.coffee
###


NeatComplete.addDomEvent = (elem,event,fn)->
  if elem.attachEvent?
    elem["e#{event}#{fn}"] = fn
    elem["#{event}#{fn}"]= -> elem["e#{event}#{fn}"](window.event)
    elem.attachEvent "on#{event}",elem["#{event}#{fn}"]
  else
    elem.addEventListener event, fn, false
