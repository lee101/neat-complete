var input, widget;
var birds = ["kakapo","kea","kiwi","pukeko","moa","tui","weka"];

function addInputAndWidget(){
  input = $("<input>").prop("type","text").appendTo($("body"));
  widget = new NeatComplete.Widget(input[0]);
  deepEqual(widget.element, input[0], "widget have set element");
  ok($("ul.nc_list"),"should have appended output list")
}
function removeElements(){
  input.remove();
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
  }, teardown:function(){
    removeElements();
  }
});

test("Show 'k' results",function(){
  input.val("k");
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
});

test("Select first match",function(){
  input.val("k");
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
  widget.highlighted = widget.results[0];
  widget.selectHighlighted();
  equal(widget.element.value,"kakapo","input should be populated with first result");
});

test("Show no matches",function(){
  input.val("asdf");
  widget._getSuggestions();
  equal($("li.nc_item",widget.output).length, 0,"should show no results");
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
  }, teardown:function(){
    removeElements();
  }
});

asyncTest("Show 'k' results",function(){
  input.val("k");
  widget.on("update:results",function(){
    equal($("li.nc_item",widget.output).length, 3,"should show 3 results");
    start()
  });
  widget._getSuggestions();
});



// // Let's test this function  
// function isEven(val) {  
//     return val % 2 === 0;  
// }  
//   
// test('isEven()', function() { 
//     ok(isEven(0), 'Zero is an even number'); 
//     ok(isEven(2), 'So is two'); 
//     ok(isEven(-4), 'So is negative four'); 
//     ok(!isEven(1), 'One is not an even number'); 
//     ok(!isEven(-7), 'Neither is negative seven');  
// })
// 
// test('assertions', function() {  
//     equal( 1, 1, 'one equals one');  
//     
//     deepEqual( {}, {}, 'passes, objects have the same content');  
//     deepEqual( {a: 1}, {a: 1} , 'passes');  
//     deepEqual( [], [], 'passes, arrays have the same content');  
//     deepEqual( [1], [1], 'passes');
// })
// 
// function ajax(successCallback) {  
//     $.getJSON('./mocks/abc.json', successCallback  );  
// }  
// 
// 
// asyncTest('asynchronous test', function() {  
//     ajax(function(data) {  
//         ok(data.abc);  
//   
//         // After the assertion has been called,  
//         // continue the test  
//         start();  
//     }) ;
// })
// 
// 
// module('Module A');  
// test('a test', function() {expect(0) });  
// test('an another test', function() {expect(0) });  
//   
// module('Module B');  
// test('a test', function() {expect(0) });  
// test('an another test', function() {expect(0) });


