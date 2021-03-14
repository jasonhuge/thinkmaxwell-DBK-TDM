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
	$phone = $_POST['phone'];
	
	$status = $_POST['status'];
		
	if (!isset($listId)) {
		$client->returnError(404, ['title'=>'list id required', 'status'=>404]);
	} else if (!isset($email)) {
		$client->returnError(404, ['title'=>'email address required', 'status'=>404]);
	} else if (!isset($first_name)) {
		$client->returnError(404, ['title'=>'first name required', 'status'=>404]);
	} else if (!isset($last_name)) {
		$client->returnError(404, ['title'=>'last name required', 'status'=>404]);
	} else if (!isset($phone)) {
		$client->returnError(404, ['title'=>'phone# required', 'status'=>404]);
	}
	
	$properties = [
		'email_address' => $email,
		'merge_fields' => [
			'FNAME' => $first_name,
			'LNAME' => $last_name,
			'PHONE' => $phone
		],
		'status' => $status
	];
			
	echo json_encode($client->addSubscriber($listId, $properties));
	
?>