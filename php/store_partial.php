<?php

# for pretesting, set error reporting as below
#ini_set("display_errors", 1);
#ini_set('display_startup_errors', 1);

# for safety, disable error reporting for live experiments
ini_set("display_errors", 0);
error_reporting(E_ALL);

// get IP
$user_ip = $_SERVER['REMOTE_ADDR'];

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

# get main data
$user_data = $request->results_post;

# sanitize the file name
$file_name = basename($request->fname_post);

# sanity checks (otherwise do not save):
# (1) file name should end with ".txt" extention
# (2) the data should contain at least 50 characters
if (strlen($user_data ?? '') < 50 or substr($file_name ?? '', -4) !== ".txt") {
    die("Failed");
}

# set path relative to server root; extend it with the file name [n23]
$path = $_SERVER['DOCUMENT_ROOT'] . "/../data/template_results_part/";
$file_path = $path . $user_ip . '_' . $file_name;

# save the file (if the file already exists, overwrite it [n25])
file_put_contents($file_path, $user_data);
