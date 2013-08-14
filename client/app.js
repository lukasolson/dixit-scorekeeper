angular.module("app", [])
	.config(["$routeProvider", function ($routeProvider) {
		$routeProvider
			.when("/waiting-room", {
				controller: "waitingRoomController",
				templateUrl: "waiting-room/waiting-room.html"
			})
			.when("/game-stats", {
				controller: "gameStatsController",
				templateUrl: "game-stats/game-stats.html"
			})
			.when("/claim-vote", {
				controller: "claimVoteController",
				templateUrl: "claim-vote/claim-vote.html"
			})
			.when("/results", {
				controller: "resultsController",
				templateUrl: "results/results.html"
			})
			.otherwise({
				redirectTo: "/waiting-room"
			});
	}])
	.run(function ($rootScope, $location) {
		var removeListener = $rootScope.$on("$routeChangeStart", function () {
			removeListener();
			$location.path("");
		});
	});