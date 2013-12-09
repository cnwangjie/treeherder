"use strict";

treeherder.controller('TinderboxPluginCtrl',
    function TinderboxPluginCtrl($scope, $rootScope, $log) {
        $log.log("Tinderbox plugin initialized");
        $scope.$watch('artifacts', function(newValue, oldValue){
            $scope.tinderbox_lines = [];
            // ``artifacts`` is set as a result of a promise, so we must have
            // the watch have ``true`` as the last param to watch the value,
            // not just the reference.  We also must check for ``blob`` in ``Job Info``
            // because ``Job Info`` can exist without the blob as the promise is
            // fulfilled.
            if (newValue && newValue.hasOwnProperty('Job Info') && newValue['Job Info'].hasOwnProperty('blob')){
                $scope.tinderbox_lines =  newValue['Job Info'].blob.tinderbox_printlines;
                $scope.tinderbox_lines_parsed = [];
                for(var i=0; i<$scope.tinderbox_lines.length; i++){
                    var line = $scope.tinderbox_lines[i];
                    var title = line;
                    var value = "";
                    var link = "";
                    var type = ""

                    var seps = [": ", "<br/>"];
                    var sep = false;

                    for(var i=0; i<seps.length; i++){
                        if(line.indexOf(seps[i]) !== -1){
                            sep = seps[i];
                        }
                    }
                    if(sep){
                        var chunks = line.split(sep);
                        title = chunks[0];
                        value = chunks.slice(1).join(sep);
                        if(title.indexOf("link") !== -1){
                            link = value;
                            type = "link"
                        }
                        if(title == "TalosResult"){
                            type = "TalosResult";
                            // unescape the json string
                            value =  value.replace(/\\/g, '')
                            $log.log(value)
                            value = angular.fromJson(value);
                        }
                        if(sep == "<br/>"){
                            type="raw_html"
                        }
                    }
                    $scope.tinderbox_lines_parsed.push({
                        title:title,
                        value:value,
                        link:link,
                        type: type
                    });
                    $log.log({title:title, value:value, link:link})
                }


                // set the item count on the tab header

            }

            for(var tab=0; tab<$scope.tabs.length; tab++){
                if ($scope.tabs[tab].id == 'tinderbox'){
                    $scope.tabs[tab].num_items = $scope.tinderbox_lines.length;
                }
            }

        }, true);

    }
);
