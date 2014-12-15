Meteor.publish("game", function(opts) {
    var _query = {iterationNumber: parseInt(opts.iterationNumber), initialMoney: parseInt(opts.initialMoney)};
    console.log("game query", _query);
    return Games.find(_query, {sort: {gameNumber: 1}});
});
