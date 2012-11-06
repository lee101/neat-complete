var input,
    widget,
    birds = ["kakapo","kea","kiwi","pukeko","moa","tui","weka"];

function addInputAndWidget(){
  input = document.createElement("input");
  input.type = "text";
  document.body.appendChild(input);
  widget = new NeatComplete.Widget(input);
  deepEqual(widget.element, input, "widget have set element");
  ok($("ul.nc_list"),"should have appended output list")
}

function removeElements(){
  document.body.removeChild(input);
  $("ul.nc_list").remove();
  widget = null;
}

module("Array Search",{
  setup: function(){
    addInputAndWidget();
    widget.addService("mock_array",function(query,response_fn){
      results = [];
      $.each(birds,function(i,bird){
        if (bird.indexOf(query)==0){
          results.push({value:bird,score:10});
        }
      });
      response_fn(query,results);
    });
  },
  teardown:function(){
    removeElements();
  }
});

test("Show 'k' results",function(){
  input.value = "k";
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
});

test("Select first match",function(){
  input.value = "k";
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
  widget.highlighted = widget.results[0];
  widget.selectHighlighted();
  equal(widget.element.value,"kakapo","input should be populated with first result");
});

test("Show no matches",function(){
  input.value = "asdf";
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 0,"should show no results");
  ok($(widget.output).is(":hidden"), "output should be hidden");
});


module("Ajax Search",{
  setup:function(){
    addInputAndWidget();
    widget.addService("mock_ajax",function(query,response_fn){
      $.getJSON("mocks/"+escape(query)+".json",{},function(data){
        results = $.map(data.results,function(bird){
          return {value:bird,score:100};
        });
        response_fn(query,results);
      });
    });
  },
  teardown:function(){
    removeElements();
  }
});

asyncTest("Show 'k' results",function(){
  input.value = "k";
  widget.on("results:update",function(){
    equal(this, widget, "event listener should be scoped to widget");
    equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
    start()
  });
  widget._getSuggestions();
});

asyncTest("Show no results",function(){
  input.value = "asdf";
  widget.on("results:update",function(){
    equal(this, widget, "event listener should be scoped to widget");
    equal($("li.nc_item",widget.output).length, 0,"should show no results");
    ok($(widget.output).is(":hidden"), "output should be hidden");
    start()
  });
  widget._getSuggestions();
});

module("Multiple Services",{
  setup:function(){
    addInputAndWidget();
    widget.addService("mock_ajax",function(query,response_fn){
      $.getJSON("mocks/"+escape(query)+".json",{},function(data){
        results = $.map(data.results,function(bird){
          return {value:bird,score:100};
        });
        response_fn(query,results);
      });
    });
    widget.addService("mock_array",function(query,response_fn){
      results = [];
      $.each(birds,function(i,bird){
        if (bird.indexOf(query)==0){
          results.push({value:bird,score:10});
        }
      });
      response_fn(query,results);
    });
    equal(widget.services.length, 2, "should have two services");
  },
  teardown:function(){
    removeElements();
  }
});

asyncTest("Show 'k' results",function(){
  input.value = "k";
  widget.on("results:update",function(){
    equal(this, widget, "event listener should be scoped to widget");
    equal($("li.nc_item",widget.output).length, 6,"should show 6 results");
    start()
  });
  widget._getSuggestions();
});

asyncTest("Show no results",function(){
  input.value = "asdf";
  widget.on("results:update",function(){
    equal(this, widget, "event listener should be scoped to widget");
    equal($("li.nc_item",widget.output).length, 0,"should show no results");
    ok($(widget.output).is(":hidden"), "output should be hidden");
    start()
  });
  widget._getSuggestions();
});


module("Error message", {
  setup: function(){
    addInputAndWidget();
    widget.addService("always_error", function(query,response_fn){
      this.widget.error_content = "Something went wrong";
      response_fn(query, []);
    });
  },
  teardown:function(){
    removeElements();
  }
});
test("Show error message",function(){
  input.value = "asdf";
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 0,"should show no results");
  equal($("li.nc_error", widget.output).text(), "Something went wrong", "should display error message");
  ok($(widget.output).is(":visible"), "output should not be hidden");
});
