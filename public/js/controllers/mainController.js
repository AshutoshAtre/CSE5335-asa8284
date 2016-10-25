'use strict';

angular.module('projectOne')
    .controller('mainController', ['$scope', '$http', function($scope, $http) {
        $scope.hideMapFlag = true;
        $scope.hideGraphFlag = true;
        $scope.map = null;

        // Request definition
        var req = {
            method: 'GET',
            url: 'https://cse5335-asa8284.herokuapp.com/getLocations',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Function to fetch data from json file and display map
        $scope.fetchMap = function() {
            $scope.hideMapFlag = false;
            $scope.locations = [];
            // GET request
            $http(req).then(function(response) {
                //success callback
                if (response.status == 200) {
                    $scope.locations = response.data.location;
                    console.log(response.data.location);
                    $scope.initMap();
                } else {
                    alert("Error: " + response);
                    $scope.hideMapFlag = true;
                }
            }, function(response) {
                //error callback
                if (typeof response.data.message === 'undefined')
                    alert("Error: " + response.statusText);
                else
                    alert("Error: " + response.data.message);
            });
        }

        //Function to hide map and table on click of button
        $scope.hideMap = function() {
            $scope.hideMapFlag = true;
        }

        //Function to intialize map
        $scope.initMap = function() {
            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 10
            };
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var geocoder = new google.maps.Geocoder();

            /*Bound default address to US*/
            geocoder.geocode({
                'address': 'US'
            }, function(results, status) {
                var ne = results[0].geometry.viewport.getNorthEast();
                var sw = results[0].geometry.viewport.getSouthWest();
                $scope.map.fitBounds(results[0].geometry.viewport);
                $scope.plotPlaces();
            });
        }

        //Function to plot locations on the graph
        $scope.plotPlaces = function() {
            var latLng = {
                lat: 0,
                lng: 0
            };
            for (var i = 0; i < $scope.locations.length; i++) {
                latLng = {
                    lat: $scope.locations[i].latitude,
                    lng: $scope.locations[i].longitude
                };
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    title: $scope.locations[i].name
                });
            }
        }


        // Function to fetch numerical data
        $http(req).then(function(response) {
            //success callback
            if (response.status == 200) {
                $scope.visitors = response.data.visitors;
                console.log($scope.visitors);

            } else {
                alert("Error: " + response);
                $scope.hideGraphFlag = true;
            }
        }, function(response) {
            //error callback
            if (typeof response.data.message === 'undefined')
                alert("Error: " + response.statusText);
            else
                alert("Error: " + response.data.message);
        });

        // Function to fetch graph on click of button
        $scope.fetchGraph = function() {
            $scope.hideGraphFlag = false;
            // GET request

        }

        //Function to hide graph on click of hide button
        $scope.hideGraph = function() {
            $scope.hideGraphFlag = true;
        }
    }]);