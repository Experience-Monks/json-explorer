var urlParam = require('urlparam');
var JsonExplorer = require('./index.js');

if(!urlParam('json')) {
	window.location = window.location + '?json=data.json';
}

var jsonExplorer = new JsonExplorer({
	jsonPath: urlParam('json')
});