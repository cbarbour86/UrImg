/**
 *This function takes in the file and uses GraphicMagick
 *on the server machine to resize the image and spit it back
 *out to be used as a thumbnail. Resizes to 200px by 200px.
 *Server machine must have the program installed or it will
 *not work.
 */
var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 200x200px thumbnail
  gm(readStream, fileObj.name()).resize('200', '200').stream().pipe(writeStream);
};

//db.Images.drop();

/**
 *Creates the collection that will store the links
 *to all the images uploaded to and saved on the
 *server computer. It contains two 'stores' that house
 *links for the raw images as well as the thumbnails for
 *those images. The filter object will only allow users
 *to upload files that are images.
 */
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"}),
           new FS.Store.FileSystem("thumbs", { transformWrite: createThumb, path: "~/thumbs"})],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

/**
 *Sets the homepage to route to render
 *the homepage template.
 */
Router.route('/', function(){
    this.render('homepage');
    this.layout('layout');  
  });

/**
 *Sets the about route to render
 *the about template.
 */
Router.route('/about', function() {
    this.render('about');
    this.layout('layout');
});

/**
 *Sets the contact route to render
 *the contact template.
 */
Router.route('/contact', function() {
    this.render('contact');
    this.layout('layout');
});

/**
 *Sets the MyImgs route to render
 *the MyImages template, which only
 *displays images uploaded by the current
 *user.
 */
Router.route('/MyImgs', function() {
    this.render('myImages');
    this.layout('layout');
});
/*
Router.route('/Random', function() {
    this.render('Random');
    this.layout('layout');
});*/
/*
Router.route('/Newest', function() {
    this.render('Newest');
    this.layout('layout');
});*/

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  
  /**
   *Returns the currently logged in
   *user to be able to see who is
   *uploading images
   */
  Template.navitems.helpers({
    currentuser: function(){
      return Meteor.user();
    }/*,
    
    currRoute: function(){
      return Router.current().route.path();
    },
    
    myroute: function(){
      return Router.current().route.path().toString() === "/MyImgs";
    }*/
    
  });
  
  /**
   *This returns the image object
   *of only images uploaded by the
   *current user sorted by newest first.
   */
  Template.myImages.helpers({
    images: function () {
      return Images.find({"owner": Meteor.user()}, {sort: {uploadedAt: -1}}); // Where Images is an FS.Collection instance
    },
    img: function(){
      return this;
    }
  });
  
  /**
   *Adds events to the myImages template,
   *one that adds a delete all button for
   *debugging purposes, and the other that sets
   *clicked image url to a session variable
   *that holds that images url and then opens the
   *image popup.
   */
  Template.myImages.events({
    'click button': function(event){
      event.preventDefault();
      Meteor.call('removeAllImages');
    },
    'click img': function(event){
      event.preventDefault();
      console.log(this, arguments);
      var img = this.url('images');
      Session.set('imageUrl', img);
      Modal.show('imageModal');
    }
  });
  
  /**
   *Returns all images in the collecton
   *sorted by newest first.
   */
  Template.homepage.helpers({
    images: function () {
      return Images.find({}, {sort: {uploadedAt: -1}}); // Where Images is an FS.Collection instance
    },
    img: function(){
      return this;
    }
  });
  
  /**
   *Adds events to the homepage
   *that creates a button that will
   *delete all objects in the collection
   *as well as all images off the server computer,
   *and when you click on an image it sets a
   *Session variable with that clicked image
   *url and then opens the image popup.
   */
  Template.homepage.events({
    'click button': function(event){
      event.preventDefault();
      Meteor.call('removeAllImages');
    },
    'click img': function(event){
      event.preventDefault();
      console.log(this, arguments);
      var img = this.url('images');
      Session.set('imageUrl', img);
      Modal.show('imageModal');
    }
  });
  
  /**
   *Adds events to the navbar
   *when clicking on the upload button.
   *If clicked it will open a popup that
   *allows the user to drag and drop images
   *or open a file selector.
   */
  Template.navitems.events({
    'click #upload': function(event){
      event.preventDefault();
      Modal.show('uploadModal');
    }
  });
  
  /**
   *Adds events to the upload image
   *popup that allow users to drag and drop
   *files anywhere on the popup, or allows user
   *to press a button to select a file and upload
   *that way.
   */
  Template.uploadModal.events({
    'dropped #dropzone': function(event, temp){
        console.log('files dropped');
        FS.Utility.eachFile(event, function(file){
          fsFile = new FS.File(file);
          fsFile.owner = Meteor.user();
            Images.insert(fsFile, function(err, fileObj){
                
            });
        });
      Modal.hide('uploadModal');
    },
    'click #uploadImg': function(event, temp){
      event.preventDefault();
      var file = $('#file').get(0).files[0];
      fsFile = new FS.File(file);
      fsFile.owner = Meteor.user();
      var fileObj = Images.insert(fsFile);
      console.log('Upload result: ', fileObj);
      Modal.hide('uploadModal');
    }
  });
 
 /**
  *Returns the session variable
  *to the imageModal template so
  *that it can display the correct image.
  */
 Template.imageModal.helpers({
  img: function(){
    return Session.get('imageUrl');
  }
 });
 /*
 Template.Random.helpers({
    image: function () {
      return Images.findOne(); // Where Images is an FS.Collection instance
    },
    img: function(){
      return this;
    }
  });*/
  
  /**
   *Sets the accounts up so you create
   *a username and optionally an
   *email.
   */
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
    /**
     *Sets all the flags for images that
     *allows users to do the respective
     *things to the images.
     */
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
    /**
     *This adds a remove images command
     *that has to be on the server side
     *for it to work.
     */
    return Meteor.methods({

      removeAllImages: function() {

        return Images.remove({});

      }

    });
  });
}
