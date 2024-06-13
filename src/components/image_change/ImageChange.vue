<template>
  <div class="box-main-box" v-show="show_controller" v-divDrag>
    <div slot="header" class="header-class clearfix">
      <span class="box-header-tittle-class">{{title}}</span>
      <span class="box-close-class" @click="show_controller=false">X</span>
    </div>

    <div class="box-content-class">
      <el-card style="width: 200px">
          <el-button style="width: 150px" type="primary" v-for="btn in button_list" :key="btn" size="small" class="image-change-button-class" @click="loadImage(btn)">{{btn}}</el-button>
          <el-button style="width: 150px" type="primary" size="small" class="image-change-button-class" @click="toggleWMS">Kadastralekaart</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
let currentImage = undefined;
let zhuji = undefined;
export default {
  name: "ImageChange",
  components: {
  },
  data() {
    return {
      show_controller:false,
      title:"Basemap",
      button_list:["Arcgis Online","TomTom","OpenStreet"],
      wmsVisible: false, 
    };
  },
  mounted() {
    this.$bus.on("get-use-click-mitt",(clickitem)=>{
      if (clickitem === this.title) {
        this.show_controller = true;
      }else {
        this.show_controller = false;
      }
    });
    currentImage = this.addImage(AppConfig.imageList.OpenStreet);
  },
  methods:{
    loadImage(name){
      if (currentImage != undefined){
        earth.imageryLayers.remove(currentImage);
      }
      if (name === this.button_list[0]){
        currentImage = this.addImage(AppConfig.imageList.ArcgisOnline)
      }else if (name === this.button_list[1]){
        currentImage = this.addImage(AppConfig.imageList.TomTom)
      }else if (name === this.button_list[2]){
        currentImage = this.addImage(AppConfig.imageList.OpenStreet)
      }else if (name === this.button_list[3]){
        //
      }else {

      }
      if (this.wmsVisible) {
        earth.imageryLayers.raiseToTop(zhuji);
      }
      // console.log(earth.imageryLayers)
    },
    addImage(obj){
      if (obj.type === "arcgis"){
        return earth.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider(obj));
      }else if (obj.type === "urltemplate"){
        return earth.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider(obj));
      }else if (obj.type === "wms"){
        return earth.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider(obj));
      } else if (obj.type === "wmts"){
        return earth.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(obj));
      } else {
        return null
      }
    },
    toggleWMS() {
      if (this.wmsVisible) {
        earth.imageryLayers.remove(zhuji);
      } else {
        zhuji = earth.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
          type:"wmts",
          url: 'https://service.pdok.nl/kadaster/kadastralekaart/wmts/v5_0/Kadastralekaart_kwaliteitsvisualisatie/EPSG:3857/{TileMatrix}/{TileCol}/{TileRow}.png',  //数据路径
          layer: 'Kadastralekaart',  
          style: "default", 
          format: "image/png", 
          TileMatrixSet:"EPSG:3857"
        }));
        earth.imageryLayers.raiseToTop(zhuji);
      }
      this.wmsVisible = !this.wmsVisible;
    }
  }
}

</script>

<style scoped>
.box-main-box{
  position: absolute;
  top: -330px;
  left: 80px;
  /*background-color: transparent;*/
  background-color: rgb(255, 255, 255);
  width: auto;
  height: auto;
  border-radius: 5px;
  padding-right: 5px;
  z-index: 99999999;
}
.image-change-button-class{
  font-size: 20px;
  padding: 0;
  margin: 10px;
  margin-bottom: 0px;
  margin-left: 5px;
  width: 90px;
  height: 40px;
}
</style>
