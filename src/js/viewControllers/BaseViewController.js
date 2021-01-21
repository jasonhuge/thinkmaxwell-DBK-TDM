/*GENERIC  VIEW CONTROLLER*/
(function(window){
	
	function BaseViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.onCloseButtonClick = function(e){
			this.exit();
		}
		
		this.intro = function(){
			this._view.css({"opacity" : 1});
		}
		
		this.onIntroComplete = function(){
			$(this).trigger("onIntroComplete");
		}
		
		this.exit = function(){
			this._view.css({"opacity" : 0});
		}
		
		this.onExitComplete = function(){
			$(this).trigger("onExitComplete");
		}
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
		
	}
	BaseViewController.prototype = {
		init:function(target, model, deviceType){
			this.baseSetup(target, model, deviceType);
		},
		setTitle:function(title){
			
		},
		onWindowResize:function(e){
			
		},
		dealloc:function(){
			if(this._pageContent){
				this._pageContent.remove();
			}
			
			this._pageContent = null;
			this._view = null;
			this._deviceType = null;
			this._model = null;
		},
		removeFromParent:function(){
			this._view.remove();
			this._view = null;
		},
		snapIn:function(){
			this._view.show();
		},
		snapOut:function(){
			this._view.hide();
		},
		pause:function(){
			
		},
		updateOnNavigationEvent:function(vars){
			
		}
		
	}
	
	window.BaseViewController = BaseViewController;
}(window));