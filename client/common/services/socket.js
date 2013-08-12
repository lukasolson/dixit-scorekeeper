angular.module("app").factory("socket", function () {
	var socket = io.connect("http://192.168.1.18:1112");
	socket.on("connect", function () {
		var playerId = localStorage.getItem("playerId");
		if (playerId && confirm("Looks like you slipped out. Hit OK to resume, or Cancel to create a new player.")) {
			socket.id = playerId;
			socket.emit("rejoinGame", playerId);
		} else {
			socket.id = this.socket.sessionid;
			localStorage.setItem("playerId", socket.id);

			socket.emit("createPlayer", prompt("Your name:"));
		}
	});

	return socket;
});