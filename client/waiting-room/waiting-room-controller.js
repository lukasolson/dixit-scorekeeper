angular.module("app").controller("waitingRoomController", function ($scope, $location, socket) {
	$scope.createGame = function () {
		socket.emit("createGame");
		$location.path("/game-stats");
	};

	$scope.joinGame = function (gameId) {
		socket.emit("joinGame", gameId);
		$location.path("/game-stats");
	};
});