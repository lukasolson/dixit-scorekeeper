var EventEmitter = require("events").EventEmitter;

function DixitGame(id) {
	this.id = id;
	this.players = [];
	this.playersMap = {};
	this.storytellerIndex = -1;

	this.cards = this.votesCount;
}

DixitGame.prototype = new EventEmitter();

DixitGame.prototype.addPlayer = function (player) {
	this.players.push(player);
	this.playersMap[player.id] = player;
};

DixitGame.prototype.beginRound = function () {
	this.storytellerIndex = (this.storytellerIndex + 1) % this.players.length;

	this.cards = [];
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].card = null;
		this.cards.push({
			index: i,
			voterIds: []
		});

		this.players[i].results = [];
	}

	this.votesCount = 0;
};

DixitGame.prototype.claimCard = function (player, cardIndex) {
	player.card = this.cards[cardIndex];
	if (this.votesCount === this.players.length - 1 && this.players[this.storytellerIndex].card) this.endRound();
};

DixitGame.prototype.voteForCard = function (player, cardIndex) {
	this.cards[cardIndex].voterIds.push(player.id);
	if (++this.votesCount === this.players.length - 1 && this.players[this.storytellerIndex].card) this.endRound();
};

DixitGame.prototype.endRound = function () {
	var storyteller = this.players[this.storytellerIndex];
	if (storyteller.card.voterIds.length === this.players.length - 1) {
		// If all the players have found the storyteller’s image, then the storyteller doesn’t score any points and everyone else scores 2 points.
		for (var i = 0; i < this.players.length; i++) {
			if (i === this.storytellerIndex) continue;
			this.players[i].results.push({
				score: 2,
				description: "All players found the storyteller's image"
			});
		}
	} else if (storyteller.card.voterIds.length === 0) {
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
		for (var i = 0; i < storyteller.card.voterIds.length; i++) {
			voters.push(this.playersMap[storyteller.card.voterIds[i]].name);
			this.playersMap[storyteller.card.voterIds[i]].results.push({
				score: 3,
				description: "You found the storyteller's image"
			});
		}

		storyteller.results.push({
			score: 3,
			description: voters.join(", ") + " found your image"
		});
	}

	// Each player, except the storyteller, scores one point for each vote that was placed on his or her image.
	for (var i = 0; i < this.players.length; i++) {
		if (i === this.storytellerIndex || this.players[i].card.voterIds.length === 0) continue;
		var voters = [];
		for (var j = 0; j < this.players[i].card.voterIds.length; j++) {
			voters.push(this.playersMap[this.players[i].card.voterIds[j]].name);
		}
		this.players[i].results.push({
			score: voters.length,
			description: voters.join(", ") + " voted for your image"
		});
	}

	for (var i = 0; i < this.players.length; i++) {
		for (var j = 0; j < this.players[i].results.length; j++) {
			this.players[i].score += this.players[i].results[j].score;
		}
	}

	this.emit("endRound");
};

module.exports = DixitGame;