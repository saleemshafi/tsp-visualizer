;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');
  sigma.utils.pkg('sigma.utils');

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
  
  function parseNodesFromFile(url, graph, callback) {
	  parseFromFile(url, function(data) {
    	  graph.nodes = parseNodes(data);
    	  return graph;
	  }, callback)
  }

  function parseEdgesFromFile(url, graph, callback) {
	  parseFromFile(url, function(data) {
    	  graph.edges = parseEdges(data);
    	  return graph;
	  }, callback)
  }
  
  
  function parseNodes(data) {
	  var nodes = [];
	  var lines = data.split("\n")
	  lines.forEach(function(line) {
		  var coords = line.split(" ");
		  if (coords.length == 2) {
			  var newNode = {
				id: "n"+nodes.length,
				label: (nodes.length)+" ("+coords[0]+","+coords[1]+")",
				x: coords[0],
				y: coords[1],
				size: 1
			  };
			  nodes.push(newNode);
		  }
	  });
	  return nodes;
  }
  
  function parseEdges(data) {
	  var edges = [];
	  var nodeNumbers = data.split(" ");
	  nodeNumbers = nodeNumbers.filter(function(elem) {
		  return elem.length > 0;
	  });
	  for (var i = 0; i < nodeNumbers.length - 1; i++) {
		  edges.push({
			  id: "e"+edges.length,
			  source: "n"+nodeNumbers[i],
			  target: "n"+nodeNumbers[i+1],
			  color: '#CCCCCC'
		  });
	  }
	  if (nodeNumbers.length > 1) {
		  edges.push({
			  id: "e"+edges.length,
			  source: "n"+nodeNumbers[nodeNumbers.length-1],
			  target: "n"+nodeNumbers[0],
			  color: '#CCCCCC'
		  });
	  }
	  return edges;
  }
  
}).call(this);
