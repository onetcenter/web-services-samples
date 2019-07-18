<?php

require 'OnetWebService.php';

// read JSON input
$input = json_decode(stream_get_contents(STDIN));

// initialize Web Services and results objects
$onet_ws = new OnetWebService($input->config->username, $input->config->password);
$max_results = max(1, $input->config->max_results);
$output = [ 'output' => [] ];

// call keyword search for each input query
foreach ($input->queries as $q) {
  $res = [];
  $kwresults = $onet_ws->call('online/search',
                              [ 'keyword' => $q,
                                'end' => $max_results ]);
  if (property_exists($kwresults, 'occupation') && count($kwresults->occupation)) {
    foreach ($kwresults->occupation as $occ) {
      $res[] = [ 'code' => $occ->code, 'title' => $occ->title ];
    }
  }
  $output['output'][] = [ 'query' => $q, 'results' => $res ];
}

echo json_encode($output, JSON_PRETTY_PRINT);

?>
