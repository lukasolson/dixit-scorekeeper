angular.module("app").factory("socket", function () {
	var socket = io.connect("http://localhost:1112");
	socket.on("connect", function () {
		socket.id = this.socket.sessionid;
	});

	socket.emit("createPlayer", prompt("Your name:"));

	return socket;
});