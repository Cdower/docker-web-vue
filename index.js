var registryURL = window.location.origin

Vue.component('image-item', {
  props: ['imagename'],
  template: '<tr> <td>{{ imagename }}</td> </tr>'
})

Vue.component('image-row', {
  props: ['image'],
  methods:{
    imagebutontoggle: function(tag) {
      var self = this;
      let visible = !tag.showdetail;
      for(tag_ittr in self.image.tags){
        self.image.tags[tag_ittr].showdetail=false;
      }
      self.image.showdetail=visible;
      tag.showdetail=visible;
      console.log(self.image.name);
    }
  },
  template: `
    <tr> 
      <td v-if="!image.showdetail" v-bind:title="image.clippy"> {{ image.name }} </td>
      <td v-for='tag in image.tags' v-if='tag.showdetail'> {{ tag.name }} </td>
      <td><button v-for="tag in image.tags" v-on:click='imagebutontoggle(tag)' >{{tag.name}}</button></td>
    </tr>
    `
})

Vue.component('image-table', {
  props: ['images'],
  template: `
  <table id='image-table'>
    <thead>
      <tr>
        <th>Image Name</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>
      <image-row
        v-for='image in images'
        v-bind:image='image'
        v-bind:key='image.id' >
      </image-row>
    </tbody>
  </table> 
  `
})

var images = new Vue({ 
  el: '#images',
  data: {
    items: [],
    apiURL: registryURL +'/v2/'
  },
  created: function () {
    this.fetchData();
  },

  methods: {
    fetchData: function () {
    var self = this;
    $.get( self.apiURL+'_catalog', function( data ) {
      for(let repo in data.repositories){
        $.get( self.apiURL+data.repositories[repo]+'/tags/list', function( tags ) {
          tags.id = repo;
          tags.clippy = "docker pull "+registryURL+'/'+tags.name+':'+tags.tags[0];
          let tag_arr = []
          for( let tag in tags.tags){
	    let tag_obj = { 
              name:       tags.tags[tag],
              showdetail: false
            }
            tag_arr.push(tag_obj);
          }
          tags.showdetail = false;
          tags.tags = tag_arr;
          self.items.push(tags);
        })
      }
    });

    },
    imagebutontoggle: function () {
      var self = this;
      console.log(self.items);
    }
  }
});
