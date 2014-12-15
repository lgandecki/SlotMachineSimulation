Meteor.publish("simulations", function() {
    return Simulations.find();
});
