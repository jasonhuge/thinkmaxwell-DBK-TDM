<div class="wrapper desktop">
	<div class="container">
		<div class="left">
			<img src="img/content/desktop-phone.jpg" alt="TOTAL DAY MAKER. DAVES KILLER BREAD"/>
		</div><!--
		--><div class="right">
			<div class="right-content">
				<h1>KILLER GAMES &<br/>BREAD AHEAD!</h1>
				<p>SCAN THE QR CODE WITH YOUR PHONE'S CAMERA TO GET PLAYING!<br/>COMPLETE A LEVE FOR A CHANCE TO WIN A YEAR'S SUPPLY OF<br/>BREAD OR $5,000!</p>
				<div class="qr-code">
					<img src="img/content/qrcode.jpg" alt="QR Code"/>
				</div>
				<div class="social">
					<ul>
						<li><a href="https://www.facebook.com/DavesKillerBread/" target="_blank"><img src="img/content/facebook-icon.png" alt="Facebook button"/></a></li>
						<li><a href="https://www.instagram.com/daveskillerbread/" target="_blank"><img src="img/content/twitter-icon.png" alt="Facebook button"/></a></li>
					</ul>
				</div>
				<div class="rules">
					<span>OFFICIAL RULES</span>
				</div>
			</div>
		</div>
	</div>
</div>

<script   src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="   crossorigin="anonymous"></script>

<script type="text/javascript">
    $(document).ready(function(){
		$(window).on("resize", function(e){ 
			onWindowResize();
	 	});
	 	
	 	function onWindowResize() {
		 	var containerHeight = $(".left").height();
		 	var content = $(".right-content");
		 	var contentHeight = content.height();
		 	if (contentHeight < containerHeight) {
			 	content.css({"margin-top": containerHeight / 2 - content.height() / 2});
		 	} else {
			 	content.css({"margin-top": 0});
		 	}
	 	}
	 	
	 	onWindowResize();
	 	
	 	$(".rules span").on("click", function() {
			TweenMax.to($(".terms-conditions"), 0.25, {autoAlpha: 1});
		});
	 	
	 	$(".terms-conditions .close-button").on("click", function() {
			TweenMax.to($(".terms-conditions"), 0.25, {autoAlpha: 0});
		});

	});
</script>