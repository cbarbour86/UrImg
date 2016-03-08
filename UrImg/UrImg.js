Router.route('/', function(){
    this.render('hello');
    this.layout('layout');  
  });

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  
  Template.navitems.helpers({
    currentuser: function(){
      return Meteor.user();
    }
  });
  
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
  Accounts.ui.config({
    //options are listed in book p. 135
    //USERNAME_AND_EMAIL, USERNAME_AND_OPTIONAL_EMAIL
    //USERNAME_ONLY, EMAIL_ONLY
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
