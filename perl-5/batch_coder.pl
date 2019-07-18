#!perl
use strict;
use warnings;

use Local::OnetWebService ();
use JSON ();

sub consume_stdin {
  my $input;
  do {
    local $/ = undef;
    $input = <STDIN>;
  };
  return $input;
}

# read JSON input
my $input = JSON->new->utf8->decode(consume_stdin());

# initialize Web Services and results objects
my $onet_ws = Local::OnetWebService->new($input->{'config'}{'username'}, $input->{'config'}{'password'});
my $max_results = $input->{'config'}{'max_results'} // 1;
$max_results = 1 if $max_results < 1;
my $output = { 'output' => [] };

# call keyword search for each input query
for my $q (@{ $input->{'queries'} })
{
  my @res = ();
  my $kwresults = $onet_ws->call('online/search',
                                 'keyword' => $q,
                                 'end' => $max_results);
  if (defined($kwresults->{'occupation'}) && scalar(@{ $kwresults->{'occupation'} })) {
    for my $occ (@{ $kwresults->{'occupation'} }) {
      push(@res, { 'code' => $occ->{'code'}, 'title' => $occ->{'title'} });
    }
  }
  push(@{ $output->{'output'} }, { 'query' => $q, 'results' => \@res });
}

print JSON->new->utf8->canonical->pretty->encode($output);
