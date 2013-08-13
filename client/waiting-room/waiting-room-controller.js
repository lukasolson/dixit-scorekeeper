angular.module("app").controller("waitingRoomController", function ($scope, $location, socket) {
	$scope.games = {};

	socket.on("games", function (games) {
		$scope.$apply(function () {
			$scope.games = games;
		});
	});
	socket.emit("games");

	// This can occur if someone leaves and returns
	socket.on("game", function (game) {
		if (game !== null) {
			$scope.$apply(function () {
				$location.path("/" + game.state);
			});
		}
	});
	socket.emit("game");

	$scope.createGame = function () {
		socket.emit("createGame");
		$location.path("/game-stats");
	};

	$scope.joinGame = function (gameId) {
		socket.emit("joinGame", gameId);
		$location.path("/game-stats");
	};
});