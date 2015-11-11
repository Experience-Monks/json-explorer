function Branch(name, data) {
	data = data || {};
	var domElement = document.createElement('ul');
	var listItem = document.createElement('li');
	var nameString = name;
	var container = listItem;
	var linkItem;
	if(Object.keys(data).length > 0) {
		linkItem = document.createElement('a');
		container = linkItem;
		listItem.appendChild(linkItem);
	}

	var listItemLabel = document.createTextNode(nameString);
	domElement.appendChild(listItem);
	container.appendChild(listItemLabel);

	this.children = [];
	this.domElement = domElement;
	this.name = name;
	this.linkItem = linkItem;
	this.data = data;

	Object.defineProperty(this, 'parent', {
		set: function(parent) {
			if(parent) {
				parent.domElement.appendChild(this.domElement);
			} else if(this._parent){
				this._parent.domElement.removeChild(this.domElement);
			}
			this._parent = parent;
			if(this.linkItem && parent) this.linkItem.href = '#' + this.collectPath();
		},
		get: function() {
			return this._parent;
		}
	})

	listItem.onclick = this.onClick.bind(this);
	listItem.style.cursor = 'pointer';
}

Branch.prototype.add = function(child) {
	this.children.push(child);
	child.parent = this;
}

Branch.prototype.pruneSiblings = function() {
	if(!this.parent) return;
	var children = this.parent.children;
	for (var i = children.length - 1; i >= 0; i--) {
		if(this !== children[i]) children[i].removeChildren();
	};
}

Branch.prototype.removeChildren = function() {
	var children = this.children;
	for (var i = children.length - 1; i >= 0; i--) {
		children[i].removeChildren();
		children[i].parent = null;
	};
	children.length = 0;
}

Branch.prototype.expand = function() {
	this.pruneSiblings();
	this.removeChildren();
	var _this = this;
	var data = this.data;
	for(var key in data) {
		var branch = new Branch(key, data[key]);
		_this.add(branch);
	}
}

Branch.prototype.onClick = function(event) {
	event.stopPropagation();
	this.expand();
}

Branch.prototype.collectPath = function() {
	var path = '';
	if(this.parent) {
		path += this.parent.collectPath() + '/' + this.parent.children.indexOf(this);
	}
	return path;
}

Branch.prototype.expandPath = function(path) {
	this.expand();
	if(!path) return;
	var chunks = path.split('/');
	var index = Number(chunks.shift());
	this.children[index].expandPath(chunks.join('/'));
}
module.exports = Branch;