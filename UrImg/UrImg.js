Router.route('/', function(){
    this.render('hello');
    this.layout('layout');  
  });

Router.route('/about', function() {
    this.render('about');
    this.layout('layout');
});

Router.route('/contact', function() {
    this.render('contact');
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
  
  Accounts.ui.config({
    //options are listed in book p. 135
    //USERNAME_AND_EMAIL, USERNAME_AND_OPTIONAL_EMAIL
    //USERNAME_ONLY, EMAIL_ONLY
    passweordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
