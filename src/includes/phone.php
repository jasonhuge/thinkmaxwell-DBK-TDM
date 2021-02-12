<?php
	$file = file_get_contents("data/app.json");
	$json = json_decode($file, true);	
?>
<div class="wrapper">
	<div class="content">
		<header id="app-header">
	    	<div id="bar">
	        	<div id="header-logo">
		        	<img src="img/content/header-logo.png" alt="Daves Bread"/>
	        	</div>
	        	<ul id="header-title">
		        	<li class="transitional-title"></li>
		        	<li class="title"></li>
	        	</ul>
	        	<div id="sando-thumb">
	        	</div>
	    	</div>
		</header>
		<div class="page-container">
			<div id="intro-container" class="page-slider">
			</div>
	    	<div id="game-container" class="page-slider">
	    	</div>
	    	<div id="game-completion-container" class="page-slider">
	    	</div>
		</div>
		<footer id="app-footer">
	    	<nav id="game-nav">
	        	<div class="nav-button button" id="back-button" data-action="">
		        	<img src="img/content/nav-back-arrow.png" alt="back-arrow"/>
		        	<h4>BACK</h4>
	        	</div>
	        	<div id="nav-divider">
		        	<img src="img/content/nav-house.png" alt="image of a house" />
	        	</div>
		        <div class="nav-button button" id="spacer-button" data-action="">
		        	<h4></h4>
		        	<img src="img/content/nav-back-arrow.png" alt="next-arrow"/>
	        	</div>
	    	</nav>
		</footer>
	</div>
	
	<div class="preloader">
	    <div class="preloader-sprite">
	        
	    </div>
	</div>
	
	<div id="game-countdown" class="countdown">
	    <ul>
	        <li id="count-one"><img src="img/content/one.png" alt="one"/></li>
	        <li id="count-two"><img src="img/content/two.png" alt="one"/></li>
	        <li id="count-three"><img src="img/content/three.png" alt="one"/></li>
	    </ul>
	</div>
	
	<div class="modal">
	    
	</div>
	
	<div class="rotate-message">
	    <div>
	        <!--<img src="" alt="rotate phone"/>-->
	    </div>
	</div>
</div>

<script   src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="   crossorigin="anonymous"></script>        
<!--<script src="https://cdn.jsdelivr.net/npm/tsparticles"></script>
<script src="https://cdn.jsdelivr.net/npm/jquery-particles"></script>-->

<script src="js/Vendor.js"></script>
<script src="js/App.js"></script>

<script type="text/javascript">
    $(document).ready(function(){
		var mobileDetect =  new MobileDetect(window.navigator.userAgent);
		
		if (mobileDetect.phone()) {
			var app = new App();
			app.init("phone");
		} else {
			
		}
	});
</script>
