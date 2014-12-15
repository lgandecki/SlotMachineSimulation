

var _slotMachine = {
    _reels: ["Cherries", "Oranges", "Bananas", "Lemons", "Grapes", "Bars"],
    _numberOfReels: 3,
    _getRandomReel: function () {
        var _randomNumber = Math.floor(Math.random() * this._reels.length);
        return this._reels[_randomNumber];
    },
    _returnReelLine: function () {
        var _reelLine = [];
        for (var i = 0; i < this._numberOfReels; i++) {
            _reelLine.push(this._getRandomReel());
        }
        return _reelLine;
    },
    _lineWins: function (reelLine) {
        return _.unique(reelLine).length === 1;
    },
    _moneyReturned: function (reelLine, money) {
        if (this._lineWins(reelLine)) {
            return money * 3;
        } else {
            return 0;
        }
    },
    play: function (money) {

        var _reelLine = this._returnReelLine();

        // console.log(_reelLine);

        return {
            moneyReturned: this._moneyReturned(_reelLine, money),
            reelLine: _reelLine
        };
    }
}


var _player = {
    _budget: 0,
    _numGames: 0,
    _iteration: 0,
    setBudget: function (money) {
        this._budget = money;
        this._initialMoney = money;
        this._numGames = 0;
    },
    setIteration: function(iteration) {
        this._iteration = iteration;
    },
    getIteration: function() {
        return this._iteration;
    },
    playGame: function (slotMachine) {
        var _moneyNeededToPlay = Math.pow(2, this._numGames);
        if (_moneyNeededToPlay <= this._budget) {
            this._budget -= _moneyNeededToPlay;
            var _gameResult = slotMachine.play(_moneyNeededToPlay);
            var _moneyReturned = _gameResult.moneyReturned;
            this._numGames++;
            if (_moneyReturned) {
                this._budget += _moneyReturned;
                Games.insert({cashPayed: _moneyNeededToPlay, won: true, iterationNumber: this.getIteration(), gameNumber: this._numGames, initialMoney: this.getInitialMoney(), reelLine: _gameResult.reelLine});
                //          console.log("You won on game " + this._numGames + " with " + this._budget);
                return false;
            }
            Games.insert({cashPayed: _moneyNeededToPlay, won: false, iterationNumber: this.getIteration(), gameNumber: this._numGames, initialMoney: this.getInitialMoney(), reelLine: _gameResult.reelLine});

            return true;
        } else {
            // console.log("You lost all your money");
            return false;
        }

    },
    getBudget: function () {
        return this._budget;
    },
    getInitialMoney: function() {
        return this._initialMoney;
    },
    getNumberOfGamesPlayed: function () {
        return this._numGames;
    },

    playUntilOutOfMoney: function () {
        while (_player.playGame(_slotMachine)) {
            // console.log("Budget: ", _player.getBudget(), " Games played: ", _player.getNumberOfGamesPlayed());
        }
    },

    totalMoneyPlayed: function (numGames) {
        var totalMoney = 0;
        for (var i = 0; i < numGames; i++) {
            totalMoney += Math.pow(2, i);
        }
        return totalMoney;
    }

};

var simulation = {
    _iterations: 1000,
    _casinoBalance: 0,
    _biggestWin: 0,
    _numWon: 0,

    runSimulation: function (initialMoney, player) {
        Spinners.insert({});
        this._casinoBalance = 0;
        this._biggestWin = 0;
        this._numWon = 0;
        for (var i = 0; i < this._iterations; i++) {
            player.setBudget(initialMoney);
            player.setIteration(i);
            player.playUntilOutOfMoney();

            var _playerBudgetDifference = initialMoney - player.getBudget();
            if (_playerBudgetDifference < 0) {
                this._numWon++;
                if (this._biggestWin < Math.abs(_playerBudgetDifference)) {
                    this._biggestWin = Math.abs(_playerBudgetDifference);
                }
            }
            this._casinoBalance += _playerBudgetDifference;
        }
        Simulations.insert({initialMoney: initialMoney, gamesWon: this._numWon, iterations: this._iterations, biggestWin: initialMoney + this._biggestWin, casinoWinnings: this._casinoBalance})
        Spinners.remove({});
        //console.log("For initial budget of " + initialMoney + " you won " + ((this._numWon / this._iterations) * 100) + "% games, Your biggest win: " + (initialMoney + this._biggestWin) + ", casino won alltogether: " + this._casinoBalance);
    }
};

Meteor.methods({
    runSimulation: function(initialMoney) {
        simulation.runSimulation(parseInt(initialMoney), _player);
        //simulation.runSimulation(1000, _player);
    },
    cleanDB: function() {
        Spinners.remove({});
        Simulations.remove({});
        Games.remove({});
    }
});