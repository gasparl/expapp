<?php

# for pretesting, set error reporting as below
#ini_set("display_errors", 1);
#ini_set('display_startup_errors', 1);

# for safety, disable error reporting for live experiments
ini_set("display_errors", 0);
error_reporting(E_ALL);

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

# sanitize the file name
$file_name = basename($request->fname_post);

# sanity check: file name should end with ".txt" extention
if (substr($file_name ?? '', -4) !== ".txt") {
    die("Failed: wrong format.");
}

# get main data
$user_data = $request->results_post;

# set path relative to server root; extend it with the file name [n23]
$path = $_SERVER['DOCUMENT_ROOT'] . "/../data/template_results_full/";
$file_path = $path .  $file_name;

# save the file (if the file already exists, just append the new data [n26])
$outcome = file_put_contents($file_path, $user_data, FILE_APPEND | LOCK_EX);

if ($outcome > 500) {
    // if more than 500 characters were successfully written, return Prolific completion link
    echo "https://app.prolific.co/submissions/complete?cc=EXAMPLE";
} else if (is_file($file_path) === FALSE) {
    // if the file is not saved, return warning
    echo "Failed to save file! (" . $outcome . "x" . $request->fname_post . ")";
} else {
    // if no more than 500 characters are written, return warning
    // (this could happen due to invalid file submitted but also e.g. due to depleted server storage space)
    echo "Failed to save full data! (" . $outcome . "x" . $request->fname_post . ")";
}
