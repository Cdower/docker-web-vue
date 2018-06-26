var registryURL = window.location.origin

Vue.component('image-item', {
  props: ['imagename'],
  template: '<tr> <td>{{ imagename }}</td> </tr>'
})

//To delete tag send:
//GET /v2/<image.name>/manifests/<tag.name> | grep Docker-Content-Digest | awk '{print ($3)}
//FOR $Docker-Content-Digest DELETE /v2/<image.name>/manifests/$Docker-Content-Digest

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
    <tr id='image-row'> 
      <td v-if="!image.showdetail" v-bind:title="image.clippy"> {{ image.name }} </td>
      <td v-for='tag in image.tags' v-if='tag.showdetail'> {{ tag.name }} </td>
      <td><button v-for="tag in image.tags" v-clipboard:copy='image.clippy+tag.name'  v-on:click='imagebutontoggle(tag)' >{{tag.name}}</button></td>
    </tr>
    `
})

Vue.component('image-table', {
  props: ['images'],
  template: `
  <table id='image-table'>
    <thead>
      <tr id='image-header'>
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
          tags.clippy = "docker pull "+registryURL+'/'+tags.name+':';
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
