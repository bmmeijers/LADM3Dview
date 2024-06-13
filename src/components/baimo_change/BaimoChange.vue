<template>
  <div class="box-main-box" v-show="show_controller" v-divDrag>
    <div slot="header" class="header-class clearfix">
      <span class="box-header-tittle-class">{{title}}</span>
      <span class="box-close-class" @click="show_controller=false">X</span>
    </div>

    <div class="box-content-class">
      <el-card style="width: 200px">
          <el-button type="primary" v-for="btn in button_list" :key="btn" size="medium" class="baimo-button-class" @click="showBaimo(btn)">{{btn}}</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import {addGLTF} from "../../Main/loadGLTF.js"
export default {
  name: "BaimoChange",
  components: {
  },
  data() {
    return {
      show_controller:false,
      title:"LOD",
      button_list:["Adaptive LOD","LOD1.2","LOD1.3","LOD2.2"]
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
    BaimolList.set("LOD1.2",addGLTF(earth,"LOD12","static/model/newbaimoLOD12.gltf",[4.240468,52.06919,0.0],false,1));
    BaimolList.set("LOD1.3",addGLTF(earth,"LOD13","static/model/newbaimoLOD13.gltf",[4.240468,52.06919,0.0],false,1));
    BaimolList.set("LOD2.2",addGLTF(earth,"LOD22","static/model/newbaimoLOD22.gltf",[4.240468,52.06919,0.0],true,1));
    BaimolList.set("Adaptive LOD",addGLTF(earth,"all","static/model/newbaimoLODAll.glb",[4.240468,52.06919,-0.05],false,1));
  },
  methods:{
    showBaimo(name){
      BaimolList.forEach((lod,key)=>{
        if (key === name){
          lod.show = true;
        }else {
          lod.show = false;
        }
      })
    },
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
.baimo-button-class{
  font-size: 20px;
  padding: 0;
  margin: 10px;
  margin-bottom: 0px;
  margin-left: 10px;
  width: 150px;
  height: 40px;
}
</style>
