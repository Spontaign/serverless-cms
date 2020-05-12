<template>
  <div class="container mt-3"> 
     
    <h3>Add a new Image</h3>
  

    <div class="jumbotron mt-3" v-show="addNewImage">        
        <div v-show="!uploadingImage && !uploadedImage">
          <p class="lead">Select the image to add below:</p>
            <form class="">
                <div class="form-group">
                    <input type="file" @change="onFileChange" ref="fileupload" class="btn btn-light" />
                </div>
            </form>     
        </div>
        <div v-show="uploadingImage && !uploadedImage" class="container">
            <div class="spinner-border" role="status">
              <span class="sr-only">Uploading image...</span>
            </div>
        </div>  
        <div v-show="uploadedImage">
            <h3 class="text-success">Image Uploaded!</h3>
            <img :src="newImagePath" />
            
            <div class="form-group mt-3">
                <label><strong>Enter a Title for this Image:</strong></label>
                <input type="text" v-model="newImageTitle" class="form-control" required />
            </div>
            <div class="form-group">
                <button class="btn btn-primary" @click="saveNewImage">Save Image</button>        
            </div>
            
            <!--button class="btn btn-primary mr-2" @click="resestAddNewImage">Add Another Image</button-->
            
        </div>            

    </div>

    <div class="alert alert-success" v-show="!addNewImage">
      <strong>Success!</strong> Image saved.
      
      <router-link to="/images" tag="button" class="btn btn-sm btn-light mr-2"  exact>Back to Images</router-link>        
      
      <button class="btn btn-sm btn-light" @click="resestAddNewImage">Add Another Image</button>
      
      <p class="mt-3">
        Path to new image: {{imageBase+uploadName}}        
      </p>

    </div>

  </div>
</template>

<script>

import { fileUploadMixin } from '../mixins/fileUploadMixin';
import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [fileUploadMixin,dataAccessMixin],
  name: 'ImageNew',
  data() {
    return {
      entry: {},
      addNewImage:true,
      uploadingImage:false,
      uploadedImage:false,
      changesSaved:false,
      newImagePath:"",
      newImageTitle: "",
      uploadName: "",
      uploadedImagePrefix:  "uploadedImages/"
    };
  }, 
  computed: {
    stageWebBase: {
        get() {
            return this.$store.state.configuration.stageWebBase
        }
    },
    imageBase: {
      get() {
        return this.$store.state.configuration.prodWebBase
      }
    }     
  },  
  created: function () {
    console.log("...in created...");    
    this.eid = "images";
    this.ctype = "images";
    this.getObject(this.eid)
  },  
  methods: {
    onFileChange(e) {

      this.uploadingImage = true

      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
      {
      console.log("No Image!");
      return;             
      }

      let file = files[0]

      let ext = file.name.split('.').pop();

      let fType = file.type;

      if (fType == "image/jpeg" || fType == "image/png" || fType == "image/gif") {
          console.log("Correct Image Type");
      }
      else {
          console.log("Incorrect file type!");    
          console.log("Incorrect file type! Must be an image JPG or PNG!");    
          return
      }
                
      this.uploadName = this.uploadedImagePrefix + this.newUploadId() + "." + ext;                       
      this.getPostPolicy(this.uploadName, {file:file});

    },
    /* when upload has completed, this function returns url to the editor */
    newImageLoaded(path) {

      this.newImagePath = path;      
      this.uploadingImage = false;
      this.uploadedImage = true;

    },  
    saveNewImage() {
      this.addNewImage = false;
      this.entry.images.push({path:this.uploadName,title:this.newImageTitle});
      this.putObject();
    },
    resestAddNewImage() {      
      this.addNewImage = true;
      this.uploadingImage = false;
      this.uploadedImage = false;
      this.changesSaved = false;
      this.newImagePath ="";
      this.newImageTitle = "";
      this.uploadName = "";
    }

  }
}
</script>

<style scoped>
</style>
