<?php
	include_once('../../mailchimp/Client.php');
	
	$client = new Client();
	
	if ($_SERVER['REQUEST_METHOD'] != 'GET') {
		$client->returnError(405, ['title'=>'method not allowed', 'status'=>405]);
	}
	
	if (!isset($_GET['id'])) {
		$client->returnError(404, ['title'=>'list id required', 'status'=>404]);
	}
	
	$listId = $_GET['id'];
		
	echo json_encode($client->getListStats($listId));
?>