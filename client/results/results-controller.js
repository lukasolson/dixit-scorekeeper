angular.module("app").controller("resultsController", function ($scope, $location, socket) {
	$scope.playerId = socket.id;

	function onBeginRound() {
		$location.path("/claim-vote");
	}
	socket.on("beginRound", onBeginRound);

	$scope.next = function () {
		$location.path("/game-stats");
	};

	$scope.$on("$destroy", function () {
		socket.removeListener(onBeginRound);
	});
});