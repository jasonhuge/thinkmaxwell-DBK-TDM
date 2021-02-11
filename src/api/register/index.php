<?php
	include_once('../../mailchimp/Client.php');
	
	$client = new Client();
	
	if ($_SERVER['REQUEST_METHOD'] != 'POST') {
		$client->returnError(405, ['title'=>'method not allowed', 'status'=>405]);
	}
	
	$listId = $_POST['id'];
	$email = $_POST['email'];
	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$street_address = $_POST['street_address'];
	$city = $_POST['city'];
	$state = $_POST['state'];
	$zipcode = $_POST['zipcode'];
	$phone = $_POST['phone'];
	
	if (!isset($listId)) {
		$client->returnError(404, ['title'=>'list id required', 'status'=>404]);
	} else if (!isset($email)) {
		$client->returnError(404, ['title'=>'email address required', 'status'=>404]);
	} else if (!isset($first_name)) {
		$client->returnError(404, ['title'=>'first name required', 'status'=>404]);
	} else if (!isset($last_name)) {
		$client->returnError(404, ['title'=>'last name required', 'status'=>404]);
	} else if (!isset($street_address)) {
		$client->returnError(404, ['title'=>'address required', 'status'=>404]);
	} else if (!isset($phone)) {
		$client->returnError(404, ['title'=>'phone# required', 'status'=>404]);
	} else if (!isset($city)) {
		$client->returnError(404, ['title'=>'city required', 'status'=>404]);
	} else if (!isset($state)) {
		$client->returnError(404, ['title'=>'state required', 'status'=>404]);
	} else if (!isset($zipcode)) {
		$client->returnError(404, ['title'=>'zipcode required', 'status'=>404]);
	}
	
	$address = new stdClass();
	$address->addr1 = $street_address;
	$address->city = $city;
	$address->state = $state;
	$address->zip = $zipcode;
	
	echo json_encode($client->addSubscriber($listId, $email, $first_name, $last_name, $phone, $address));
	
?>