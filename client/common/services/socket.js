angular.module("app").factory("socket", function ($rootScope, $location) {
	var socket = io.connect("http://localhost:1112");

	var createPlayer = function () {
		socket.id = this.socket.sessionid;
		localStorage.setItem("playerId", socket.id);

		socket.emit("createPlayer", prompt("Your name:"));
	};

	socket.on("connect", function () {
		var playerId = localStorage.getItem("playerId");
		if (playerId) {
			socket.emit("getPlayer", playerId, function (player) {
				if (player && confirm("Looks like you slipped out. Hit OK to resume, or Cancel to create a new player.")) {
					socket.id = playerId;
					socket.emit("rejoinGame", playerId, function (game) {
						if (game !== null) {
							$rootScope.$apply(function () {
								$location.path("/" + game.state);
							});
						}
					});
				} else createPlayer.call(this);
			});
		} else createPlayer.call(this);
	});

	socket.on("games", function (games) {
		$rootScope.$apply(function () {
			$rootScope.games = games;
		});
	});
	socket.emit("games");

	socket.on("game", function (game) {
		$rootScope.$apply(function () {
			$rootScope.game = game;
		});
	});
	socket.emit("game");

	return socket;
});