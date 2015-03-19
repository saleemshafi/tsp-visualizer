;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');
  sigma.utils.pkg('sigma.utils');

  
  sigma.classes.graph.addMethod('clearEdges', function() {
	  this.edges().forEach(function(edge) {
		 this.dropEdge(edge.id); 
	  }, this);
	  
	  return this;
  });
  
  sigma.parsers.tsp = {
	fileNodes: parseNodesFromFile,
	nodes: parseNodes,
	fileEdges: parseEdgesFromFile,
	edges: parseEdges
  }
  
  function parseFromFile(url, parser, callback) {
    var xhr = sigma.utils.xhr();

    if (!xhr)
      throw 'XMLHttpRequest not supported, cannot load the file.';

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
    	  var data = xhr.responseText;
    	  var parsedData = parser(data);
          // Call the callback if specified:
          if (callback) {
              callback(parsedData);
          }
      }
    };
    xhr.send();
  }
  
  function parseNodesFromFile(url, sigma, callback) {
	  parseFromFile(url, function(data) {
    	  parseNodes(data, sigma);
    	  return sigma;
	  }, callback)
  }

  function parseEdgesFromFile(url, sigma, callback) {
	  parseFromFile(url, function(data) {
    	  parseEdges(data, sigma);
    	  return sigma;
	  }, callback)
  }
  
  
  function parseNodes(data, sigma) {
	  var g = sigma.graph;
	  g.clear();
	  var lines = data.split("\n")
	  lines.forEach(function(line, index) {
		  var coords = line.split(" ");
		  if (coords.length == 2) {
			  g.addNode( {
				id: "n"+index,
				label: (index)+" ("+coords[0]+","+coords[1]+")",
				x: coords[0],
				y: coords[1],
				size: 1
			  });
		  }
	  });
  }
  
  function parseEdges(data, sigma) {
	  var g = sigma.graph;
	  g.clearEdges();
	  
	  var nodeNumbers = data.split(" ");
	  // filter out the double-spaces
	  nodeNumbers = nodeNumbers.filter(function(elem) {
		  return elem.length > 0;
	  });
	  nodeNumbers.forEach(function(nodeNum, index) {
		  g.addEdge({
			  id: "e"+index,
			  source: "n"+nodeNumbers[index],
			  target: "n"+nodeNumbers[index < nodeNumbers.length - 1 ? index+1 : 0],
		  });
	  });
  	}
  
}).call(this);
