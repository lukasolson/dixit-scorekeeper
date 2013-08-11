angular.module("app").controller("claimVoteController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;
	$scope.claimCardIndex = $scope.voteCardIndex = -1;
	$scope.claimedAndVoted = false;

	socket.on("game", function (game) {
		if (game === null) $location.path("");
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

	$scope.claimAndVote = function () {
		if ($scope.claimCardIndex === $scope.voteCardIndex) return alert("You cannot vote for your own card.");
		socket.emit("claimCard", $scope.claimCardIndex);
		if ($scope.playerId !== $scope.game.players[$scope.game.storytellerIndex].id) socket.emit("voteForCard", $scope.voteCardIndex);
		$scope.claimedAndVoted = true;
	};
});