var Gitview = function(args){
	// Builds optional outer frame
	this.createFrame = function(){
		var outer = dojo.create('div',{
			style:'line-height:15px;padding:5px 5px 0px 5px;background:grey;border-radius:5px;width:'+this.w+';height:'+this.h+';'
		},this.domNode);
		var inner = dojo.create('div',{
			style:'height:100%;overflow-y:auto;width:'+this.w+';'
		},outer);
		if(this.h == 'auto')
			dojo.style(inner,'overflowY','hidden');
		this.domNode = inner;
		dojo.style(outer,'textAlign','left');
	};
	
	// Builds frame header (if frame arg is set to true)
	this.createFrameHeader = function(data){
		//1. avatar
		dojo.create('img',{src:data.avatar_url,style:'width:40px;height:auto;border-radius:2px;'},this.domNode,'before');
		
		//2. user name
		dojo.create('span',{
			innerHTML:data.login+'<br>',
			style:'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;color:white;font-weight:bold;'
			+'position:relative;top:-25px;left:6px'
		},this.domNode,'before');
		
		//3. followers
		var t = dojo.create('span',{
			innerHTML:data.followers+' follower',
			style:'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:12px;color:#AAA;'
			+'position:relative;top:-26px;margin-left:45px'
		},this.domNode,'before');
		if(data.followers > 1 || data.followers == 0)
			t.innerHTML += 's';
		
		//4. repos
		var v = dojo.create('span',{
			innerHTML:' - '+data.public_repos+' repositor',
			style:'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:12px;color:#AAA;'
			+'position:relative;top:-26px;'
		},this.domNode,'before');
		if(data.public_repos > 1 || data.public_repos == 0)
			v.innerHTML += 'ies';
		else
			v.innerHTML += 'y'
			
		//5. toggle full / compact buttons
		var x = dojo.create('span',{
			innerHTML:'compact',
			style:'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10px;color:#AAA;'
			+'position:relative;top:-12px;float:right;cursor:hand;cursor:pointer;margin-left:5px;'
		},this.domNode,'before');
		var w = dojo.create('span',{
			innerHTML:'full',
			style:'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10px;color:#AAA;'
			+'position:relative;top:-12px;float:right;cursor:hand;cursor:pointer;'
		},this.domNode,'before');
		
		//6. connect things
		dojo.style(this.domNode,'position','relative');
		dojo.style(this.domNode,'top','-17px');
		dojo.connect(window,'resize',this,'resize');
		dojo.connect(w,'onclick',this,'toggleFull');
		dojo.connect(x,'onclick',this,'toggleCompact');
		this.resize();
	};
	
	// Builds each repo node
	this.createRepoEntry = function(obj,showAsCompact){
		//1. repo container
		var container = dojo.create('div',{
			style:"text-align:left;border:1px solid #DDD;border-radius:4px;margin-bottom:10px;background:white;"
		},this.domNode);
		if(!this.frame) dojo.style(container,'width',this.w);
		
		//2. build top section
		var top = this.createTop(obj, container);
		
		//3. bottom (if we are not in compact mode participation graph, last updated)
		if(!this.compact) var bottom = this.createBottom(obj, container);	
		
		//4. Add custom class depending on whether compact or not for future queries
		if(this.compact){
			dojo.style(container,'marginBottom','5px');
			dojo.addClass(container,['c','check']);
			if(!showAsCompact)
				dojo.style(container,'display','none');	
		}else{
			dojo.addClass(container,['f','check']);
			if(showAsCompact)
				dojo.style(container,'display','none');	
		}
	};
	
	// Builds entry top (title, forks, watchers, etc.)
	this.createTop = function(obj, container){
		//1. top (title, forks, watchers, etc.)
		var top = dojo.create('div',{ style:"height:32px;line-height:38px;border-bottom:1px solid #DDD;" },container);
		if(this.compact) dojo.style(top,'borderBottom','0px');
		
		//2. smiley icon
		dojo.create('img',{
			src:'https://a248.e.akamai.net/assets.github.com/images/icons/public.png',
			style:'margin-left:6px'
		},top);
		
		//3. title
		var repoName = dojo.create('a',{ innerHTML: obj.name, href:'https://github.com/'+this.user+'/'+obj.name,
			style:'color:#4183C4;font-size:14px;font-weight:bold;font-family:arial;position:relative;top:-3px;'
			+'margin-left:6px;text-decoration:none',
		},top);
		dojo.connect(repoName,'onmouseover',function(e){ dojo.style(e.target,'textDecoration','underline') });
		dojo.connect(repoName,'onmouseout',function(e){ dojo.style(e.target,'textDecoration','none') });
		
		//4. container for watchers & forks
		var stats = dojo.create('div',{
			style:'display:inline-block;float:right;color:#666;font-size:11px;font-family:arial;font-weight:bold;'
		},top);
		
		//5. language if there is one
		if(obj.language) dojo.create('span',{innerHTML:obj.language,'style':'position:relative;top:-3px;'},stats);
		
		//6. watchers
		var watchers = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_watchers.png"/>&nbsp;<font color="#666;">'+obj.watchers+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/watchers',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;'
		},stats);
		
		//7. forks
		var forks = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_forks.png"/>&nbsp;<font color="#666;">'+obj.forks+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/network',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;margin-right:15px'
		},stats);
		
		return top;
	};
	
	// Builds entry bottom (graph, last updated, etc.)
	this.createBottom = function(obj, container){
		//1. Bottom (graph, last updated, etc.)
		var bottom = dojo.create('div',{
			style:'border-bottom-right-radius:3px;border-bottom-left-radius:3px;padding-bottom:5px;padding-top:5px'
		},container);
		if(dojo.isWebKit)
			dojo.style(bottom,'backgroundImage',"-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FAFAFA), to(#EFEFEF))");
		else if(dojo.isFF)
			dojo.style(bottom,'background','-moz-linear-gradient(center top , #FAFAFA, #EFEFEF) repeat scroll 0 0 transparent');
	
		//2. Slice & build repo description
		var d = obj.description;
		if(d.length > 100) d = d.slice(0,97)+'...';
		var description = dojo.create('div',{innerHTML:d,style:'font:12px arial;margin-left:10px;height:30px'},bottom);
	
		//3. Participation graph & last updated
		var updated = dojo.create('div',{
			innerHTML:'Last updated '+this.fixUpdateDate(obj.updated_at),
			style:'font:11px arial;color:#888;margin-top:5px;margin-left:10px;'
		},bottom);
		
		//4. Graph
		if(!this._tmpW) this._tmpW = (container.offsetWidth-40)+'px';
		var graph = new Gitgraph({user:this.user,repo:obj.name,domNode:bottom,width:this._tmpW});
		dojo.style(graph,'marginLeft','auto');
		dojo.style(graph,'marginRight','auto');	
		dojo.style(graph,'marginTop','5px');
		
		return bottom;
	};
	
	// Toggles full mode
	this.toggleFull = function(){
		dojo.query('.c').forEach(function(node){ dojo.style(node,'display','none'); });
		dojo.query('.f').forEach(function(node){ dojo.style(node,'display','block'); });
	};
	
	// Toggles compact mode
	this.toggleCompact = function(){
		dojo.query('.f').forEach(function(node){ dojo.style(node,'display','none'); });
		dojo.query('.c').forEach(function(node){ dojo.style(node,'display','block'); });
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
		    fToBind = this, fNOP = function () {},
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
	
	// Hook for dynamic resizing
	this.resize = function(){
		var t = parseInt(this.domNode.parentNode.style.height.substring(0,this.domNode.parentNode.style.height.length-2));
		if((this.h!='auto') && (this.h!='100%') && (this.frame))
			dojo.style(this.domNode,'height',(t-55)+'px');
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
			// Get user info if we built a frame (avatar, etc.)
			if(this.frame){
				dojo.xhrGet({
					url: 'http://logicalcognition.com/files/gitview.php?action=user&user='+args.user,
					handleAs: 'json',
					sync:true,
					preventCache: true,
					load: dojo.hitch(this,'createFrameHeader')
				});
			}
			// Get repo info
			dojo.xhrGet({
				url: 'http://logicalcognition.com/files/gitview.php?action=repos&user='+args.user,
				handleAs: 'json',
				sync:true,
				preventCache: true,
				load: dojo.hitch(this,function(data){ this.repos = data; })
			});
			// For each repo, built an entry
			for(var i in this.repos){
				var showAsCompact = this.compact;
				this.createRepoEntry(this.repos[i],showAsCompact);
				this.compact = !this.compact;
				this.createRepoEntry(this.repos[i],showAsCompact);
				this.compact = !this.compact;
			}
		});
	};
	
	// Initiatialization
	if(!args || !args.user){
		throw new Error('Gitview: missing user and/or domNode arg');
	}else{
		// Parameters
		this.user 		= args.user;
		this.domNode 	= args.domNode ? args.domNode : document.body;
		this.compact 	= args.compact==true ? true : false;
		this.frame	 	= args.noFrame!=true ? true : false;
		this.h			= args.height ? args.height : 'auto';
		this.w			= args.width ? args.width : '440px';
		this.w			= this.w.substring(0,this.w.length-2)<300 ? '350px' : this.w;
		this.repos 		= [];
		
		// Make sure bind( ) is a function
		if (!Function.prototype.bind) Function.prototype.bind = this.bind;
		
		// Build frame if we need it
		if(this.frame) this.createFrame();
		
		// Dynamically load scripts and continue building
		this.loadScript('http://logicalcognition.com/Projects/Gitgraph/Gitgraph.js',this.bootstrap.bind(this));	
	}
};

//Make Jquery folks happy
if (window.jQuery) {
    jQuery.fn.gitview = function (args) {
        if(!args || !args.user){
			throw new Error('Gitview: missing user arg');
		}else{
			this.each(function () {
	            var view = new Gitview({ 
	                user    : args.user,     
	                domNode : $(this)[0], 
	                compact : args.compact || false,
					noFrame : args.noFrame || false,
					height  : args.height || 'auto',
					width   : args.width || 'auto'
	            });
	        });
		}
    };
}