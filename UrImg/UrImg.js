var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 200x200px thumbnail
  gm(readStream, fileObj.name()).resize('200', '200').stream().pipe(writeStream);
};

//db.Images.drop();

Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("thumbs", { transformWrite: createThumb, path: "~/thumbs"}),
           new FS.Store.FileSystem("images", {path: "~/uploads"})],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
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
  
  Template.myImages.helpers({
    images: function () {
      return Images.find(); // Where Images is an FS.Collection instance
    }
  });
  
   
  Template.navitems.events({
    'click #upload': function(event){
      event.preventDefault();
      Modal.show('uploadModal');
    }
  });
  
  Template.uploadModal.events({
    'dropped #dropzone': function(event, temp){
        console.log('files dropped');
        FS.Utility.eachFile(event, function(file){
            Images.insert(file, function(err, fileObj){
                
            });
        });
    },
    'click #uploadImg': function(event, temp){
      event.preventDefault();
      var file = $('#file').get(0).files[0];
      var fileObj = Images.insert(file);
      console.log('Upload result: ', fileObj);
    }
  });
  
  Template.myImages.events({
    'click button': function(event){
      event.preventDefault();
      Meteor.call('removeAllImages');
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
    Images.allow({
        insert: function () {
          return true;
        },
        update: function () {
          return true;
        },
        remove: function () {
          return true;
        },
        download: function () {
          return true;
        }
      });
    return Meteor.methods({

      removeAllImages: function() {

        return Images.remove({});

      }

    });
  });
}
