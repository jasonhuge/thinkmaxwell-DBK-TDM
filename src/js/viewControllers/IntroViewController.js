/*GENERIC  VIEW CONTROLLER*/
(function(window){
	IntroViewController.prototype = new BaseViewController();
	IntroViewController.prototype.constructor = IntroViewController;
	
	function IntroViewController(){
		this._view;
		this._model;
		this._container;
		this._hasIntialIntro = false;
		this._playButton;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];	
					
			this._container.append(this._model.template);
			
			this._view = $("#" + pageId);
						
			var context = this;
			
			var hero = $(this._view.find("#hero-image"));
			var logo =  $(this._view.find("#intro-logo"));
			var termsButton = $(this._view.find(".terms"));
			var playButton =  $(this._view.find("#intro-play-button"));

			[hero, logo, playButton, termsButton].forEach(function(view) {
				TweenMax.to(view, 0, {scale: 0});
			});
			
			this._playButton = playButton;
		}

		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			gtag('event', 'screen_view', {
				'screen_name' : "Intro"
			});
			
			gtag('event', 'page_view', {
				'page_title': "Intro",
				'page_path': "/"
			});
			
			gtag('event', 'action', {
				'action_screen': "Intro",
				'action_path': "/"
			});

			if (this._hasIntialIntro) {

				TweenMax.to(this._view, 0.5, {autoAlpha: 1, onComplete: function() {
					if (completion) { completion(); }
				}});
			} else {
				//
				var context = this;
				var hero = $(this._view.find("#hero-image"));
				var logo =  $(this._view.find("#intro-logo"));
				var playButton =  $(this._view.find("#intro-play-button"));
				var termsButton = $(this._view.find(".terms"));
				var heroSando = $(this._view.find("#hero-sando"));
								
				var timeline = new TimelineMax();
				
				timeline.to(this._view, 0, {autoAlpha: 1});
				
				timeline.to(hero, 0.5, {scale: 1, ease:Back.easeOut});
				timeline.to(logo, 0.25, {scale: 1, ease:Back.easeOut}, "-=0.10");
				timeline.to(playButton, 0.25, {scale: 1, ease:Back.easeOut},  "-=0.20");
				timeline.to(heroSando, 0.25, {right: 0, opacity: 1, ease:Sine.easeOut}, "-=0.20")
				timeline.to(termsButton, 0.25, {scale: 1, ease:Back.easeOut, onComplete: function() {
					context._hasIntialIntro = true;
					if (completion) { completion(); }
				}},  "-=0.20");
				
				timeline.play();
			}
			
		}
		
		this.exit = function(completion) {
			TweenMax.to(this._view, 0.5, {autoAlpha: 0, onComplete: function() {
				if (completion) {
					completion();
				}
			}});
		}
	}

	window.IntroViewController = IntroViewController;
}(window));

/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function IntroCoordinator(){
		this._presenter;
		this._vc;
		this.exitComplete;
		
		this.init = function(model, presenter) {
			this._presenter = presenter;
			this._vc = new IntroViewController();
			this._vc.init(model, presenter);
			
			var context = this;
			
			this._vc._playButton.on("click", function() {
				context.exit();
			});
			
			$("#terms-button").on("click", function() {
				/*gtag("event", "page_view", {
					"page_title": "Terms and Conditions",
					"page_path": "/terms"
				})*/
				
				gtag('config', 'G-4Q4LVK7PJD', {'page_path': '/terms', 'page_title': 'Terms and Conditions'});
				
				TweenMax.to($(".terms-conditions"), 0.25, {autoAlpha: 1});
			});
		}
		
		this.intro = function() {
			var context = this;
			
			TweenMax.to(this._presenter, 0, {autoAlpha: 1, onComplete: function() {
				context._vc.intro();
			}});
		}
		
		this.exit = function() {
			var context = this;
			
			this._vc.exit(function() {
				TweenMax.to(context._presenter, 0, {autoAlpha: 0, onComplete: function() {
					context.exitComplete();
				}});
			});
		}
		
		this.onOrientationChange= function(e){	
			
		}

	}

	window.IntroCoordinator = IntroCoordinator;
}(window));

