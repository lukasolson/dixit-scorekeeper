angular.module("app").controller("claimVoteController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;
	$scope.claimCardIndex = $scope.voteCardIndex = -1;
	$scope.claimed = $scope.voted = false;

	socket.on("game", function (game) {
		$scope.$apply(function () {
			$scope.game = game;
		});
	});
	socket.emit("game");

	socket.on("endRound", function () {
		$scope.$apply(function () {
			$location.path("/results");
		});
	});

	$scope.claimCard = function () {
		socket.emit("claimCard", $scope.claimCardIndex);
		$scope.claimed = true;
	};

	$scope.voteForCard = function () {
		socket.emit("voteForCard", $scope.voteCardIndex);
		$scope.voted = true;
	};
});