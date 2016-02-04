var myModule = angular.module('app', ['timer','ngRoute']);

var refreshInterval = 10;

var doctorDefualtTime = 20,
    therapistDefualtTime = 20,
    sisterDefualtTime = 5;

myModule.controller('rooms-ctrl', function($scope, $http, $window, $interval) {
    $scope.loading = 0;
    $scope.error = '';

    $scope.doctor = {};
    $scope.doctors = [];
    $scope.doctorscopy = [];
    $scope.therapist = {};
    $scope.therapists = [];
    $scope.therapistscopy = [];
    $scope.room = {};
    $scope.rooms = [];
    $scope.roomscopy = [];

    $scope.intervals = {};
    $scope.intervals.doctors = [5,10,15,20,30,45,60,90];
    $scope.intervals.therapists = [5,10,15,20,30,45,60,90];
    $scope.intervals.sisters = [5,10,15];

    var lastrefresh = moment(),
        allowRefresh = false;

    // database

        getdoctors = function(){
            $http.get('/api/doctors').then(function(response) {

                if (response.data) {
                    $scope.doctors = response.data;
                    // for (i = 0; i < $scope.doctors.length; i++){
                    //     $scope.doctorscopy.push({_id:$scope.doctors[i]._id, name:$scope.doctors[i].name, colour:$scope.doctors[i].colour})
                    // }
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
                    // for (i = 0; i < $scope.rooms.length; i++){

                    //     var rtemp = {};
                    //     rtemp._id = $scope.rooms[i]._id;
                    //     rtemp.name = $scope.rooms[i].name;
                    //     rtemp.beds = $scope.rooms[i].beds
                    // }
                    console.log($scope.rooms);
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
                    getBeds(id);

                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        getBeds = function (rid){
            $http.get('/api/rooms/' + rid + '/beds').then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.room.beds = response.data;
                    console.log($scope.room);
                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        $scope.saveRoom = function(){
            // console.log($scope.room)
            $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.updateRoom = function(){
            if ($scope.room._id){
                $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                    .then(
                        function(result){
                            $scope.saveBeds();
                        }
                    )
            }
            else{
                $http.post('/api/rooms', $scope.room)
                    .then(
                        function(result){
                            // console.log('result', result);
                            $scope.room._id = result.data._id;
                            $scope.saveBeds();
                        }
                    )
            }
         };

        $scope.saveBeds = function(){
            var total = $scope.room.beds.length;
            if ($scope.room.beds_old){
                total += $scope.room.beds_old.length;
            }
            var sum = 0;

            if (total == 0){
                $scope.initmanage();
            }

            // Add & update beds
            for (var n = 0; n < $scope.room.beds.length; n++){
                if ($scope.room.beds[n]._id){
                    // put
                    $http.put('/api/rooms/' + $scope.room._id + '/beds/' + $scope.room.beds[n]._id, $scope.room.beds[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    $scope.initmanage();
                                }
                            }
                        )
                }
                else{
                    //post
                    $http.post('/api/rooms/' + $scope.room._id + '/beds', $scope.room.beds[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    $scope.initmanage();
                                }
                            }
                        )
                }
            }

            //Delete beds
            if ($scope.room.beds_old){
                for (var o = 0; o < $scope.room.beds_old.length; o++){
                    if ($scope.room.beds_old[o]._id){
                        // put
                        $http.delete('/api/rooms/' + $scope.room._id + '/beds/' + $scope.room.beds_old[o]._id, $scope.room.beds_old[o])
                            .then(
                                function(result){
                                    sum++;
                                    if (sum == total){
                                        $scope.initmanage();
                                    }
                                }
                            )
                    }
                }
            }

         };

        $scope.deleteRoom = function(){
            if ($scope.room.beds.length != 0){
                for (k = 0; k < $scope.room.beds.length; k++){
                    $http.delete('/api/rooms/' + $scope.room._id + '/beds/' + $scope.room.beds[k]._id, {})
                    if (k == $scope.room.beds.length - 1){
                        $http.delete('/api/rooms/' + $scope.room._id, $scope.room)
                        .then(
                            function(result){
                                $scope.initmanage();
                            }
                        )
                    }
                }
            }
            else{
                $http.delete('/api/rooms/' + $scope.room._id, $scope.room)
                    .then(
                        function(result){
                            $scope.initmanage();
                        }
                    )
            }
         };

        $scope.saveDoctors = function(){

            var total = $scope.doctors.length;
            if ($scope.doctors_old){
                total += $scope.doctors_old.length;
            }
            var sum = 0;

            if (total == 0){
                saveSuccess();
            }

            // Add & update doctors
            for (var n = 0; n < $scope.doctors.length; n++){
                if ($scope.doctors[n]._id){
                    // put
                    $http.put('/api/doctors/' + $scope.room._id, $scope.doctors[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    saveSuccess('Doctors updated successfully');
                                }
                            }
                        )
                }
                else{
                    //post
                    $http.post('/api/doctors', $scope.doctors[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    saveSuccess('Doctors updated successfully');
                                }
                            }
                        )
                }
            }

            //Delete doctors
            if ($scope.doctors_old){
                for (var o = 0; o < $scope.doctors_old.length; o++){
                    if ($scope.doctors_old[o]._id){
                        // put
                        $http.delete('/api/doctors/' + $scope.doctors_old[o]._id, $scope.doctors_old[o])
                            .then(
                                function(result){
                                    sum++;
                                    if (sum == total){
                                        saveSuccess('Doctors updated successfully');
                                    }
                                }
                            )
                    }
                }
            }
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

            // BootstrapDialog.alert('I want banana!');
            alert('Therapists updated successfully');
            // dialog_info_Ok('Title','Message', function(){
                $window.location.href = '/rooms/view';
            // });
         };

        saveSuccess = function(message){
            dialog_success_Ok('Success',message, function(){
                $window.location.href = '/rooms/view';
            });
        }

    // buttons

        $scope.dstart = function(id){
            if ($scope.room.doctorDuration){
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
            // if ($scope.room.sisterDuration){
                $scope.room.sisterDuration = 180;
                $http.patch('/api/rooms/' + id + '/sstart', $scope.room)
                    .then(
                        function(result){
                            $scope.initview();
                        }
                    )
            // }
            // else {
            //     alert('Please choose a duration before pressing start.');
            // }
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
            $scope.room.doctorStart = false;
            $scope.room.doctorDone = false;
            $scope.room.therapistStart = false;
            $scope.room.therapistDone = false;
            $scope.room.sisterStart = false;
            $scope.room.sisterDone = false;
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
                    if ($scope.rooms[r].doctorDone){
                        $scope.rooms[r].dtimeleft = 0;
                    }
                    else{

                        t = moment($scope.rooms[r].doctorTimeIn).add($scope.rooms[r].doctorDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            // $http.post('/api/rooms/' + $scope.rooms[r]._id + '/doctorStop', $scope.room)
                            // $scope.rooms[r].doctorDone = true;
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


                    for (d = 0; d < $scope.doctors.length; d++){
                        if ($scope.rooms[r].doctor == $scope.doctors[d]._id){
                            $scope.rooms[r].dname = $scope.doctors[d].name;
                            $scope.rooms[r].dcolour = $scope.doctors[d].colour;
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
                    if ($scope.rooms[r].doctorDone == false){
                        if (timeleft($scope.rooms[r].doctorTimeIn, $scope.rooms[r].doctorDuration) == 0){
                            $scope.rooms[r].doctorDuration = 0;
                            $http.patch('/api/rooms/' + $scope.rooms[r]._id + '/dstop', $scope.room)
                            $scope.rooms[r].doctorDone = true;
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
            // console.log('id',id);
            if (id){
                getRoom(id);
            }
            else{
                $scope.room = {};
                $scope.room.beds = [];
            }
        }

        $scope.doctherChange = function(){
            $scope.room.doctorStart = false;
            $scope.room.doctorDone = false;
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

        $scope.addDoctor = function(){
            $scope.doctors.push({});
        };

        $scope.removeDoctor = function(doctor) {
            var i = $scope.doctors.indexOf(doctor);
            if (!$scope.doctors_old){
                $scope.doctors_old = [];
            }
            $scope.doctors_old.push($scope.doctors[i]);
            $scope.doctors.splice(i,1);
        };

        $scope.addTherapist = function(){
            $scope.therapistscopy.push({});
        };

        $scope.removeTherapist = function(therapist) {
            $scope.therapistscopy.splice(id,1);

            var i = $scope.therapists.indexOf(therapist);
            if (!$scope.therapists_old){
                $scope.therapists_old = [];
            }
            $scope.therapists_old.push($scope.therapists[i]);
            $scope.therapists.splice(i,1);
        };

        // $scope.create = function (){
        //     $http.post('/api/rooms',{})
        //         .then(function(response) {
        //             console.log(response);
        //         }, function(err) {
        //             console.error(err);
        //         });
        // };

        $scope.addBed = function(){
            $scope.room.beds.push({});
        };

        $scope.removeBed = function(bed){
            // console.log($scope.room.beds[bed]);
            var i = $scope.room.beds.indexOf(bed);
            if (!$scope.room.beds_old){
                $scope.room.beds_old = [];
            }
            $scope.room.beds_old.push($scope.room.beds[i]);
            $scope.room.beds.splice(i,1);
        };

    // Initialize

        $scope.initmanage = function (){
            $scope.loading = 0;
            getdoctors();
            getTherapists();
            getRooms();
            // getBeds();
            pageurl = "/rooms/view";
            allowRefresh = false;
        };

        $scope.initview = function (){
            allowRefresh = true;
            $scope.loading = 0;
            getdoctors();
            getTherapists();
            getRooms();
        };

        $scope.initdoctors = function(){
            allowRefresh = false;
            $scope.loading = 0;
            getdoctors();
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

function dialog_info_Ok(myTitle, msg, callback) {
    var res = 'no value';

    var dialog = new BootstrapDialog({
        title: myTitle,
        message: msg,
        type: BootstrapDialog.TYPE_INFO,
        buttons: [{
            id: 'btn-Ok',
            label: 'Ok'
        }]
    });
    dialog.realize();

    var btn1 = dialog.getButton('btn-Ok');
    btn1.click({'result': 'Ok'}, function(event){
        if (callback) {
            callback(event.data.result);
        };
        dialog.close();
    });

    dialog.open();
}

function dialog_success_Ok(myTitle, msg, callback) {
    var res = 'no value';

    var dialog = new BootstrapDialog({
        title: myTitle,
        message: msg,
        type: BootstrapDialog.TYPE_SUCCESS,
        buttons: [{
            id: 'btn-Ok',
            label: 'Ok'
        }]
    });
    dialog.realize();

    var btn1 = dialog.getButton('btn-Ok');
    btn1.click({'result': 'Ok'}, function(event){
        if (callback) {
            callback(event.data.result);
        };
        dialog.close();
    });

    dialog.open();
}
