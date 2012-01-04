var Gitview = function(args){
	this.createRepoEntry = function(obj){
		if(this.small){
			var container = dojo.create('div',{
				style:"width:440px;border:1px solid #DDD;border-radius:4px;margin-bottom:10px;background:white"
			},this.domNode);
		}else{
			var container = dojo.create('div',{
				style:"width:440px;border:1px solid #DDD;border-radius:4px;margin-bottom:10px;background:white"
			},this.domNode);
		}
		
		var top = dojo.create('div',{
			style:"height:32px;line-height:38px;border-bottom:1px solid #DDD;"
		},container);
		
		var smiley = dojo.create('img',{
			src:'https://a248.e.akamai.net/assets.github.com/images/icons/public.png',
			style:'margin-left:6px'
		},top);
		
		var repoName = dojo.create('a',{
			innerHTML: obj.name,
			href:'https://github.com/'+this.user+'/'+obj.name,
			style:'color:#4183C4;font-size:14px;font-weight:bold;font-family:arial;position:relative;top:-3px;margin-left:6px;'
			+'text-decoration:none',
		},top);
		dojo.connect(repoName,'onmouseover',function(e){ dojo.style(e.target,'textDecoration','underline') });
		dojo.connect(repoName,'onmouseout',function(e){ dojo.style(e.target,'textDecoration','none') });
		
		var stats = dojo.create('div',{
			style:'display:inline-block;float:right;color:#666;font-size:11px;font-family:arial;font-weight:bold;'
		},top);
		
		if(obj.language){
			var lang = dojo.create('span',{
				innerHTML:obj.language,
				'style':'position:relative;top:-3px;'
			},stats);
		}
		
		var watchers = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_watchers.png"/>&nbsp;<font color="#666;">'+obj.watchers+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/watchers',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;'
		},stats);
		
		var forks = dojo.create('a',{
			innerHTML:'<img src="http://logicalcognition.com/images/repostat_forks.png"/>&nbsp;<font color="#666;">'+obj.forks+'</font>',
			href:'https://github.com/'+this.user+'/'+obj.name+'/network',
			style:'position:relative;top:-3px;margin-left:10px;text-decoration:none;margin-right:15px'
		},stats);
		
		if(this.small){
			var bottom = dojo.create('div',{
				style:'height:30px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;padding-bottom:5px;padding-top:5px'
			},container);	
		}else{
			var bottom = dojo.create('div',{
				style:'border-bottom-right-radius:3px;border-bottom-left-radius:3px;padding-bottom:5px;padding-top:5px'
			},container);
		}
		if(dojo.isWebKit)
			dojo.style(bottom,'backgroundImage',"-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FAFAFA), to(#EFEFEF))");
		else if(dojo.isFF)
			dojo.style(bottom,'background','-moz-linear-gradient(center top , #FAFAFA, #EFEFEF) repeat scroll 0 0 transparent');
		
		var d = obj.description;
		if(d.length > 100)
			d = d.slice(0,97)+'...';
		var description = dojo.create('div',{
			innerHTML:d,
			style:'font:12px arial;margin-left:9px;'
		},bottom);
		
		if(!this.small){
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
	
	this.fixUpdateDate = function(date){
		return date;
	};
	
	this.loadScript = function(sScriptSrc,callbackfunction) {
		//gets document head element
		var oHead = document.getElementsByTagName('head')[0];
		if(oHead){
			//creates a new script tag		
			var oScript = document.createElement('script');

			//adds src and type attribute to script tag
			oScript.setAttribute('src',sScriptSrc);
			oScript.setAttribute('type','text/javascript');

			//calling a function after the js is loaded (IE)
			var loadFunction = function()
				{
					if (this.readyState == 'complete' || this.readyState == 'loaded')
					{
						callbackfunction(); 
					}
				};
			oScript.onreadystatechange = loadFunction;

			//calling a function after the js is loaded (Firefox)
			oScript.onload = callbackfunction;

			//append the script tag to document head element		
			oHead.appendChild(oScript);
		}
	};
	
	this.bind = function (oThis) {
		if (typeof this !== "function") {
		  // closest thing possible to the ECMAScript 5 internal IsCallable function
		  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

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

	//Initiatialization
	if(!args || !args.user || !args.domNode){
		throw new Error('Gitview: missing user and/or domNode arg');
	}else{
		this.domNode = args.domNode;
		this.user = args.user;
		this.repos = [];
		this.small = args.small==true ? true : false;
		
		if (!Function.prototype.bind)
		  Function.prototype.bind = this.bind;
		
		var bootstrap = function(){
			this.loadScript('http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js',kickStart.bind(this));
		};
		
		var kickStart = function(){
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
		};
		
		this.loadScript('http://logicalcognition.com/Projects/Gitgraph/Gitgraph.js',bootstrap.bind(this));	
	}
};