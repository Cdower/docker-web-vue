var apiURL = window.location.origin +'/v2/'

Vue.component('image-item', {
  props: ['imagename'],
  template: '<tr> <td>{{ imagename }}</td> </tr>'
})

Vue.component('image-row', {
  props: ['image'],
  template: `
    <tr> 
      <td v-bind:title="image.clippy"> {{ item.name }} </td>
      <td><button v-for="tag in image.tags">{{tag}}</button>>/td>
      <div v-if="image.showdetail">Secret Sauce</div>
    </tr>
    `
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
        //console.log(data.repositories[repo]);
        $.get( apiURL+data.repositories[repo]+'/tags/list', function( tags ) {
          tags.id = repo;
          tags.clippy = "docker pull "+window.location.origin+'/'+tags.name+':'+tags.tags[0];
          let tag_arr = []
          for( let tag in tags.tags){
	    let tag_obj = { 
              name:       tags.tags[tag],
              showdetail: false
            }
            tag_arr.push(tag_obj);
          }
          console.log(tag_arr);
          tags.showdetail = false;
          tags.tags = tag_arr;
          self.items.push(tags);
          //console.log(tags);
        })
      }
      //self.items = data.repositories;
      //console.log(self.items);
    });

    }
  }
});

//window.location.origin
