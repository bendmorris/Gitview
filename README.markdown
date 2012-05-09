##Gitview

JS widget to list github repositories. Mimics dashboard style. [Demo](http://bouchon.github.com/Gitview).

##Usage

* Make sure you're using the HTML5 doctype at the top of your html

	```console
	<!DOCTYPE html>
	```

* Paste into your page's HEAD

	```console
	<script src="http://logicalcognition.com/Projects/Gitview/Gitview.js"></script>
	```

* From within a script tag or a JS file
	
	```javascript
	var view = new Gitview({ 
	  user       : 'bouchon',      // any github username
	  domNode    : document.body,  // (optional) domNode to attach to
	  count      : 2,              // (optional) number of repos per widget page
	  showForks  : true,           // (optional) show forked repos, true by default
	  width      : '450px',        // (optional) width of widget / repos
	  frameColor : 'grey',         // (optional) frame background color
	  compact    : false,          // (optional) compact mode or full mode?
	  noFrame    : false,          // (optional) no fancy widget frame, just repositories
	  cache		 : true            // (optional) turn local caching on or off, on by default
	});
	```
	
* Or use it as a jQuery plugin
	
	```javascript
	$('#foo').gitview({
	  user       : 'bouchon',      // any github username
	  count      : 2,              // (optional) number of repos per widget page
	  showForks  : true,           // (optional) show forked repos, true by default
	  width      : '450px',        // (optional) width of widget / repos
	  frameColor : 'grey',         // (optional) frame background color
	  compact    : false,          // (optional) compact mode or full mode?
	  noFrame    : false,          // (optional) no fancy widget frame, just repositories
	  cache		 : true            // (optional) turn local caching on or off, on by default
	});
	```
	
FYI, the script uses a little Dojo, and will require it if its not already loaded. Nothing to worry about! Thanks @teddyzetterlund .

##Issues & Features

File under the Issues section or feel free to fork and pull-request

##License

WTFPL