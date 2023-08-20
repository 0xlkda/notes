Super power!

```JavaScript
function superpower(string, opts = {}) {
    return string + ' empowered'
}

if (!String.prototype.superpower) {
	Object.defineProperty(String.prototype, 'superpower', {
		writable: false,
		value: function (options) {
			return superpower(this, options);
		}
	});
}
```
