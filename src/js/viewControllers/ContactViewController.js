(function(window){
	ContactViewController.prototype = new BaseViewController();
	ContactViewController.prototype.constructor = ContactViewController;
	
	function ContactViewController(){
		this._view;
		this._container;
		this._model;
		this.didSubmitForm;
		this._hasSubmittedData = false;
		
		this.reset = function() {
			var form = $(this._view.find("form"));
			
			this._hasSubmittedData = false;
			
			$(form.find("input,select")).each(function() {
				$(this).val(""); 
			})
		}
		
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
			var isValidEmail = true;
			var isValidPhone = true;
			var form = $(this._view.find("form"));
			
			$(form.find("input,select")).each(function() {
				if (!$(this).val()) {
					if (isReady) {
						$(this).focus();
					}
					isReady = false
					$(this).addClass("error");
				} 
				
				if (isReady) {
						if ($(this).attr("name") === "email") { 
						if (!context.validateEmail($(this).val())) {
							isValidEmail = false;
							$(this).addClass("error");
						}
					}
					
					if ($(this).attr("name") === "phone") {
						if (!context.validatePhoneNumber($(this).val())) {
							isValidPhone = false;
							$(this).addClass("error");
						}
					}
				}
			});
			
			if (!isReady) {
				alert("Please fill out all required fields");
				completion(isReady);
				return;
			}
			
			if (!isValidEmail) {
				alert("Please enter a valid email address");
			} else if (!isValidPhone) {
				alert("Please enter a valid phone number");
			}
			
			isReady = isValidEmail = isValidPhone;
			
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
				});
			
			});
					
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.showLoader = function(completion) {
			var modal = $(".modal");
			modal.html("<div id='contact-loading'><div class='lds-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>");
			
			TweenMax.to(modal, 0.25, {autoAlpha: 1, onComplete: function() {
				completion();
			}});
		}
		
		this.submit = function(level) {			
			var context = this;
			
			this.vaildate(function(success){
				
				if (success) {
					context.showLoader(function() {
						var data = $(context._view.find("form")).serializeArray();
						var url = "api/register/index.php";
						
						data.push({name: "id", value: level.list_id});
						data.push({name:"should_subscribe", value: $("#newsletter").is(":checked") });
						
						$.ajax({
							type: "POST",
							url: url,
							data: data,
							success: function(data){
								context.onSubmitSuccess();
							},
							error: function(error) {
								console.log(error.responseText);
								context.onSubmitFailire(error);
							}
						});
					});
				}
			});
		}
		
		this.onSubmitSuccess = function() {
			var modal = $(".modal");
			
			TweenMax.to(modal, 0.25, {autoAlpha: 0, onComplete: function() {
				modal.empty();
			}});
			
			this.didSubmitForm();
		}
		
		this.onSubmitFailire = function(error) {
			var modal = $(".modal");
			var errorData = JSON.parse(error.responseJSON);
			
			TweenMax.to(modal, 0.25, {autoAlpha: 0, onComplete: function() {
				modal.empty();
				alert(errorData.title + "\r\n\r\n" + errorData.detail);
			}});
		}
		
		this.intro = function(completion) {
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