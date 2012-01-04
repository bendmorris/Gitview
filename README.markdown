##gitview

JS widget to list github repositories. To see it in action, visit [gitview.logicalcognition.com](http://gitview.logicalcognition.com).

![Alt text](http://logicalcognition.com/Projects/gitview/demo/images/screenshot.png)

##Supported Browsers

* Safari 4+
* Chrome 9+
* Firefox 4+
* Internet Explorer 8+

##Usage

1. Paste into your page's HEAD

	```console
	<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js" type="text/javascript"></script>
	<script src="http://logicalcognition.com/Projects/gitgraph/gitgraph.js"></script>
	<script src="http://logicalcognition.com/Projects/gitview/gitview.js"></script>
	```

2. From within a <script> tag or a JS file
	
	```console
	var view = new gitview({ 
	  user    : 'bouchon',      // any github username
	  domNode : document.body,  // domNode to attach to
	  small   : false           // if set to true, will display smaller version of widget (no participation graph)
	});
	```
##Issues & Features

File under the Issues section and feel free to fork and pull-request

##License

WTFPL