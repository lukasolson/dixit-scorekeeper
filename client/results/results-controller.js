angular.module("app").controller("resultsController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;

	socket.on("game", function (game) {
		if (game === null) $location.path("");
		$scope.$apply(function () {
			$scope.game = game;
		});
	});
	socket.emit("game");

	$scope.next = function () {
		$location.path("/game-stats");
	};
});