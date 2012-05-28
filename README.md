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
          widget.addService('demo',function(){
            
          });
        });
      </script>
    </body>
    </html>
```
See more <a href="http://abletech.github.com/neat-complete/demo" target="_parent">examples</a>.



Contributing
------------
### Prerequisites

* node.js - http://nodejs.org/

```sh
    $ brew install node
```

* node package manager - http://npmjs.org/

```sh
    $ curl http://npmjs.org/install.sh | sh
```
* coffeescript

```sh
    $ npm install -g coffee-script
```
* uglifyjs

```sh
    $ npm install -g uglify-js
```
* sass gem

```sh
    $ gem install sass
```
* codo (for generating docs)

```sh
    $ npm install -g codo
```

### Development Compiling

```sh
    $ cake watch
```

### Production Compiling

```sh
    $ cake build
```    

### Updating Docs

```sh
    $ codo
```