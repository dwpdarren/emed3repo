angular.module("documentsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    documents: function(Documents) {
                        return Documents.getDocuments();
                    }
                }
            })
            .when("/new/document", {
                controller: "NewDocumentController",
                templateUrl: "document-form.html"
            })
            .when("/document/:documentId", {
                controller: "EditDocumentController",
                templateUrl: "document.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Documents", function($http) {
        this.getDocuments = function() {
            return $http.get("/documents").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding documents.");
                });
        }
        this.createDocument = function(document) {
            return $http.post("/documents", document).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating document.");
                });
        }
        this.getDocument = function(documentId) {
            var url = "/documents/" + documentId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this document.");
                });
        }
        this.editDocument = function(document) {
            var url = "/documents/" + document._id;
            console.log(document._id);
            return $http.put(url, document).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this document.");
                    console.log(response);
                });
        }
        this.deleteDocument = function(documentId) {
            var url = "/documents/" + documentId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this document.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(documents, $scope) {
        $scope.documents = documents.data;
    })
    .controller("NewDocumentController", function($scope, $location, Documents) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveDocument = function(document) {
            Documents.createDocument(document).then(function(doc) {
                var documentUrl = "/document/" + doc.data._id;
                $location.path(documentUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditDocumentController", function($scope, $routeParams, Documents) {
        Documents.getDocument($routeParams.documentId).then(function(doc) {
            $scope.document = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.documentFormUrl = "document-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.documentFormUrl = "";
        }

        $scope.saveDocument = function(document) {
            Documents.editDocument(document);
            $scope.editMode = false;
            $scope.documentFormUrl = "";
        }

        $scope.deleteDocument = function(documentId) {
            Documents.deleteDocument(documentId);
        }
    });
