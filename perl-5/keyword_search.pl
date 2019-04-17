#!perl
use strict;
use warnings;

use Local::OnetWebService ();

sub get_user_input {
  my ($prompt) = @_;
  my $result = '';
  while (!length($result)) {
    print $prompt . ': ';
    $result = <STDIN>;
    chomp $result;
    $result =~ s/^\s+//;
    $result =~ s/\s+$//;
  }
  return $result;
}

sub check_for_error {
  my ($service_result) = @_;
  if (defined $service_result->{'error'}) {
    die $service_result->{'error'} . "\n";
  }
}

my $username = get_user_input('O*NET Web Services username');
my $password = get_user_input('O*NET Web Services password');
my $onet_ws = Local::OnetWebService->new($username, $password);

my $vinfo = $onet_ws->call('about');
check_for_error($vinfo);
print "Connected to O*NET Web Services version " . $vinfo->{'api_version'} . "\n\n";

my $kwquery = get_user_input('Keyword search query');
my $kwresults = $onet_ws->call('online/search',
                               'keyword' => $kwquery,
                               'end' => 5);
check_for_error($kwresults);
if (!defined($kwresults->{'occupation'}) || !scalar(@{ $kwresults->{'occupation'} })) {
  print "No relevant occupations were found.\n\n";
} else {
  print "Most relevant occupations for \"" . $kwquery . "\":\n";
  for my $occ (@{ $kwresults->{'occupation'} }) {
    print "  " . $occ->{'code'} . " - " . $occ->{'title'} . "\n";
  }
  print "\n";
}

exit;
1;
