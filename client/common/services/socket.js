angular.module("app").factory("socket", function ($rootScope, $location) {
	var socket = io.connect("http://localhost:1112");
	socket.on("connect", function () {
		var playerId = localStorage.getItem("playerId");
		if (playerId && confirm("Looks like you slipped out. Hit OK to resume, or Cancel to create a new player.")) {
			socket.id = playerId;
			socket.emit("rejoinGame", playerId, function (game) {
				if (game !== null) {
					$rootScope.$apply(function () {
						$location.path("/" + game.state);
					});
				}
			});
		} else {
			socket.id = this.socket.sessionid;
			localStorage.setItem("playerId", socket.id);

			socket.emit("createPlayer", prompt("Your name:"));
		}
	});

	return socket;
});