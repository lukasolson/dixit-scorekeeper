angular.module("app").controller("claimVoteController", function ($scope, $location, socket) {
	$scope.game = {};
	$scope.playerId = socket.id;
	$scope.claimCards = [];
	$scope.voteCards = [];
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

	var claimCardIndices = [];
	$scope.claimCard = function (index) {
		if ($scope.claimCards[index]) {
			claimCardIndices.push(index);
			$scope.voteCards[index] = false;

			// With 3 players, the players (except for the storyteller) each hand in two image cards (instead of just one).
			if (claimCardIndices.length > 2 || (($scope.game.players.length !== 3 || $scope.playerId == $scope.game.players[$scope.game.storytellerIndex].id) && claimCardIndices.length > 1)) {
				$scope.claimCards[claimCardIndices.shift()] = false;
			}
		} else {
			claimCardIndices.splice(claimCardIndices.indexOf(index), 1);
		}
	};

	var voteCardIndices = [];
	$scope.voteForCard = function (index) {
		if ($scope.voteCards[index]) {
			voteCardIndices.push(index);

			// With 7 or more players, each player may, if they wish to do so, vote for a second image if they want to increase their chance of success.
			if (voteCardIndices.length > 2 || ($scope.game.players.length < 7 && voteCardIndices.length > 1)) {
				$scope.voteCards[voteCardIndices.shift()] = false;
			}
		} else {
			voteCardIndices.splice(voteCardIndices.indexOf(index), 1);
		}
	};

	$scope.claimAndVote = function () {
		if ($scope.game.players.length === 3 && $scope.playerId != $scope.game.players[$scope.game.storytellerIndex].id && claimCardIndices.length < 2) return alert("You must select two cards which are yours.");
		if (claimCardIndices.length < 1) return alert("You must select which card is yours.");
		if ($scope.playerId !== $scope.game.players[$scope.game.storytellerIndex].id && voteCardIndices.length < 1) return alert("You must select which card you think is the storyteller's.");

		socket.emit("claimCards", claimCardIndices);
		if ($scope.playerId !== $scope.game.players[$scope.game.storytellerIndex].id) socket.emit("voteForCards", voteCardIndices);

		$scope.claimedAndVoted = true;
	};
});