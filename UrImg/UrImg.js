Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

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

Router.route('/MyImgs', function() {
    this.render('MyImages');
    this.layout('layout');
});

Router.route('/Random', function() {
    this.render('Random');
    this.layout('layout');
});

Router.route('/Newest', function() {
    this.render('Newest');
    this.layout('layout');
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  
  Template.navitems.helpers({
    currentuser: function(){
      return Meteor.user();
    },
    
    currRoute: function(){
      return Router.current().route.path();
    },
    
    myroute: function(){
      return Router.current().route.path().toString() === "/MyImgs";
    }
    
  });
  
  
  
  Template.hello.events({
    'dropped #dropzone': function(event, temp){
        console.log('files dropped');
        FS.Utility.eachFile(event, function(file){
            Images.insert(file, function(err, fileObj){
                
            });
        });
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
    Images.allow({
        'insert': function () {
          // add custom authentication code here
          return true;
        }
      });
  });
}
