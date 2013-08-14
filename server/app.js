var DixitGame = require("./dixit-game"),
	app = require("http").createServer(),
	io = require("socket.io").listen(app);

app.listen(1112);

io.set("log level", 1);

var games = {},
	players = {};

io.sockets.on("connection", function (socket) {
	var player = {id: socket.id, name: null, score: 0, gameId: null},
		game = null;

	socket.on("games", function () {
		socket.emit("games", games);
	});

	socket.on("game", function () {
		socket.emit("game", game);
	});

	socket.on("createPlayer", function (name) {
		console.log("creating player " + socket.id);
		(players[socket.id] = player).name = name;
	});

	socket.on("createGame", function () {
		game = games[player.id] = new DixitGame(player.id);
		player.gameId = game.id;
		game.addPlayer(player);
		socket.join(game.id);
		io.sockets.emit("games", games);
	});

	socket.on("joinGame", function (gameId) {
		(game = games[gameId]).addPlayer(player);
		player.gameId = gameId;
		socket.join(game.id);
		io.sockets.in(game.id).emit("game", game);
		io.sockets.emit("games", games);
	});

	socket.on("rejoinGame", function (playerId, callback) {
		player = players[playerId];
		if (player && player.gameId) {
			game = games[player.gameId];
			socket.join(game.id);
		}
		socket.emit("game", game);
		callback(game);
	});

	socket.on("beginRound", function () {
		game.beginRound();
		io.sockets.in(game.id).emit("beginRound");
		io.sockets.emit("games", games);
		game.on("endRound", function () {
			io.sockets.in(game.id).emit("endRound");
		});
	});

	socket.on("claimCards", function (cardIndices) {
		game.claimCards(player, cardIndices);
		io.sockets.in(game.id).emit("game", game);
	});

	socket.on("voteForCards", function (cardIndices) {
		game.voteForCards(player, cardIndices);
		io.sockets.in(game.id).emit("game", game);
	});
});