<?php
	require_once 'includes/Mobile_Detect.php';
	$detect = new Mobile_Detect;
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
        
        <meta property="og:url" content="https://www.totaldaymaker.com">
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
	    <?php 
	        if( $detect->isMobile() && !$detect->isTablet() ){
		        include("includes/phone.php");
	        } else {
		        include("includes/desktop.php");
	        }
	    ?>        
    </body>
</html>
