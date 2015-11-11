var loadJson = require('load-json-xhr');
var Branch = require('./Branch');
function JsonExplorer(params) {
	params = params || {};
	var _this = this;
	loadJson(params.jsonPath, function(err, data) {
		Branch.call(_this, 'ROOT', data ? data : {});
		document.body.appendChild(_this.domElement);
		if(err) {
			var listItemLabel = document.createTextNode(err.message);
			var listItem = document.createElement('li');
			listItem.appendChild(listItemLabel);
			_this.domElement.appendChild(listItem);
			return;
		}
		_this.expand();
		_this.autoExpandPath();
	});
}

JsonExplorer.prototype = Object.create(Branch.prototype);

JsonExplorer.prototype.autoExpandPath = function() {
	var path = window.location.hash;
	if(!path) return;
	path = path.replace('#/', '');
	this.expandPath(path);
}	

module.exports = JsonExplorer;
