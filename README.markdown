##Gitview

JS widget to list github repositories. Mimics dashboard style. To see it in action, visit [gitview.logicalcognition.com](http://gitview.logicalcognition.com).

Regular


![Alt text](http://logicalcognition.com/Projects/Gitview/demo/images/screenshot.png)

Small


![Alt text](http://logicalcognition.com/Projects/Gitview/demo/images/screenshotSmall.png)

##Supported Browsers

* Safari 4+
* Chrome 9+
* Firefox 4+
* Internet Explorer 8+

##Usage

* Paste into your page's HEAD

	```console
	<script src="http://logicalcognition.com/Projects/Gitview/Gitview.js"></script>
	```

* From within a script tag or a JS file
	
	```console
	var view = new Gitview({ 
	  user    : 'bouchon',      // any github username
	  domNode : document.body,  // domNode to attach to
	  height  : '400px',        // (optional) height of widget
	  width   : '450px',         // (optional) width of widget
	  compact : false,          // (optional) compact mode or full mode?
	  noFrame : false,          // (optional) no fancy widget frame, just repositories
	});
	```
	
* Or use it as a jQuery plugin
	
	```console
	$('#foo').gitview({
	  user: 'bouchon',      // any github username
	  height  : '400px',    // (optional) height of widget
	  width   : '450px',    // (optional) width of widget
	  compact : false,      // (optional) compact mode or full mode?
	  noFrame : false,      // (optional) no fancy widget frame, just repositories
	});
	```
	
FYI, the script uses a little Dojo, and will require it if its not already loaded. Nothing to worry about! Thanks @teddyzetterlund .
	
##Issues & Features

File under the Issues section and feel free to fork and pull-request

##License

WTFPL