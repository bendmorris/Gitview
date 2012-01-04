var Gitview = function(args){
	
	// Builds each repo node
	this.createRepoEntry = function(obj){
		//1. repo container
		var container = dojo.create('div',{
			style:"width:440px;border:1px solid #DDD;border-radius:4px;margin-bottom:10px;background:white"
		},this.domNode);

		//2. top (title, forks, watchers, etc.)
		var top = dojo.create('div',{
			style:"height:32px;line-height:38px;border-bottom:1px solid #DDD;"
		},container);
		
		//3. smiley icon
		var smiley = dojo.create('img',{
			src:'https://a248.e.akamai.net/assets.github.com/images/icons/public.png',
			style:'margin-left:6px'
		},top);
		
		//4. title
		var repoName = dojo.create('a',{
			innerHTML: obj.name,
			href:'https://github.com/'+this.user+'/'+obj.name,
			style:'color:#4183C4;font-size:14px;font-weight:bold;font-family:arial;position:relative;top:-3px;margin-left:6px;'
			+'text-decoration:none',
		},top);
		dojo.connect(repoName,'onmouseover',function(e){ dojo.style(e.target,'textDecoration','underline') });
		dojo.connect(repoName,'onmouseout',function(e){ dojo.style(e.target,'textDecoration','none') });
		
		//5. container for watchers & forks
		var stats = dojo.create('div',{
			style:'display:inline-block;float:right;color:#666;font-size:11px;font-family:arial;font-weight:bold;'
		},top);
		
		//6. language if there is one
		if(obj.language)
			var lang = dojo.create('span',{innerHTML:obj.language,'style':'position:relative;top:-3px;'},stats);
		
		//7. watchers
		var watchers = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_watchers.png"/>&nbsp;<font color="#666;">'+obj.watchers+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/watchers',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;'
		},stats);
		
		//8. forks
		var forks = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_forks.png"/>&nbsp;<font color="#666;">'+obj.forks+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/network',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;margin-right:15px'
		},stats);
		
		//9. bottom (participation graph, last updated)
		var bottom = dojo.create('div',{
			style:'border-bottom-right-radius:3px;border-bottom-left-radius:3px;padding-bottom:5px;padding-top:5px'
		},container);
		if(this.compact)
			dojo.style(bottom,'height','30px');
		if(dojo.isWebKit)
			dojo.style(bottom,'backgroundImage',"-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FAFAFA), to(#EFEFEF))");
		else if(dojo.isFF)
			dojo.style(bottom,'background','-moz-linear-gradient(center top , #FAFAFA, #EFEFEF) repeat scroll 0 0 transparent');
		
		//10. Slice & build repo description
		var d = obj.description;
		if(d.length > 100)
			d = d.slice(0,97)+'...';
		var description = dojo.create('div',{innerHTML:d,style:'font:12px arial;margin-left:9px;'},bottom);
		
		//11. Participation graph & last updated
		if(!this.compact){
			var updated = dojo.create('div',{
				innerHTML:'Last updated '+this.fixUpdateDate(obj.updated_at),
				style:'font:11px arial;color:#888;margin-top:5px;margin-left:9px;'
			},bottom);

			var graph = new Gitgraph({user:this.user,repo:obj.name,domNode:bottom});
			dojo.style(graph,'marginLeft','auto');
			dojo.style(graph,'marginRight','auto');	
			dojo.style(graph,'marginTop','5px');
		}	
	};
	
	// Changes regular formatted date into '1 day ago', '9 hours ago', etc.
	this.fixUpdateDate = function(date){
		// TODO: currently I just return the date as-is, I need to implement this
		return date;
	};
	
	// Dynamically load JS script with callback
	this.loadScript = function(sScriptSrc,callbackfunction) {
		var oHead = document.getElementsByTagName('head')[0];
		if(oHead){	
			var oScript = document.createElement('script');
			oScript.setAttribute('src',sScriptSrc);
			oScript.setAttribute('type','text/javascript');
			var loadFunction = function(){
				if (this.readyState == 'complete' || this.readyState == 'loaded')
					callbackfunction(); 
			};
			oScript.onreadystatechange = loadFunction;
			oScript.onload = callbackfunction;	
			oHead.appendChild(oScript);
		}
	};
	
	// Bind, for browsers not supporting it by default
	this.bind = function (oThis) {
		if (typeof this !== "function")
		  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");

		var aArgs = Array.prototype.slice.call(arguments, 1), 
		    fToBind = this, 
		    fNOP = function () {},
		    fBound = function () {
		      return fToBind.apply(this instanceof fNOP
		                             ? this
		                             : oThis || window,
		                           aArgs.concat(Array.prototype.slice.call(arguments)));
		    };
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
	
	// Get required scripts loaded
	this.bootstrap = function(){
		if(!window.dojo)
			this.loadScript('http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js',this.kickStart.bind(this));
		else
			this.kickStart.bind(this)();
	};
	
	// Kick things off once Gitgraph is loaded
	this.kickStart = function(){
		dojo.ready(this,function(){
			dojo.xhrGet({
				url: 'https://api.github.com/users/'+this.user+'/repos',
				handleAs: 'json',
				sync:true,
				preventCache: true,
				load: dojo.hitch(this,function(data){
					this.repos = data;
				})
			});
			for(var i in this.repos)
				this.createRepoEntry(this.repos[i]);
		});
	};
	
	//Initiatialization
	if(!args || !args.user || !args.domNode){
		throw new Error('Gitview: missing user and/or domNode arg');
	}else{
		this.domNode 	= args.domNode;
		this.user 		= args.user;
		this.repos 		= [];
		this.compact 	= args.compact==true ? true : false;
		
		if (!Function.prototype.bind)
		  Function.prototype.bind = this.bind;
		
		this.loadScript('http://logicalcognition.com/Projects/Gitgraph/Gitgraph.js',this.bootstrap.bind(this));	
	}
};

//Make Jquery folks happy
if (window.jQuery) {
    jQuery.fn.gitview = function (args) {
        if(!args || !args.user){
			throw new Error('Gitview: missing user and/or domNode arg');
		}else{
			this.each(function () {
	            var view = new Gitview({ 
	                user    : args.user,     
	                domNode : $(this)[0], 
	                compact : args.compact || false
	            });
	        });
		}
    };
}