<?php
	require '../../../engine/db_config.php';

	$post 	= $_POST;
	$resid	= $post['1'];
	$sql 	= "SELECT * FROM dataalatkantor WHERE KodeAlatKantor = '".$resid."'"; 
	$result = $mysqli->query($sql);
	$data 	= $result->fetch_assoc();
	echo json_encode($data);
?>