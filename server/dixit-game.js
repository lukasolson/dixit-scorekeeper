var EventEmitter = require("events").EventEmitter;

function DixitGame(id) {
	this.id = id;
	this.players = [];
	this.playersMap = {};
	this.storytellerIndex = -1;

	this.cards = this.votesCount = null;
	this.state = DixitGame.states.GAME_STATS;
}

DixitGame.states = {
	GAME_STATS: "game-stats",
	CLAIMING_VOTING: "claim-vote"
};

DixitGame.prototype = new EventEmitter();

DixitGame.prototype.addPlayer = function (player) {
	this.players.push(player);
	this.playersMap[player.id] = player;
};

DixitGame.prototype.beginRound = function () {
	this.state = DixitGame.states.CLAIMING_VOTING;
	this.storytellerIndex = (this.storytellerIndex + 1) % this.players.length;
	this.cards = [];

	// With 3 players, the players (except for the storyteller) each hand in two image cards (instead of just one). This way, 5 image cards are always revealed, and players must still find the storyteller's image among those.
	for (var i = 0; i < (this.players.length === 3 && 5 || this.players.length); i++) {
		this.cards.push({
			index: i,
			voterIds: []
		})
		if (i < this.players.length) {;
			this.players[i].cards = [];
			this.players[i].votes = [];
			this.players[i].results = []
		};
	}

	this.votesCount = 0;
};

DixitGame.prototype.claimCards = function (player, cardIndices) {
	for (var i = 0; i < cardIndices.length; i++) {
		player.cards.push(this.cards[cardIndices[i]]);
	}
	if (this.votesCount === this.players.length - 1 && this.players[this.storytellerIndex].cards.length) this.endRound();
};

DixitGame.prototype.voteForCards = function (player, cardIndices) {
	for (var i = 0; i < cardIndices.length; i++) {
		this.cards[cardIndices[i]].voterIds.push(player.id);
		player.votes.push(this.cards[cardIndices[i]]);
	}
	if (++this.votesCount === this.players.length - 1 && this.players[this.storytellerIndex].cards.length) this.endRound();
};

DixitGame.prototype.endRound = function () {
	this.state = DixitGame.states.GAME_STATS;

	var storyteller = this.players[this.storytellerIndex];
	if (storyteller.cards[0].voterIds.length === this.players.length - 1) {
		// If all the players have found the storyteller’s image, then the storyteller doesn’t score any points and everyone else scores 2 points.
		for (var i = 0; i < this.players.length; i++) {
			if (i === this.storytellerIndex) continue;
			this.players[i].results.push({
				score: 2,
				description: "All players found the storyteller's image"
			});
		}
	} else if (storyteller.cards[0].voterIds.length === 0) {
		// If none of the players have found the storyteller’s image, then the storyteller doesn’t score any points and everyone else scores 2 points.
		for (var i = 0; i < this.players.length; i++) {
			if (i === this.storytellerIndex) continue;
			this.players[i].results.push({
				score: 2,
				description: "No players found the storyteller's image"
			});
		}
	} else {
		// In any other case, the storyteller scores 3 points and so do the players who found his image.
		var voters = [];
		for (var i = 0; i < storyteller.cards[0].voterIds.length; i++) {
			voters.push(this.playersMap[storyteller.cards[0].voterIds[i]].name);
			var player = this.playersMap[storyteller.cards[0].voterIds[i]];
			player.results.push({
				score: 3,
				description: "You found the storyteller's image"
			});

			// With 7 or more players, players who voted for only one image score 1 extra point if they have found the storyteller’s image.
			if (this.players.length >= 7 && player.votes.length === 1) {
				player.results.push({
					score: 1,
					description: "You voted for only one image and found the storyteller's image"
				});
			}
		}
		storyteller.results.push({
			score: 3,
			description: voters.join(", ") + " found your image"
		});
	}

	// Each player, except the storyteller, scores one point for each vote that was placed on his or her image.
	for (var i = 0; i < this.players.length; i++) {
		if (i === this.storytellerIndex) continue;
		for (var j = 0; j < this.players[i].cards.length; j++) {
			if (this.players[i].cards[j].voterIds.length === 0) continue;
			var voters = [];
			for (var k = 0; k < this.players[i].cards[j].voterIds.length; k++) {
				voters.push(this.playersMap[this.players[i].cards[j].voterIds[k]].name);
			}
			this.players[i].results.push({
				// With 7 or more players, each player (other than the storyteller) scores one bonus point for each vote earned by his or her image, with a limit of 3 bonus points maximum (even if their image has earned more than 3 votes).
				score: (this.players.length >= 7 && Math.min(voters.length, 3) || voters.length),
				description: voters.join(", ") + " voted for your image (#" +( this.players[i].cards[j].index+ 1)  + ")"
			});
		}
	}

	for (var i = 0; i < this.players.length; i++) {
		this.players[i].roundScore = 0;
		for (var j = 0; j < this.players[i].results.length; j++) {
			this.players[i].roundScore += this.players[i].results[j].score;
		}
		this.players[i].score += this.players[i].roundScore;
	}

	this.emit("endRound");
};

module.exports = DixitGame;