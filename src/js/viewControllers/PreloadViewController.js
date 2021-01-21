/*GENERIC  VIEW CONTROLLER*/
(function(window){
	PreloadViewController.prototype = new BaseViewController();
	PreloadViewController.prototype.constructor = PreloadViewController;
	
	function PreloadViewController(){
		
		this._loader;
		
		this.onImageLoadError = function(e){
			console.log(e);
		}
		
		this.onLoadCompleteReady = function(){
				
		}
		
		this.onImageLoadProgress = function(e){	
			
			console.log("progress", e.loaded * 100);
			var percentage = Math.round(e.loaded * 100);
			
			var loader = $(this._view.find(".preloader-sprite"));
			
			loader.html("loading " + percentage + "%");
			/*var percentage = Math.round(e.loaded * 100);
			
			var clipHeight = 282 - ( 282 * ( percentage / 100 ));
			
			var loaderBar = $(this._view.find(".loader-bar"));
			var loaderPercentage = $(this._view.find(".loader-percentage"));
			var loaderTitle = loaderPercentage.attr("data-title");
					
			loaderBar.css( {clip: "rect(" + clipHeight +"px 282px " + 0 + "282px 0)"});
			
			loaderPercentage.html(loaderTitle + " " + percentage + "%");*/
			
		}
		
		this.onExitComplete = function(){
    		this._view.remove();
		}
	}
	
	PreloadViewController.prototype = {
		init: function(target) {
			this._view = target;
		},
		intro: function(completion) {
			var context = this;
		
			completion();
		},
		exit: function(completion) {
			var context = this;
					
			TweenMax.to(this._view, 0.25, {alpha: 0, delay:0, onComplete:function(){ 
				context.onExitComplete();
				completion();
			}});
		},
		loadContent: function(additionalImages, completion) {
			var context = this;
			
			var images = $("body").find("img");
			var imageArray = [];
			var i;
			
			imageArray.concat(additionalImages);
		
			for(i = 0; i < images.length; i++){
				var image = images[i];
				
				imageArray.push($(images[i]).attr("src"));
			}
			
			var bgImages = [ ];
			var imageUrl;
			
			$("*:not(span,p,h1,h2,h3,h4,h5)").filter(function(){
				if( $(this).css("background-image") != "none" ){
					imageUrl = $(this).css("background-image").replace("url(", "");
					imageUrl = imageUrl.replace(")", "");
					imageUrl = imageUrl.replace('"', "");
					imageUrl = imageUrl.replace('"', "");
										
					if(imageUrl != undefined){
						if( imageUrl.search(".png") == -1 && imageUrl.search(".jpg") == -1 && imageUrl.search(".gif") == -1 ){
						
						}else{
							if(  imageUrl.search("base64") == -1 ){
								if( imageArray.indexOf(imageUrl) == -1 ){
	
									imageArray.push(imageUrl);
								}
							}
						}
					}
					
				}
			});
						
			imageArray = imageArray.filter(function(element){
				return element !== undefined;
			});
			
			if (imageArray.length === 0) {
				completion();
				return;
			}								
			
			this._loader = new createjs.LoadQueue(false);
			
			this._loader.addEventListener("complete",function(e){ completion(e) });
			this._loader.addEventListener("error",function(e){ context.onImageLoadError(e) });
			this._loader.addEventListener("progress",function(e){ context.onImageLoadProgress(e) });
			
			this._loader.loadManifest(imageArray);
			this._hasLoadStart = true;
		}
	}
	
	window.PreloadViewController = PreloadViewController;
}(window));