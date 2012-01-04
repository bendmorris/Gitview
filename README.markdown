##gitview

JS widget to list github repositories. To see it in action, visit [gitview.logicalcognition.com](http://gitview.logicalcognition.com).

![Alt text](http://logicalcognition.com/Projects/crisp.js/demo/screenshot.png)

##Supported Browsers

* Safari 4+
* Chrome 9+
* Firefox 4+
* Internet Explorer 8+

##Usage
###Build a fricken button
```console
var button = crisp.create({innerHTML: 'click me'});
```
###Build a fricken button and place it in the DOM
```console
var button = crisp.create({innerHTML: 'click me'});
document.getElementById('foo').appendChild(button);
```
###Build a fricken button using all config options
```console
var args = {
innerHTML: 'gordon',	// button text
width: '100px',		// button width
height: '40px',		// button height
color: '#FF0022',	// text color
bgColor: 'green',	// background color
fontFamily: 'Arial',	// font face
fontSize: '20px'	// font size
}
```
###Further
A button is just a regular element. To change its look or feel more than the in the example above, just create it and style it like you would any other element. Same goes for registering event handlers and positioning.

##License

WTFPL