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
    var percent_ = '%spark.pyspark';
    var from_ = 'from ' + repoName + '.' + modul.source.split('.')[0] + ' import ' + functionName ;
    var description = '# What the module does : ' + modul.description;
    var message = '# You need to your complete your variables : ';
    var param_ = '';
    var paramRequired = '';
    var inputOptional = '';
    var inputRequired = '';
    var result = '';
    var resultRequired = '';

    modul.parameters.forEach(function(v) {
      if(v.role === 'output') {
        result = v.name;
        resultRequired = v.name;
      } else {
        if(v.default === false || typeof v.default === 'undefined') {
          if(v.required === true) {
            inputRequired = inputRequired + v.name + '= # type : ' + v.type + ' ' + ' # Description : '
            + v.description + '\n';
            paramRequired = paramRequired +  v.name  + ',';
          }else {
            inputOptional = inputOptional + v.name + '= # type : ' + v.type + ' ' + ' # Description : '
             + v.description + '\n';
          }
        } else {
          if(v.required === true) {
            inputRequired = inputRequired + v.name + '=' + v.default  +' # type : ' + v.type + ' ' + ' # Description : '
            + v.description + '\n';
            paramRequired = paramRequired +  v.name  + ',';
          }else {
            inputOptional = inputOptional + v.name + '=' + v.default  +' # type : ' + v.type + ' ' + ' # Description : '
            + v.description + '\n';
          }
        }
        param_ = param_ +  v.name  + ',';
      }
    });

    result = result + '=' + functionName + '(' + param_.slice(0,-1)  + ')';
    resultRequired = resultRequired + '=' + functionName + '(' + paramRequired.slice(0,-1)  + ')';

    return percent_ + '\n\n' + from_ + '\n\n' + description + '\n\n' + message +  '\n\n' +
    '########################################################' + '\n' +
    '################ Required parameters ###################' + '\n' +
    '########################################################' + '\n\n'
     + inputRequired + '\n\n' +

     '########################################################' + '\n' +
     '################ Optional parameters ###################' + '\n' +
     '########################################################' + '\n\n'
     + inputOptional + '\n\n' +

    '########################################################' + '\n' +
    '####### function with only required parameters #########' + '\n' +
    '########################################################' + '\n\n' +
    '# Uncomment to run this function' + '\n\n' +
    '# ' + resultRequired + '\n\n' +

    '########################################################' + '\n' +
    '####### function with all parameters ###################' + '\n' +
    '########################################################' + '\n\n'
    + result;
  }

  // function to copy signature of module
  $rootScope.copyModule = function(repoName,moduleName) {
     var valToCopy = createModuleSignature(repoName,moduleName)

     if (window.clipboardData && window.clipboardData.setData) {
         window.clipboardData.setData('text/plain', valToCopy);
         console.log('clipboardData...')
     } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
         var inputOfModule = document.createElement('textarea');
         document.body.appendChild(inputOfModule);
         inputOfModule.setAttribute('id', 'inputOfModule_id');
         document.getElementById('inputOfModule_id').value = valToCopy;
         inputOfModule.select();

         try {
             document.execCommand('copy');
         } catch (ex) {
             console.warn('Copy to clipboard failed.', ex);
         } finally {
             document.body.removeChild(inputOfModule);
         }
     }

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
