angular.module("app").controller("resultsController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;

	socket.on("game", function (game) {
		$scope.$apply(function () {
			$scope.game = game;
		});
	});
	socket.emit("game");

	$scope.next = function () {
		$location.path("/game-stats");
	};
});