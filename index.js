var apiURL = window.location.origin +'/v2/'

Vue.component('image-item', {
  props: ['imagename'],
  template: '<tr> <td>{{ imagename }}</td> </tr>'
})

var images = new Vue({ 
  el: '#images',
  data: {
    items: []
  },
  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function () {
    var self = this;
    $.get( apiURL+'_catalog', function( data ) {
      for(var repo in data.repositories){
        console.log(data.repositories[repo]);
        $.get( apiURL+data.repositories[repo]+'/tags/list', function( tags ) {
          tags.clippy = "docker pull "+window.location.origin+'/'+tags.name+':'+tags.tags[0];
          self.items.push(tags);
          console.log(tags);
        })
      }
      //self.items = data.repositories;
      console.log(self.items);
    });

    }
  }
});

//window.location.origin
