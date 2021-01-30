<?php
	$file = file_get_contents("data/app.json");
	$json = json_decode($file, true);
?>
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="title" content="">
        <meta name="description" content="">
        
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="">
        
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        
        <meta property="og:url" content="">
        <meta property="og:description" content="">
        <meta name="og:title" content="">
        <meta property="og:site_name" content="">
		<meta property="og:image" content="">
		<meta property="og:type" content="website">
        <meta property="fb:app_id" content="">
        
        <meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="" />
		<meta name="twitter:title" content="">
		<meta name="twitter:description" content="">
		<meta name="twitter:image" content="">
        
        <link rel="stylesheet" href="css/vendor.min.css">
        <link rel="stylesheet" href="css/style.min.css">

    </head>
    <body>
	    <div class="wrapper">
	        <!-- background -->
        	<div class="background">

        	</div>
        	
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
		        	<div class="page-slider">
					
		        	</div>
	        	</div>
	        	<footer id="app-footer">
		        	<nav id="game-nav">
			        	<div class="nav-button button" id="back-button">
				        	<img src="img/content/nav-back-arrow.png" alt="back-arrow"/>
				        	<h4>BACK</h4>
			        	</div>
			        	<div id="nav-divider">
				        	<img src="img/content/nav-house.png" alt="image of a house" />
			        	</div>
				        <div class="nav-button button" id="spacer-button">
				        	<h4></h4>
				        	<img src="" alt="next-arrow"/>
			        	</div>
		        	</nav>
	        	</footer>
        	</div>
        	
        	<div class="preloader">
	            <div class="preloader-sprite">
		            
	            </div>
	        </div>
	        
	        <!--<div class="modal">
		        <div class="winner">
			        <div id="tsparticles"></div>
		        </div>
		    </div>-->
	        
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
        
    </body>
</html>
