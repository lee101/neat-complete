Neat Complete
=============
[![Build Status](https://secure.travis-ci.org/AbleTech/neat-complete.png?branch=master)](http://travis-ci.org/AbleTech/neat-complete)

A light-weight and library-less widget for simple autocompletion.

Integrating
-----------
Simple example using jQuery:
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link href="./lib/neat_complete.css" rel='stylesheet'>
</head>
<body>
  <input type='text' id='ac_field' />

  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script type="text/javascript" src='./lib/neat-complete.min.js'></script>
  <script type="text/javascript">
    var widget;

    $(document).ready(function(){
      widget = new NeatComplete.Widget(document.getElementById('ac_field'));
      widget.addService('demo',function(query, callback_fn){
        $.getJSON("/path/to/service.json", function(data){
          var results = $.map(data, function(result){
            return { value: result.name, data: result }
          });
          callback_fn(query, results);
        });
      });
    });
  </script>
</body>
</html>
```
See more [examples](http://abletech.github.io/neat-complete/).


Contributing
------------
### Prerequisites

* node.js - http://nodejs.org/

* gulp - http://gulpjs.com/

* bower - http://bower.io/

### Setup
```sh
$ npm install
$ bower install
```

### Development Compiling

```sh
$ gulp serve
```

### Production Compiling

```sh
$ gulp
```

### Running Tests

```sh
$ gulp test
```

### Deploying to Rails Assets
1. Create a release on github, tagged with the version number
2. Bower will automatically pick up the new version
3. Make the new version available to Bundler by entering it on https://rails-assets.org/components/new

### Documentation
Hosted on: http://coffeedoc.info/github/AbleTech/neat-complete/master/
