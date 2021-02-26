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
			
			var percentage = Math.round(e.loaded * 100);
			
			var loader = $(this._view.find(".preloader-text"));
			
			loader.html("Loading " + percentage + "%");
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
			
			var content = $(this._view.find(".preloader-content"));
			var sprite = $(this._view.find(".preloader-sprite"));
			var text = $(this._view.find(".preloader-text"));
			
			var timeline = new TimelineMax();
			
			timeline.to(sprite, 0, {scale: 0});
			timeline.to(text, 0, {alpha: 0});
			timeline.to(content, 0, {autoAlpha: 1});
			
			timeline.to(sprite, 0.25, {scale: 1, ease:Back.easeOut});
			timeline.to(text, 0.25, {alpha: 1, delay: 0.25, ease:Sine.easeIn, onComplete: function() {
				
				completion();
			}});
			
			timeline.play();
			
		},
		exit: function(completion) {
			var context = this;
			
			var content = $(this._view.find(".preloader-content"));
			var sprite = $(this._view.find(".preloader-sprite"));
			var text = $(this._view.find(".preloader-text"));
			
			var timeline = new TimelineMax();
			
			timeline.to(text, 0.25, {alpha: 1});
			timeline.to(sprite, 0.25, {scale: 0, ease:Back.easeIn});
			timeline.to(this._view, 0.25, {alpha: 0, delay: 0.10, ease:Sine.easeIn, onComplete: function() {
				context.onExitComplete();
				completion();
			}});
			
			timeline.play();
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