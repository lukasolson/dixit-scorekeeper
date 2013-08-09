angular.module("app").controller("gameStatsController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;

	socket.on("game", function (game) {
		$scope.$apply(function () {
			$scope.game = game;
		});
	});
	socket.emit("game");

	socket.on("beginRound", function () {
		$location.path("/claim-vote");
	});

	$scope.beginRound = function () {
		socket.emit("beginRound");
	};
});