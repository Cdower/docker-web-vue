var apiURL = window.location.origin +'/v2/'

Vue.component('image-item', {
  props: ['imagename'],
  template: '<tr> <td>{{ imagename }}</td> </tr>'
})

var images = new Vue({ 
  el: '#images',
  data: {
    items: null
  },
  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function () {
    var self = this;
    $.get( apiURL+'_catalog', function( data ) {
      for(var repo in data.repositories){
        $.get( apiURL+repo+'/tags/list', function( tags ) {
          //self.items.push(tags);
          console.log(tags);
        }
      }
      self.items = data.repositories;
      console.log(self.items);
    });

    }

  }
});

//window.location.origin
