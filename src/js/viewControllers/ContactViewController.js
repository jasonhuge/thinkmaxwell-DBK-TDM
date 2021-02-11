(function(window){
	ContactViewController.prototype = new BaseViewController();
	ContactViewController.prototype.constructor = ContactViewController;
	
	function ContactViewController(){
		this._view;
		this._container;
		this._model;
		this.selectLevelListener;
		this._hasSubmittedData = false;
		
		
		this.validateEmail = function(email) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
			return regex.test(email);
		}
		
		this.validatePhoneNumber = function(phoneNumber) {
			var regex = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;
			return regex.test(phoneNumber);
		}
		
		this.vaildate = function(completion) {
			var context = this;
			var isReady = true;
			var form = $(this._view.find("form"));
			
			$(form.find("input,select")).each(function() {
				if (!$(this).val()) {
					if (isReady) {
						$(this).focus();
					}
					isReady = false
					$(this).addClass("error");
					
				} 
				
				if ($(this).attr("name") === "email") {
					if (!context.validateEmail($(this).val())) {
						isReady = false;
						$(this).addClass("error");
					}
				}
				
				if ($(this).attr("name") === "phone") {
					if (!context.validatePhoneNumber($(this).val())) {
						isReady = false;
						$(this).addClass("error");
					}
				}
			});
		
			completion(isReady);
		}
		
		this.setup = function() {
			var pageId = this._model['page-id'];			
			this._container.append(this._model.template);	
			this._view = $("#" + pageId);	
			
			var form = $(this._view.find("form"));

			$(form.find("input,select")).each(function() {
				$(this).keypress(function() {
					$(this).removeClass("error");
				});
				
				$(this).change(function() {
					$(this).removeClass("error");
				})
			});
					
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.submit = function(level) {
			var context = this;
			this.vaildate(function(success){
				if (success) {
					var data = $(context._view.find("form")).serializeArray();
					var url = "api/register/index.php";
					
					data.push({name: "id", value: "19f888674a"});
	
					$.ajax({
						type: "POST",
						url: url,
						data: data,
						success: function(data){
							console.log(data);
						},
						error: function(error) {
							console.log(error.responseText);
						}
					});
				}
			});
		}
		
		this.intro = function(completion) {
			console.log("contact intro", this._view);
			TweenMax.to(this._view, 0.25, {autoAlpha: 1});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.25, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
	}
	
	
	window.ContactViewController = ContactViewController;
}(window));