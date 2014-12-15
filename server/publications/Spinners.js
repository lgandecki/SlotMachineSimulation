Meteor.publish("spinners", function() {
    return Spinners.find();
});
