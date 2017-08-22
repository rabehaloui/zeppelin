/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

angular.module('zeppelinWebApp').controller('NavCtrl', NavCtrl);

NavCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$http',
  '$routeParams',
  '$location',
  'noteListDataFactory',
  'baseUrlSrv',
  'websocketMsgSrv',
  'arrayOrderingSrv',
  'searchService',
  'TRASH_FOLDER_ID'
];

function NavCtrl($scope, $rootScope, $http, $routeParams, $location,
                 noteListDataFactory, baseUrlSrv, websocketMsgSrv,
                 arrayOrderingSrv, searchService, TRASH_FOLDER_ID) {
  var vm = this;
  vm.arrayOrderingSrv = arrayOrderingSrv;
  vm.connected = websocketMsgSrv.isConnected();
  vm.isActive = isActive;
  vm.logout = logout;
  vm.notes = noteListDataFactory;
  vm.search = search;
  vm.searchForm = searchService;
  vm.showLoginWindow = showLoginWindow;
  vm.TRASH_FOLDER_ID = TRASH_FOLDER_ID;
  vm.isFilterNote = isFilterNote;

  $scope.query = {q: ''};
  $rootScope.repo = [
    {
      'name': 'apis',
      'description': 'Connectors to different apis',
      'version': '0.1.0',
      'language': 'python',
      'tags': [
        'tag1',
        'tag2',
        'tag3'
      ],
      'meta': [
        {
          'name': 'key1',
          'value': 'val1'
        },
        {
          'name': 'key2',
          'value': 'val2'
        }
      ],
      'directories': {
        'lib': 'lib',
        'modules': 'modules',
        'bin': 'bin',
        'test': 'test'
      },
      'readme': '',
      'modules': {
        'createCircleMap': {
          'name': 'createCircleMap',
          'label': 'Circle Google Map',
          'description': 'Creation of ',
          'source': 'createCircleMap.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataframe input with information to create the map',
              'type': 'binary',
              'required': true,
              'default': 'df',
              'hidden': false,
              'runner': [
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'latCol',
              'description': 'Column containing the latitude position',
              'type': 'string',
              'required': true,
              'default': 'lat',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'lonCol',
              'description': 'Name of the column ',
              'type': 'string',
              'required': true,
              'default': 'lng',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'countCol',
              'description': 'Name of the position',
              'type': 'string',
              'required': false,
              'default': 'count',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'circleSize',
              'description': 'This parameter is an inDefault is 50',
              'type': 'integer',
              'required': true,
              'default': '50',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'googleMapsKey',
              'description': 'Google Maps used to do the vizualizations',
              'type': 'string',
              'required': true,
              'default': ' ',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'outputPath',
              'description': 'Path where to save the html file produced',
              'type': 'path',
              'required': false,
              'default': 'output.html',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'inputPath',
              'description': 'Path to create the map ',
              'type': 'path',
              'required': true,
              'default': '',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'headerBool',
              'description': 'This  contains a header',
              'type': 'boolean',
              'required': true,
              'default': 'True',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'delimiter',
              'description': 'In inside the file',
              'type': 'string',
              'required': false,
              'default': ',',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'datesBool',
              'description': 'Thiscontains dates',
              'type': 'double',
              'required': false,
              'default': 'False',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            }
          ],
          'readme': 'readme'
        },
        'createHeatMap': {
          'name': 'createHeatMap',
          'label': 'Heat Google Map',
          'description': 'Creation of from Google Maps.',
          'source': 'createHeatMap.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataframe input with information to create the map',
              'type': 'binary',
              'required': true,
              'default': 'df',
              'hidden': false,
              'runner': [
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'latCol',
              'description': 'Column containing the latitude position',
              'type': 'string',
              'required': true,
              'default': 'lat',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'lonCol',
              'description': 'Name of the column containing the longitude position',
              'type': 'string',
              'required': true,
              'default': 'lng',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'countCol',
              'description': 'Name of the column containing the gradient for each position',
              'type': 'string',
              'required': false,
              'default': 'count',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'googleMapsKey',
              'description': 'Google Maps used to do the vizualizations',
              'type': 'string',
              'required': true,
              'default': ' ',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'outputPath',
              'description': 'Path where to save the html file produced',
              'type': 'path',
              'required': false,
              'default': 'output.html',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'inputPath',
              'description': 'Path to create the map ',
              'type': 'path',
              'required': true,
              'default': '',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'headerBool',
              'description': 'This parameter contains a header',
              'type': 'boolean',
              'required': true,
              'default': 'True',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'delimiter',
              'description': 'In the file',
              'type': 'string',
              'required': false,
              'default': ',',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'datesBool',
              'description': 'This contains dates',
              'type': 'double',
              'required': false,
              'default': 'False',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            }
          ],
          'readme': 'readme'},
        'getCoordinates': {
          'name': 'getCoordinates',
          'label': 'Get coordinates from location',
          'description': 'Generates latitude and longitude',
          'source': 'getCoordinates.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataframe containing the column with location names',
              'type': 'binary',
              'required': true,
              'default': 'df',
              'hidden': false,
              'runner': [
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'locationCol',
              'description': 'Name of the to coordinates',
              'type': 'string',
              'required': true,
              'default': 'locations',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'googleMapsKey',
              'description': 'Key for googleMaps to produce the maps',
              'type': 'string',
              'required': false,
              'default': '',
              'hidden': false,
              'runner': [
                'standalone',
                'workflow'
              ],
              'output': false
            },
            {
              'name': 'inputPath',
              'description': 'Path to the to create the map ',
              'type': 'path',
              'required': true,
              'default': '',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'headerBool',
              'description': 'This contains a header',
              'type': 'boolean',
              'required': true,
              'default': 'True',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'delimiter',
              'description': 'In the case the inside the file',
              'type': 'string',
              'required': false,
              'default': ',',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            },
            {
              'name': 'datesBool',
              'description': 'This parameter is true whenever the File contains dates',
              'type': 'double',
              'required': false,
              'default': 'False',
              'hidden': false,
              'runner': [
                'standalone'
              ],
              'output': false
            }
          ],
          'readme': 'readme'
        }
      },
      'latest': true,
      'numver': 1000000,
      '__v': 0
    },
    {
      'name': 'visualization',
      'label': 'Visualization',
      'description': 'Visualization',
      'category': 'Reporting',
      'subcategory': 'Visualization',
      'icon': 'paint-brush',
      'version': '0.1.0',
      'language': 'pyspark',
      'tags': [
        'python',
        'spark',
        'pyspark',
        'dataframe',
        'Visualization'
      ],
      'directories': {
        'lib': 'lib',
        'modules': 'modules',
        'bin': 'bin',
        'test': 'test'
      },
      'readme': 'readme',
      'modules': {
        'barChart': {
          'name': 'barChart',
          'label': 'Bar Chart',
          'description': 'bar Chart',
          'icon': 'bar-chart-o',
          'source': 'visualization.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataset',
              'type': 'dataframe',
              'required': true,
              'default': 'saveFile',
              'role': 'input'
            },
            {
              'name': 'x',
              'description': 'column name for x axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'y',
              'description': 'column name for y axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'title',
              'description': 'title of the barchart',
              'type': 'string',
              'required': false,
              'default': ''
            }
          ],
          'readme': 'readme'
        },
        'boxChartDF': {
          'name': 'boxChartDF',
          'label': 'Boxplot Dataset',
          'description': 'boxChart of all the variables of a dataframe',
          'icon': 'pie-chart',
          'source': 'visualization.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataset',
              'type': 'dataframe',
              'required': true,
              'default': 'saveFile',
              'role': 'input'
            },
            {
              'name': 'title',
              'description': 'title of the barchart',
              'type': 'string',
              'required': false,
              'default': ''
            }
          ],
          'readme': 'readme'
        },
        'boxChartVars': {
          'name': 'boxChartVars',
          'label': 'Boxplot of dependent variables',
          'description': 'boxChart of a variable depending on another',
          'icon': 'pie-chart',
          'source': 'visualization.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataset',
              'type': 'dataframe',
              'required': true,
              'default': 'saveFile',
              'role': 'input'
            },
            {
              'name': 'x',
              'description': 'column name for x axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'y',
              'description': 'column name for y axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'title',
              'description': 'title of the barchart',
              'type': 'string',
              'required': false,
              'default': ''
            }
          ],
          'readme': 'readme'
        },
        'scatterChart': {
          'name': 'scatterChart',
          'label': 'Scatter Plot',
          'description': 'scatter plot',
          'icon': 'area-chart',
          'source': 'visualization.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataset',
              'type': 'dataframe',
              'required': true,
              'default': 'saveFile',
              'role': 'input'
            },
            {
              'name': 'x',
              'description': 'column name for x axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'y',
              'description': 'column name for y axis',
              'type': 'string',
              'required': true,
              'default': ''
            },
            {
              'name': 'title',
              'description': 'title of the barchart',
              'type': 'string',
              'required': false,
              'default': ''
            }
          ],
          'readme': 'readme'
        },
        'scatterplotMatrix': {
          'name': 'scatterplotMatrix',
          'label': 'Scatter Plot Matrix',
          'description': 'scatterplotMatrix of a Dataframe',
          'icon': 'th-large',
          'source': 'visualization.py',
          'parameters': [
            {
              'name': 'df',
              'description': 'Dataset',
              'type': 'dataframe',
              'required': true,
              'default': 'saveFile',
              'role': 'input'
            },
            {
              'name': 'title',
              'description': 'title of the barchart',
              'type': 'string',
              'required': false,
              'default': ''
            }
          ],
          'readme': 'readme'
        }
      },
      'latest': true,
      'numver': 1000000,
      '__v': 0
    }
];

  initController();

  function getZeppelinVersion() {
    $http.get(baseUrlSrv.getRestApiBase() + '/version').success(
      function(data, status, headers, config) {
        $rootScope.zeppelinVersion = data.body;
      }).error(
      function(data, status, headers, config) {
        console.log('Error %o %o', status, data.message);
      });
  }

  function initController() {
    $scope.isDrawNavbarNoteList = false;
    angular.element('#notebook-list').perfectScrollbar({suppressScrollX: true});

    angular.element(document).click(function() {
      $scope.query.q = '';
    });

    getZeppelinVersion();
    loadNotes();
    getListPackage();
  }

  function isFilterNote(note) {
    if (!$scope.query.q) {
      return true;
    }

    var noteName = note.name;
    if (noteName.toLowerCase().indexOf($scope.query.q.toLowerCase()) > -1) {
      return true;
    }
    return false;
  }

  function isActive(noteId) {
    return ($routeParams.noteId === noteId);
  }

  function listConfigurations() {
    websocketMsgSrv.listConfigurations();
  }

  function loadNotes() {
    websocketMsgSrv.getNoteList();
  }

  function getHomeNote(){
    websocketMsgSrv.getHomeNote();
  }

  function logout() {
    var logoutURL = baseUrlSrv.getRestApiBase() + '/login/logout';

    //for firefox and safari
    logoutURL = logoutURL.replace('//', '//false:false@');
    $http.post(logoutURL).error(function() {
      //force authcBasic (if configured) to logout
      $http.post(logoutURL).error(function() {
        $rootScope.userName = '';
        $rootScope.ticket.principal = '';
        $rootScope.ticket.ticket = '';
        $rootScope.ticket.roles = '';
        BootstrapDialog.show({
          message: 'Logout Success'
        });
        setTimeout(function() {
          window.location.replace('/');
        }, 1000);
      });
    });
  }

  function search(searchTerm) {
    $location.path('/search/' + searchTerm);
  }

  function showLoginWindow() {
    setTimeout(function() {
      angular.element('#userName').focus();
    }, 500);
  }

  // function to get list of packages
  function getListPackage() {
    $http({
      url : 'http://localhost:9999/api/v1/repo/search',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }

    }).then(function (response) {
        $rootScope.repo = response.data;
    },function (error){
        //$rootScope.repo = 'nothing';
    });

  }

  /*
   ** $scope.$on functions below
   */

   $rootScope.copyModule = function(valToCopy) {
     var dummy = document.createElement('input');
     document.body.appendChild(dummy);
    //  $(dummy).css('display','none');
     dummy.setAttribute('id', 'dummy_id');
     document.getElementById('dummy_id').value = valToCopy;
     dummy.select();
     document.execCommand('copy');
     document.body.removeChild(dummy);
  };
  $scope.$on('setNoteMenu', function(event, notes) {
    noteListDataFactory.setNotes(notes);
    initNotebookListEventListener();
  });

  $scope.$on('setConnectedStatus', function(event, param) {
    vm.connected = param;
  });

  $scope.$on('loginSuccess', function(event, param) {
    listConfigurations();
    loadNotes();
    getHomeNote();
  });

  /*
   ** Performance optimization for Browser Render.
   */
  function initNotebookListEventListener() {
    angular.element(document).ready(function() {
      angular.element('.notebook-list-dropdown').on('show.bs.dropdown', function() {
        $scope.isDrawNavbarNoteList = true;
      });

      angular.element('.notebook-list-dropdown').on('hide.bs.dropdown', function() {
        $scope.isDrawNavbarNoteList = false;
      });
    });
  }
}
