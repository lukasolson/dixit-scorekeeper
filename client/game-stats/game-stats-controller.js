angular.module("app").controller("gameStatsController", function ($scope, $location, socket) {
	$scope.playerId = socket.id;

	function onBeginRound() {
		$location.path("/claim-vote");
	}
	socket.on("beginRound", onBeginRound);

	$scope.beginRound = function () {
		socket.emit("beginRound");
	};

	$scope.$on("$destroy", function () {
		socket.removeListener(onBeginRound);
	});
});