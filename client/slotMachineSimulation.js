
  Session.setDefault("counter", 0);

  Meteor.subscribe("simulations");
  Meteor.subscribe("spinners");

  //simulation.runSimulation(10000, _player);
  //simulation.runSimulation(100000, _player);
  //simulation.runSimulation(1000000, _player);
  //simulation.runSimulation(10000000, _player);
  //simulation.runSimulation(100000000, _player);
  //simulation.runSimulation(1000000000, _player);
  //simulation.runSimulation(1000000000000000, _player);



  Template.results.helpers({
    simulation: function () {
      return Simulations.find();
    },
    percentageWon: function() {
      return (this.gamesWon / this.iterations) * 100;
    },
    spinnerExists: function() {
      var _spinners = Spinners.find();
      return _spinners.count() > 0 ? true: false;
    }
  });

  Template.runSimulation.events({
    'click button': function () {
      // increment the counter when button is clicked
      var _initialBudget = $("#initalBudget").val();
      Meteor.call("runSimulation", _initialBudget);

    }
  });

  Template.searchGame.helpers({
    simulation: function() {
      return Simulations.find();
    },
    game: function() {
      return Games.find();
    },
    reelLine: function() {
      //var _image = "";
      //this.reelLine.forEach(function(fruit) {
      //  _image += '<img src="/fruits/"' + fruit + ''
      //})
      return this.reelLine;
    },
    iterationFound: function() {
      return Games.findOne();
    }
  });
  var _gameSubscription = null;
  Template.searchGame.events({
    'click button': function() {
      var _opts = {
        iterationNumber : $("#iterationNumber").val(),
        initialMoney: $("#initialMoney").val()
      };
      _gameSubscription && _gameSubscription.stop();
      _gameSubscription = Meteor.subscribe("game", _opts);
    }
  })


Template.cleanDB.events({
  'click button': function() {
    Meteor.call("cleanDB");
  }
});