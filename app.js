var router
var Router
var placesList

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};




// $.ajaxPrefilter( function(options, originalOptions, jqXHR){
//   options.url = '//localhost:3000' +options.url;
// });

var Places = Backbone.Collection.extend({
  url:'http://localhost:3000/places'
})

var Place = Backbone.Model.extend({
  urlRoot:'http://localhost:3000/places'
})

var CreatePlace = Backbone.View.extend({
  el: '#location-list',
  render: function(){
    var template = _.template($('#new-place').html())
    this.$el.html(template)
    Gmap.assignAutoComplete();
  },
  events:{
    'submit #new-place-form' : 'savePlace'
  },
  savePlace: function(event){
    var placeDetails = $(event.currentTarget).serializeObject();
    console.log(placeDetails)
    var place = new Place();
    place.save(placeDetails, {
      success: function(place){
        router.navigate('',{trigger: true})
      }
    })
    return false
  },

})


var EditPlace = Backbone.View.extend({
  el: '#location-list',
  render: function(options){
    this.place = new Place({id: options.id})
    var that = this;
    this.place.fetch({
      success: function(place){
        var location = new google.maps.LatLng(place.get('lat'), place.get('lng'))
        var edit_template = _.template($('#edit-place').html(), {place: place})
        that.$el.html(edit_template)
        Gmap.clearMarkers();
        Gmap.addPlaceMarker(location) 
        Gmap.assignAutoComplete();
       
      }
    })
  },
  events: {
    'submit #edit-place-form' : 'savePlace',
    'click .delete': 'deletePlace'
  },
  savePlace: function(event){
    var placeDetails = $(event.currentTarget).serializeObject();
    console.log(placeDetails)
    var place = new Place();
    place.save(placeDetails, {
      success: function(place){
        router.navigate('',{trigger: true})
      }
    })
    return false
  },
  deletePlace: function(){
    this.place.destroy({
      success: function(){
        Gmap.clearMarkers()
        router.navigate('',{trigger: true})  
      }
    })
  }
})

var PlacesList = Backbone.View.extend({
  el: '#location-list',
  render: function(){
    console.log("in render")
    var that= this;
    var places = new Places();
    places.fetch({
      success: function(places){
        var template = _.template($('#places-list').html(), {places: places.models})
        that.$el.html(template)
      } 
    })
  },
  events: {
    'click .place' : 'displayPlaceMarker',
    'click #all-markers': 'displayAllMarkers',
  },
  displayPlaceMarker: function(event){
    var place = new Place({id: event.currentTarget.id})
    place.fetch({
      success: function(place){
        var location = new google.maps.LatLng(place.get('lat'), place.get('lng'))
        Gmap.clearMarkers();
        Gmap.addPlaceMarker(location)      
      } 
    })
  },
  displayAllMarkers: function(){
    var places = new Places();
    places.fetch({
      success: function(places){
        Gmap.clearMarkers()
        places.forEach(function(place){
          var location = new google.maps.LatLng(place.get('lat'), place.get('lng'))
          Gmap.addPlaceMarker(location)
        })
        Gmap.setAllBounds();

      }
    })
  }
})




var Home = Backbone.View.extend({
  el: '#location-list',
  render: function(){
    var template = _.template($('#home-controls').html())
    this.$el.html(template)
  }
})



$(function(){


  Router = Backbone.Router.extend({
    routes:{
      '': 'places',
      'places/edit/:id': 'editPlace',
      'places/new' : 'createPlace'
  }
});

  var home = new Home();
  var placesList = new PlacesList();
  var editPlace = new EditPlace();
  var createPlace = new CreatePlace();


  router = new Router();

  router.on('route:places', function(){
    console.log("in places")
    placesList.render()
  });

  router.on('route:editPlace',function(id){
    editPlace.render({id: id})
  })
  
  router.on('route:createPlace', function(){
    createPlace.render()
  })
  Gmap.initialize();
  Backbone.history.start();
});












// var PlaceMarker = Backbone.View.extend({
//   el: '#map-canvas',
//   render : function(options){
//     var place = new Place({id: options.id})
//     place.fetch({
//       success: function(place){
//         var location = new google.maps.LatLng(place.get('lat'), place.get('lng'))
//         var template = _.template($('#info-window').html(), {place: place})
//         Gmap.clearMarkers();
//         Gmap.addPlaceMarker(location,template)      
//       } 
//     })
//   },
//   events: {
//     'click .update': 'updatePlace'
//   },

//   updatePlace: function(){
//     console.log("updating Place")
//   }

