"use strict";

var onet_ws = null;

function hide_element(id) {
  document.getElementById(id).classList.add('d-none');
}
function show_element(id) {
  document.getElementById(id).classList.remove('d-none');
}
function fill_element(id, text) {
  document.getElementById(id).textContent = text;
}
function read_input(id) {
  return document.getElementById(id).value;
}
function disable_button(id) {
  document.getElementById(id).disabled = true;
}
function enable_button(id) {
  document.getElementById(id).disabled = false;
}
function button_is_disabled(id) {
  return document.getElementById(id).disabled;
}
function attach_event(id, eventname, callback) {
  document.getElementById(id).addEventListener(eventname, callback);
}

function show_error(msg) {
  fill_element('errorMessage', msg);
  show_element('errorPanel');
}
function check_for_error(resp) {
  if (resp.hasOwnProperty('error')) {
    show_error(resp.error);
    show_element('errorPanel');
    return true;
  }
  return false;
}
function reset_error() {
  fill_element('errorMessage', '');
  hide_element('errorPanel');
}

function init_keyword_search_js() {
  fill_element('domainOrigin', document.location.protocol + '//' + document.location.host);
  reset_error();
  hide_element('connectSuccess');
  hide_element('searchSuccess');
  
  if (document.location.protocol != 'http:' && document.location.protocol != 'https:') {
    show_error('You must run this demo from an HTTP or HTTPS server.');
    hide_element('accountForm');
    return;
  }
  
  attach_event('accountForm', 'submit', function(e) {
    e.preventDefault();
    if (button_is_disabled('accountConnect')) { return; }
    reset_error();
    hide_element('connectSuccess');
    
    var username = read_input('accountName');
    if (username == '') {
      show_error('Please enter your O*NET Web Services username.');
      return;
    }
    
    onet_ws = new OnetWebService(username);
    disable_button('accountConnect');
    onet_ws.call('about', null, function(vinfo) {
      enable_button('accountConnect');
      if (check_for_error(vinfo)) { return; }
      
      fill_element('connectVersion', vinfo.api_version);
      show_element('connectSuccess');
    });
  });
  
  attach_event('searchForm', 'submit', function(e) {
    e.preventDefault();
    if (button_is_disabled('searchSubmit')) { return; }
    reset_error();
    hide_element('searchSuccess');
    hide_element('searchNoResults');
    hide_element('searchResults');
    
    var kwquery = read_input('searchQuery');
    if (kwquery == '') {
      show_error('Please enter one or more search terms.');
      return;
    }
    
    disable_button('searchSubmit');
    onet_ws.call('online/search', { keyword: kwquery, end: 5 }, function(kwresults) {
      enable_button('searchSubmit');
      if (check_for_error(kwresults)) { return; }
      
      fill_element('searchQueryEcho', kwquery);
      if (!kwresults.hasOwnProperty('occupation') || !kwresults.occupation.length) {
        show_element('searchNoResults');
      } else {
        for (var i = 0; i < 5; i++) {
          if (i >= kwresults.occupation.length) {
            hide_element('searchItem' + i);
          } else {
            fill_element('searchCode' + i, kwresults.occupation[i].code);
            fill_element('searchTitle' + i, kwresults.occupation[i].title);
            show_element('searchItem' + i);
          }
        }
        show_element('searchResults');
      }
      show_element('searchSuccess');
    });
  });
}
