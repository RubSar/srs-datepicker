# srs-datepicker
Simple responsive Angular.js daterange picker directive

<p><a href="https://plnkr.co/edit/gOM9L6LEl7qMRTjpePUM?p=preview" target="_blank">DEMO</a></p>

<h2>Manual installation</h2>
This directive depends on  <a href ="http://getbootstrap.com/css/">Bootstrap css</a>, 
<a href="http://fontawesome.io/?utm_source=hackernewsletter">FontAwesome</a>,
<a href="http://momentjs.com/">Moment.js</a> and
<a href="https://jquery.com/">jQuery</a>


<h2>Basic usage</h2>

<p>App Bootstrap</p>
<pre>
(function() {
  'use strict';

  var app = angular.module('app', []);

  app.controller('Index', function($scope) {
    $scope.startDate = '';
    $scope.endDate = '';
  });
})();
</pre>

<p>In Your HTML add directive element 


```<srs-datepicker start-date="startDate"
                end-date="endDate"
                format="DD-MM-YYYY"
                from-label="Start Date"
                show-placeholder="true"
                to-label="End Date"
                locale="en"
                show-icon="true">
  </srs-datepicker>```
