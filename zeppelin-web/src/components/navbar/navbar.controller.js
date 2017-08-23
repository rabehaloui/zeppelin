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
  $rootScope.targetModal = '#helperModal'
  $rootScope.repo = '';

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
      },
      withCredentials: false
    }).then(function (response) {
        $rootScope.repo = response.data;
    },function (error){
        $rootScope.targetModal = '#helperModalError';
    });

  }

  // function to create signature of module
  function createModuleSignature(repoName,modul) {
    var functionName = modul.name  ;
    var from_ = 'from ' + repoName + '.' + modul.source.split('.')[0] + ' import ' + functionName ;
    var description = '# What the module does : ' + modul.description;
    var message = '# You need to your complete your variables : ';
    var varInput = '';
    var param_ = '';
    var paramReqired= '';
    var result = '' ;
    var resultReqired = '';

    modul.parameters.forEach(function(v) {
      if(v.role === 'output') {
        result = v.name;
        resultReqired = v.name;
      } else {
        if(v.default === false || typeof v.default === 'undefined') {
          varInput =  varInput + v.name + '= # type : ' + v.type + ' ' + ' # Description : ' + v.description + ' '+
           ' # Required : ' + v.required + ' '+ '\n';
        } else {
          varInput =  varInput + v.name + '=' + v.default  +' # type : ' + v.type + ' ' + ' # Description : '
          + v.description + ' '+ ' # Required : ' + v.required + ' '+ '\n';
        }
        param_ = param_ +  v.name  + ',';
        if(v.required === true) {
          paramReqired = paramReqired + v.name  + ',';
        }
      }
    });

    result = result + '=' + functionName + '(' + param_.slice(0,-1)  + ')';
    resultReqired = resultReqired + '=' + functionName + '(' + paramReqired.slice(0,-1)  + ')';
    return from_ + '\n\n' + description + '\n\n' + message +  '\n' + varInput + '\n\n' +
    '# function with only required parameters' + resultReqired + '\n\n' +
    '# function with all parameters' + result;
  }

  // function to copy signature of module
  $rootScope.copyModule = function(repoName,moduleName) {
     var valToCopy = createModuleSignature(repoName,moduleName)
     var inputOfModule = document.createElement('input');
     document.body.appendChild(inputOfModule);
     inputOfModule.setAttribute('id', 'inputOfModule_id');
     document.getElementById('inputOfModule_id').value = valToCopy;
     inputOfModule.select();
     document.execCommand('copy');
     document.body.removeChild(inputOfModule);
   };

  /*
   ** $scope.$on functions below
   */

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
