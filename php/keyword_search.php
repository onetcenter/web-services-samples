<?php

require 'OnetWebService.php';

function get_user_input($prompt) {
  $result = '';
  while (empty($result)) {
    $result = trim(readline($prompt . ': '));
  }
  return $result;
}

function check_for_error($service_result) {
  if (property_exists($service_result, 'error')) {
    exit($service_result->error . "\n");
  }
}

$username = get_user_input('O*NET Web Services username');
$password = get_user_input('O*NET Web Services password');
$onet_ws = new OnetWebService($username, $password);

$vinfo = $onet_ws->call('about');
check_for_error($vinfo);
echo "Connected to O*NET Web Services version " . $vinfo->api_version . "\n\n";

$kwquery = get_user_input('Keyword search query');
$kwresults = $onet_ws->call('online/search',
                            array('keyword' => $kwquery, 'end' => 5));
check_for_error($kwresults);
if (!property_exists($kwresults, 'occupation') || !count($kwresults->occupation)) {
  echo "No relevant occupations were found.\n\n";
} else {
  echo "Most relevant occupations for \"" . $kwquery . "\":\n";
  foreach ($kwresults->occupation as $occ) {
    echo "  " . $occ->code . " - " . $occ->title . "\n";
  }
  echo "\n";
}

?>
