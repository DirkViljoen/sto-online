var myModule = angular.module('app', ['timer','ngRoute', 'ui.bootstrap', 'colorpicker.module']);

var refreshInterval = 10;

var doctorDefualtTime = 20,
    therapistDefualtTime = 20,
    sisterDefualtTime = 5;

myModule.controller('rooms-ctrl', function($scope, $http, $window, $interval) {
    $scope.loading = true;
    $scope.working = 0
    $scope.error = '';

    // $scope.doctor = {};
    $scope.doctors = [];
    // $scope.therapist = {};
    $scope.therapists = [];
    $scope.therapistList = [];
    $scope.room = {};
    $scope.rooms = [];

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
                    $scope.doctors.splice(0,0,{'_id':'000000000000000000000000','name':' - ','colour':'#fdffff'});
                    console.log('Doctors:', $scope.doctors);
                    $scope.working++;
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
                    $scope.therapists.splice(0,0,{'_id':'000000000000000000000000','name':' - ','colour':'#fdffff'});
                    console.log('Therapists:', $scope.therapists)
                    $scope.working++;
                    buildrooms();
                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        getRooms = function (){
            $http.get('/api/rooms').then(function(response) {
                if (response.data) {
                    $scope.rooms = response.data;
                    $scope.working++;

                    $http.get('/api/beds').then(function(response) {
                        if (response.data) {
                            for (var k = 0; k < response.data.length; k++){
                                for (var i = 0; i < $scope.rooms.length; i++){
                                    for (var j = 0; j < $scope.rooms[i].beds.length; j++){
                                        if ($scope.rooms[i].beds[j] == response.data[k]._id){
                                            $scope.rooms[i].beds[j] = response.data[k];
                                        }
                                    }
                                }
                                if (k == response.data.length-1){
                                    console.log('Rooms:', $scope.rooms);
                                    buildrooms();
                                }
                            }
                        }
                    }, function(err) {
                        // $scope.error = err.data;
                        console.error('###GET Beds', err);
                    });


                }
            }, function(err) {
                // $scope.error = err.data;
                console.error('###GET Rooms', err);
            });

         };

        getRoom = function (id){
            $http.get('/api/rooms/' + id).then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    $scope.room = response.data;
                    if ($scope.room.therapists == undefined){
                        $scope.room.therapists = [''];
                    }
                    if ($scope.room.therapists.length == 0){
                        $scope.room.therapists = ['']
                    }
                    updateTherapistList();
                    getBeds(id);

                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        getBeds = function (rid){
            $http.get('/api/rooms/' + rid + '/beds').then(function(response) {
                if (response.data) {
                    $scope.room.beds = response.data;
                    console.log($scope.room);
                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        $scope.saveRoom = function(){
            $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                .then(
                    function(result){
                        $scope.saveBeds($scope.initview());
                    }
                )
         };

        $scope.saveRooms = function(){
            saveSuccess('Rooms updated successfully');
         };

        $scope.updateRoom = function(){
            console.log($scope.room);
            if ($scope.room._id){
                $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                    .then(
                        function(result){
                            $scope.saveBeds($scope.initmanage());
                        }
                    )
            }
            else{
                $http.post('/api/rooms', $scope.room)
                    .then(
                        function(result){
                            // console.log('result', result);
                            $scope.room._id = result.data._id;
                            $scope.saveBeds($scope.initmanage());
                        }
                    )
            }
         };

        $scope.saveBeds = function(callback){
            var total = $scope.room.beds.length;
            if ($scope.room.beds_old){
                total += $scope.room.beds_old.length;
            }
            var sum = 0;

            if (total == 0){
                // create at least one bed
                $http.post('/api/rooms/' + $scope.room._id + '/beds', {'empty':''})
                    .then(
                        function(result){
                            callback;
                        }
                    )
            }

            // Add & update beds
            for (var n = 0; n < $scope.room.beds.length; n++){
                if ($scope.room.beds[n]._id){
                    // put
                    // if ($scope.room.beds[n]._id == -1){

                    // }

                    $http.put('/api/rooms/' + $scope.room._id + '/beds/' + $scope.room.beds[n]._id, $scope.room.beds[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    callback;
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
                                    callback;
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

        saveSuccess = function(message){
            dialog_success_Ok('Success',message, function(){
                $window.location.href = '/rooms/view';
            });
         }

    // buttons

        $scope.dstart = function(id){
            // $http.put('/api/rooms/' + $scope.room._id, $scope.room);
            // if ($scope.room.doctorDuration){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/dstart', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         //    }
         //    else {
         //        alert('Please choose a duration before pressing start.');
         //    }
         };

        $scope.dstop = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/dstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.dreset = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/dreset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.tstart = function(id){
            // if ($scope.room.therapistDuration){
                $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/tstart', $scope.room)
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

        $scope.tstop = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/tstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.treset = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/treset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.sstart = function(id){
            // if ($scope.room.sisterDuration){
                // $scope.room.sisterDuration = 180;
                $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/sstart', $scope.room)
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
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/sstop', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.sreset = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/sreset', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

        $scope.resetRoom = function(id){
            $http.patch('/api/rooms/' + $scope.room._id + '/beds/' + id + '/resetAll', $scope.room)
                .then(
                    function(result){
                        $scope.initview();
                    }
                )
         };

    // Settings

        $scope.addTherapist = function(){
            $scope.room.therapists.push('');
            // updateTherapistList();

         };

        $scope.removeTherapist = function(i) {
            // var i = $scope.room.therapists.indexOf(therapist);
            $scope.room.therapists.splice(i,1);
            // updateTherapistList();
         };

        updateTherapistList = function() {
            $scope.therapistList = $scope.therapists;
            if ($scope.therapistList[0]._id=='000000000000000000000000'){
                $scope.therapistList.splice(0,1);
            }
        };

    // helper functions

        buildrooms = function() {
            // console.log($scope.loading);
            // console.log('info - Rooms:', $scope.rooms.length);
            if ($scope.working == 3){
                for (r = 0; r < $scope.rooms.length; r++){
                    if ($scope.rooms[r].beds[0].doctorDone){
                        $scope.rooms[r].beds[0].dtimeleft = 0;
                    }
                    else{

                        t = moment($scope.rooms[r].beds[0].doctorTimeIn).add($scope.rooms[r].beds[0].doctorDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            // $http.post('/api/rooms/' + $scope.rooms[r]._id + '/doctorStop', $scope.room)
                            // $scope.rooms[r].doctorDone = true;
                            $scope.rooms[r].beds[0].dtimeleft = 1;
                        }
                        else{
                            $scope.rooms[r].beds[0].dtimeleft = t / 1000;
                        }
                    }

                    if ($scope.rooms[r].beds[0].therapistDone){
                        $scope.rooms[r].beds[0].ttimeleft = 0;
                    }
                    else{
                        t = moment($scope.rooms[r].beds[0].therapistTimeIn).add($scope.rooms[r].beds[0].therapistDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            $scope.rooms[r].beds[0].ttimeleft = 1;
                        }
                        else{
                            $scope.rooms[r].beds[0].ttimeleft = t / 1000;
                        }
                    }

                    if ($scope.rooms[r].beds[0].sisterDone){
                        $scope.rooms[r].beds[0].stimeleft = 0;
                    }
                    else{
                        t = moment($scope.rooms[r].beds[0].sisterTimeIn).add($scope.rooms[r].beds[0].sisterDuration, 'm').valueOf() - moment().valueOf();
                        if (t < 0){
                            $scope.rooms[r].beds[0].stimeleft = 1;
                        }
                        else{
                            $scope.rooms[r].beds[0].stimeleft = t / 1000;
                        }
                    }

                    // console.log('info - Room:',$scope.rooms[r].name,'Beds:', $scope.rooms[r].beds.length);
                    for (b = 0; b < $scope.rooms[r].beds.length; b++){
                        // console.log('info - Current bed:', b, 'doctor id:',$scope.rooms[r].beds[b]);
                        for (d = 0; d < $scope.doctors.length; d++){
                            if ($scope.rooms[r].beds[b].doctor == $scope.doctors[d]._id){
                                // console.log('info - doctor found');
                                $scope.rooms[r].beds[b].dname = $scope.doctors[d].name;
                                $scope.rooms[r].beds[b].dcolour = $scope.doctors[d].colour;
                            }
                        };
                    }

                    for (rt = 0; rt < $scope.rooms[r].therapists.length; rt++){
                        for (t = 0; t < $scope.therapists.length; t++){
                            if ($scope.rooms[r].therapists[rt] == $scope.therapists[t]._id){
                                $scope.rooms[r].therapists[rt] = $scope.therapists[t];
                            }
                        };
                    }
                }
                $scope.loading = false;
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
            $scope.room.beds[0].doctorStart = false;
            $scope.room.beds[0].doctorDone = false;
            $scope.room.beds[0].therapistStart = false;
            $scope.room.beds[0].therapistDone = false;
            $scope.room.beds[0].sisterStart = false;
            $scope.room.beds[0].sisterDone = false;
        };

    // timer specific

        function refreshPage() {
            if (allowRefresh){
                $scope.working = 2;
                getRooms();
                console.log('refresh!');
            }
            // alert('referesh');
        };

        $interval(refreshPage, 15000);

        $scope.$on('timer-tick', function (event, args) {
            countdown();
        });

    // Initialize

        $scope.initview = function (){
            // allowRefresh = true;
            $scope.working = 0;
            getdoctors();
            getTherapists();
            getRooms();
        };
 });

myModule.controller('settings-ctrl', function($scope, $http, $window, $interval) {
    $scope.loading = false;
    $scope.error = '';

    $scope.doctor = {};
    $scope.doctors = [];
    $scope.therapist = {};
    $scope.therapists = [];
    $scope.room = {};
    $scope.rooms = [];

    $scope.staticLookup = {};
    $scope.staticLookup.rooms = {};
    $scope.staticLookup.rooms.columns = [1,2,3,4,5,6];
    $scope.staticLookup.rooms.rows = [1,2,3,4];
    $scope.staticLookup.beds = {};
    $scope.staticLookup.beds.columns = [1,2,3,4,5];
    $scope.staticLookup.beds.rows = [1,2,3,4,5];

    // database

        getdoctors = function(){
            $http.get('/api/doctors').then(function(response) {

                if (response.data) {
                    $scope.doctors = response.data;

                    console.log('Doctors:', $scope.doctors);
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
                    console.log('Therapists:', $scope.therapists)
                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        getRooms = function (){
            $http.get('/api/rooms').then(function(response) {
                if (response.data) {
                    $scope.rooms = response.data;
                    $scope.loading++;

                    $http.get('/api/beds').then(function(response) {
                        if (response.data) {
                            for (var k = 0; k < response.data.length; k++){
                                for (var i = 0; i < $scope.rooms.length; i++){
                                    for (var j = 0; j < $scope.rooms[i].beds.length; j++){
                                        if ($scope.rooms[i].beds[j] == response.data[k]._id){
                                            $scope.rooms[i].beds[j] = response.data[k];
                                        }
                                    }
                                }

                                if (k == $scope.rooms.length){
                                    console.log('Rooms:', $scope.rooms);
                                }
                            }
                        }
                    }, function(err) {
                        // $scope.error = err.data;
                        console.error('###GET Beds', err);
                    });


                }
            }, function(err) {
                // $scope.error = err.data;
                console.error('###GET Rooms', err);
            });

         };

        getRoom = function (id){
            $http.get('/api/rooms/' + id).then(function(response) {
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
                if (response.data) {
                    $scope.room.beds = response.data;
                    console.log($scope.room);
                }
            }, function(err) {
                $scope.error = err.data;
            });
         };

        $scope.saveRoom = function(){
            $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                .then(
                    function(result){
                        $scope.saveBeds($scope.initview());
                    }
                )
         };

        $scope.saveRooms = function(){
            saveSuccess('Rooms updated successfully');
         };

        $scope.updateRoom = function(){
            console.log($scope.room);
            if ($scope.room._id){
                $http.put('/api/rooms/' + $scope.room._id, $scope.room)
                    .then(
                        function(result){
                            $scope.saveBeds($scope.initmanage());
                        }
                    )
            }
            else{
                $http.post('/api/rooms', $scope.room)
                    .then(
                        function(result){
                            $scope.room._id = result.data._id;
                            $scope.saveBeds($scope.initmanage());
                        }
                    )
            }
         };

        $scope.saveBeds = function(callback){
            var total = $scope.room.beds.length;
            if ($scope.room.beds_old){
                total += $scope.room.beds_old.length;
            }
            var sum = 0;

            if (total == 0){
                // create at least one bed
                $http.post('/api/rooms/' + $scope.room._id + '/beds', {'empty':''})
                    .then(
                        function(result){
                            callback;
                        }
                    )
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
                                    callback;
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
                                    callback;
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
            $http.delete('/api/rooms/' + $scope.room._id, $scope.room)
                .then(
                    function(result){
                        $scope.initmanage();
                    }
                )
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
                    $http.put('/api/doctors/' + $scope.doctors[n]._id, $scope.doctors[n])
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
            var total = $scope.therapists.length;
            if ($scope.therapists_old){
                total += $scope.therapists_old.length;
            }
            var sum = 0;

            if (total == 0){
                saveSuccess();
            }

            // Add & update therapists
            for (var n = 0; n < $scope.therapists.length; n++){
                if ($scope.therapists[n]._id){
                    // put
                    $http.put('/api/therapists/' + $scope.therapists[n]._id, $scope.therapists[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    saveSuccess('Therapists updated successfully');
                                }
                            }
                        )
                }
                else{
                    //post
                    $http.post('/api/therapists', $scope.therapists[n])
                        .then(
                            function(result){
                                sum++;
                                if (sum == total){
                                    saveSuccess('Therapists updated successfully');
                                }
                            }
                        )
                }
            }

            //Delete therapists
            if ($scope.therapists_old){
                for (var o = 0; o < $scope.therapists_old.length; o++){
                    if ($scope.therapists_old[o]._id){
                        // put
                        $http.delete('/api/therapists/' + $scope.therapists_old[o]._id, $scope.therapists_old[o])
                            .then(
                                function(result){
                                    sum++;
                                    if (sum == total){
                                        saveSuccess('Therapists updated successfully');
                                    }
                                }
                            )
                    }
                }
            }
         };

        saveSuccess = function(message){
            dialog_success_Ok('Success',message, function(){
                $window.location.href = '/rooms/view';
            });
         }

    // helper functions

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
            $scope.therapists.push({});
         };

        $scope.removeTherapist = function(therapist) {
            var i = $scope.therapists.indexOf(therapist);
            if (!$scope.therapists_old){
                $scope.therapists_old = [];
            }
            $scope.therapists_old.push($scope.therapists[i]);
            $scope.therapists.splice(i,1);
         };

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
