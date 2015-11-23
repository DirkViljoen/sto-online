var myModule = angular.module('app', ['timer','ngRoute']);

var refreshInterval = 10;

var docterDefualtTime = 20,
    therapistDefualtTime = 20,
    sisterDefualtTime = 5;

myModule.controller('rooms-ctrl', function($scope, $http, $window, $interval) {
    $scope.loading = 0;
    $scope.error = '';

    $scope.docter = {};
    $scope.docters = [];
    $scope.docterscopy = [];
    $scope.therapist = {};
    $scope.therapists = [];
    $scope.therapistscopy = [];
    $scope.room = {};
    $scope.rooms = [];
    $scope.roomscopy = [];

    $scope.intervals = {};
    $scope.intervals.docters = [5,10,15,20,30,45,60,90];
    $scope.intervals.therapists = [5,10,15,20,30,45,60,90];
    $scope.intervals.sisters = [5,10,15];

    var lastrefresh = moment(),
        allowRefresh = false;

    // database

        getDocters = function(){
            $http.get('/api/docters').then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.docters = response.data;
                    for (i = 0; i < $scope.docters.length; i++){
                        $scope.docterscopy.push({_id:$scope.docters[i]._id, name:$scope.docters[i].name, colour:$scope.docters[i].colour})
                    }
                    $scope.loading++;
                    buildrooms();
                }
            }, function(err) {
                $scope.error = err.data;
            });
        };

        getTherapists = function (){
            $http.get('/api/therapists').then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.therapists = response.data;
                    for (i = 0; i < $scope.therapists.length; i++){
                        $scope.therapistscopy.push({_id:$scope.therapists[i]._id, name:$scope.therapists[i].name, colour:$scope.therapists[i].colour})
                    }
                    $scope.loading++;
                    buildrooms();
                }
            }, function(err) {
                $scope.error = err.data;
            });
        };

        getRooms = function (){
            $http.get('/api/rooms').then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.rooms = response.data;
                    for (i = 0; i < $scope.rooms.length; i++){
                        var rtemp = {};
                        rtemp._id = $scope.rooms[i]._id;
                        rtemp.name = $scope.name;
                        rtemp.group = $scope.group;
                        rtemp.docter = $scope.docter;
                        rtemp.docterTimeIn = $scope.docterTimeIn;
                        rtemp.docterDone = $scope.docterDone;
                        rtemp.docterStart = $scope.docterStart;
                        rtemp.therapist = $scope.therapist;
                        rtemp.therapistTimeIn = $scope.therapistTimeIn;
                        rtemp.therapistDone = $scope.therapistDone;
                        rtemp.therapistStart = $scope.therapistStart;
                        rtemp.sisterTimeIn = $scope.sisterTimeIn;
                        rtemp.sisterDone = $scope.sisterDone;
                        rtemp.sisterStart = $scope.sisterStart;
                        rtemp.patient = $scope.patient;
                        $scope.docterscopy.push(rtemp);
                    }
                    $scope.loading++;
                    buildrooms();
                }
            }, function(err) {
                $scope.error = err.data;
            });
        };

        getRoom = function (id){
            $http.get('/api/rooms/' + id).then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.room = response.data;
                }
            }, function(err) {
                $scope.error = err.data;
            });
        };

        $scope.saveRoom = function(){
            console.log($scope.room)
            $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )

        };

        $scope.saveDocters = function(){
            for (i = 0; i < $scope.docters.length; i++){
                found = false;
                for (k = 0; k < $scope.docterscopy.length; k++){
                    console.log('i:', i, $scope.docters[i]._id);
                    console.log('k:', k, $scope.docterscopy[k]._id);
                    if ($scope.docters[i]._id == $scope.docterscopy[k]._id){
                        console.log('found');
                        found = true;
                        $http.put('/api/docters/' + $scope.docterscopy[k]._id, $scope.docterscopy[k])
                        .then(
                            function(result){
                                console.log('Successfull update')
                            }
                        )
                    }
                    else{
                        if (k + 1 == $scope.docterscopy.length && found == false){
                            console.log('not found');
                            $http.delete('/api/docters/' + $scope.docters[k]._id, $scope.docters[k])
                            .then(
                                function(result){
                                    console.log('Successfull delete')
                                }
                            )
                        }
                    }
                };
            };

            for (i = 0; i < $scope.docterscopy.length; i++){
                if (!$scope.docterscopy[i]._id){
                    console.log('new');
                    $http.post('/api/docters', $scope.docterscopy[i])
                    .then(
                        function(result){
                            console.log('Successfull create')
                        }
                    )
                }
            };

            // $window.location.href = '/rooms/view';
        };

        $scope.saveTherapists = function(){
            for (i = 0; i < $scope.therapists.length; i++){
                found = false;
                for (k = 0; k < $scope.therapistscopy.length; k++){
                    console.log('i:',i,$scope.therapists[i]);
                    console.log('k:',k,$scope.therapistscopy[k]);

                    if ($scope.therapists[i]._id == $scope.therapistscopy[k]._id){
                        console.log('found');
                        found = true;
                        $http.put('/api/therapists/' + $scope.therapistscopy[k]._id, $scope.therapistscopy[k])
                        .then(
                            function(result){
                                console.log('Successfull update')
                            }
                        )
                    }
                    else{
                        if (k + 1 == $scope.therapistscopy.length && found == false){
                            console.log('not found');
                            $http.delete('/api/therapists/' + $scope.therapists[i]._id, $scope.therapists[k])
                            .then(
                                function(result){
                                    console.log('Successfull delete')
                                }
                            )
                        }
                    }
                };
            };

            for (i = 0; i < $scope.therapistscopy.length; i++){
                if (!$scope.therapistscopy[i]._id){
                    console.log('new');
                    $http.post('/api/therapists', $scope.therapistscopy[i])
                    .then(
                        function(result){
                            console.log('Successfull create')
                        }
                    )
                }
            };
        };

    // buttons

        $scope.dstart = function(id){
            if ($scope.room.docterDuration){
                $http.patch('/api/rooms/' + id + '/dstart', $scope.room)
                    .then(
                        function(result){
                            $scope.initview();
                        }
                    )
            }
            else {
                alert('Please choose a duration before pressing start.');
            }
         };

        $scope.dstop = function(id){
            $http.patch('/api/rooms/' + id + '/dstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.dreset = function(id){
            $http.patch('/api/rooms/' + id + '/dreset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.tstart = function(id){
            if ($scope.room.therapistDuration){
                $http.patch('/api/rooms/' + id + '/tstart', $scope.room)
                    .then(
                        function(result){
                            $scope.initview();
                        }
                    )
            }
            else {
                alert('Please choose a duration before pressing start.');
            }
         };

        $scope.tstop = function(id){
            $http.patch('/api/rooms/' + id + '/tstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.treset = function(id){
            $http.patch('/api/rooms/' + id + '/treset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.sstart = function(id){
            if ($scope.room.sisterDuration){
                $http.patch('/api/rooms/' + id + '/sstart', $scope.room)
                    .then(
                        function(result){
                            $scope.initview();
                        }
                    )
            }
            else {
                alert('Please choose a duration before pressing start.');
            }
         };

        $scope.sstop = function(id){
            $http.patch('/api/rooms/' + id + '/sstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.sreset = function(id){
            $http.patch('/api/rooms/' + id + '/sreset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.resetRoom = function(id){
            $http.patch('/api/rooms/' + id + '/resetAll', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

    // helper functions

        buildrooms = function() {
            console.log($scope.loading);
            if ($scope.loading == 3){
                for (r = 0; r < $scope.rooms.length; r++){
                    if ($scope.rooms[r].docterDone){
                        $scope.rooms[r].dtimeleft = 0;
                    }
                    else{

                        t = moment($scope.rooms[r].docterTimeIn).add($scope.rooms[r].docterDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            // $http.post('/api/rooms/' + $scope.rooms[r]._id + '/docterStop', $scope.room)
                            // $scope.rooms[r].docterDone = true;
                            $scope.rooms[r].dtimeleft = 0;
                        }
                        else{
                            $scope.rooms[r].dtimeleft = t / 1000;
                        }
                    }

                    if ($scope.rooms[r].therapistDone){
                        $scope.rooms[r].ttimeleft = 0;
                    }
                    else{
                        t = moment($scope.rooms[r].therapistTimeIn).add($scope.rooms[r].therapistDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            $scope.rooms[r].ttimeleft = 0;
                        }
                        else{
                            $scope.rooms[r].ttimeleft = t / 1000;
                        }
                    }

                    if ($scope.rooms[r].sisterDone){
                        $scope.rooms[r].stimeleft = 0;
                    }
                    else{
                        t = moment($scope.rooms[r].sisterTimeIn).add($scope.rooms[r].sisterDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            $scope.rooms[r].stimeleft = 0;
                        }
                        else{
                            $scope.rooms[r].stimeleft = t / 1000;
                        }
                    }


                    for (d = 0; d < $scope.docters.length; d++){
                        if ($scope.rooms[r].docter == $scope.docters[d]._id){
                            $scope.rooms[r].dname = $scope.docters[d].name;
                            $scope.rooms[r].dcolour = $scope.docters[d].colour;
                        }
                    };

                    for (t = 0; t < $scope.therapists.length; t++){
                        if ($scope.rooms[r].therapist == $scope.therapists[t]._id){
                            $scope.rooms[r].tname = $scope.therapists[t].name;
                            $scope.rooms[r].tcolour = $scope.therapists[t].colour;
                        }
                    };
                }
            }
        };

        timeleft = function(start, increment) {

            t = moment(start).add(increment, 'm').valueOf() - moment().valueOf();
            if (t < 1000) {
                t = 0;
            };
            return t;
        };

        countdown = function() {
                for (r = 0; r < $scope.rooms.length; r++){
                    if ($scope.rooms[r].docterDone == false){
                        if (timeleft($scope.rooms[r].docterTimeIn, $scope.rooms[r].docterDuration) == 0){
                            $scope.rooms[r].docterDuration = 0;
                            $http.patch('/api/rooms/' + $scope.rooms[r]._id + '/dstop', $scope.room)
                            $scope.rooms[r].docterDone = true;
                        }
                    }

                    if ($scope.rooms[r].therapistDone == false){
                        if (timeleft($scope.rooms[r].therapistTimeIn, $scope.rooms[r].therapistDuration) == 0){
                            $scope.rooms[r].therapistDuration = 0;
                            $http.patch('/api/rooms/' + $scope.rooms[r]._id + '/tstop', $scope.room)
                            $scope.rooms[r].therapistDone = true;
                        }
                    }

                    if ($scope.rooms[r].sisterDone == false){
                        if (timeleft($scope.rooms[r].sisterTimeIn, $scope.rooms[r].sisterDuration) == 0){
                            $scope.rooms[r].sisterDuration = 0;
                            $http.patch('/api/rooms/' + $scope.rooms[r]._id + '/sstop', $scope.room)
                            $scope.rooms[r].sisterDone = true;
                        }
                    }
                }
        };

        $scope.setModelOptions = function(id){
            console.log(id);
            getRoom(id);
        }

        $scope.doctherChange = function(){
            $scope.room.docterStart = false;
            $scope.room.docterDone = false;
            $scope.room.therapistStart = false;
            $scope.room.therapistDone = false;
            $scope.room.sisterStart = false;
            $scope.room.sisterDone = false;
        };

    // timer specific

        function refreshPage() {
            if (allowRefresh){
                $scope.loading = 2;
                getRooms();
                console.log('refresh!');
            }
            // alert('referesh');
        };

        $interval(refreshPage, 15000);

        $scope.$on('timer-tick', function (event, args) {
            countdown();
        });

    // Settings

        $scope.addd = function(){
            $scope.docterscopy.push({});
        };

        $scope.removed = function(id) {
            // console.log($scope.docterscopy[id]);
            $scope.docterscopy.splice(id,1);
        };

        $scope.addt = function(){
            $scope.therapistscopy.push({});
        };

        $scope.removet = function(id) {
            $scope.therapistscopy.splice(id,1);
        };

        $scope.create = function (){
            $http.post('/api/rooms',{})
                .then(function(response) {
                    console.log(response);
                }, function(err) {
                    console.error(err);
                });
        };

    // Initialize

        $scope.initmanage = function (){
            allowRefresh = false;

            $scope.loading = 0;
            getDocters();
            getTherapists();
            getRooms();
            pageurl = "/rooms/view";
        };

        $scope.initview = function (){
            allowRefresh = true;
            $scope.loading = 0;
            getDocters();
            getTherapists();
            getRooms();
        };

        $scope.initdocters = function(){
            allowRefresh = false;
            $scope.loading = 0;
            getDocters();
        };

        $scope.inittherapists = function(){
            allowRefresh = false;
            $scope.loading = 0;
            getTherapists();
        };
 });

myModule.controller('nav-ctrl', function($scope, $http, $window) {
    $scope.loading = 0;
    $scope.error = '';

    $scope.pageurl = "/rooms/view";

    // buttons

    $scope.changepage = function(url){
        // $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.currentProject.url);
        $scope.pageurl = url;
    };

    // timer specific

        $scope.$on('timer-tick', function (event, args) {
            countdown();
        });

    // Initialize

        $scope.initnav = function (){
            $scope.loading = false;
            pageurl = "/rooms/view";
        };
 });
