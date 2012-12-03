[Gitview](http://bitpshr.info/gitview)
=================

Framework-agnostic JavaScript widget to list GitHub repositories & participation.

##Usage
1. Paste right before your page's closing `</body>` tag
```console
<script src="Gitview.min.js"></script>
```

2. From within a script tag or a JS file
```javascript
    var Gitview({ 
		user       : 'dojo',         // any github username
		domNode    : document.body,  // (optional) domNode to attach to
		count      : 4,              // (optional) number of repos per widget page
		showForks  : true,           // (optional) show forked repos, true by default
		width      : '500px',        // (optional) width of widget / repos
		theme 	   : "dark",  		 // (optional) light or dark theme
		compact    : false           // (optional) compact mode or full mode?
	});
```

##Limitations
GitHub hasn't exposed participation data via the [api](http://developer.github.com/v3/) yet, but plans to. Until then, requests funnel through a [simple proxy](http://benalman.com/code/projects/php-simple-proxy/docs/files/ba-simple-proxy-php.html) via [my vps](http://bitpshr.info).

##License
[WTFPL](http://sam.zoy.org/wtfpl/)