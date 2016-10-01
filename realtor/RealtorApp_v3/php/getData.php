<?php
//$url = $_POST['data'];
//
//$ch = curl_init();
//curl_setopt ($ch, CURLOPT_URL, $url);
//curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
//$result = curl_exec($ch);
//curl_close($ch);
//
//// set the heaer to xml so it can parse the returned information from Zillow
//header('Content-type: application/xml');
//
////return the information to the calling JavaScript method for parsing.
//echo $result;

//I GOT THIS WORKING ON RUSSET WITHOUT USING CURL

$url = $_POST['data'];
$file = file_get_contents($_POST['data']);

header('Content-type: application/xml');
echo $file;

?>