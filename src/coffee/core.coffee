(
  (root, factory)->
    if typeof define is 'function' && define.amd
      define -> factory(root)
    else
      root.NeatComplete = factory(root)
)(this, (root)->
  NeatComplete = {}

  # @include helpers.coffee

  # @include dispatch.coffee

  # @include widget.coffee

  # @include service.coffee
  
  # @include result.coffee

  NeatComplete
)
