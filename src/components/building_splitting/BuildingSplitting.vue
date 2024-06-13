<template>
  <div>
    <div class="box-main-box" v-show="show_controller" v-divDrag>
      <div slot="header" class="header-class clearfix">
        <span class="box-header-tittle-class">{{title}}</span>
        <span class="box-close-class" @click="show_controller=false">X</span>
      </div>
      <el-divider></el-divider>
      <div class="box-content-class tree-tab-content-class">
        <div style="padding: 10px; padding-top: -15px">
          <span>Search：</span>
          <el-input placeholder="" v-model="search_content" class="input-with-select">
            <el-select v-model="search_type" slot="prepend" transfer="true" :popper-append-to-body="false" clearable>
              <el-option label="Party name" :value="select_list[0]"></el-option>
              <el-option label="Apartment id" :value="select_list[1]"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="sendID({type:search_type,content:search_content})"></el-button>
          </el-input>
        </div>
        <div style="padding: 10px; padding-top: -15px">
          <span>Transparency：</span><el-switch v-model="translucency" active-color="#13ce66"  @change="changeTranslucency" inactive-color="#ff4949"></el-switch>
        </div>
        <el-card>
          <div style="width: 280px;margin: 0;padding: 0">
            <div class="tree-tab-class tree-tab-click-class" ref="treeTab1" @click="tipsClick(show_mode_list[0])">{{show_mode_list[0]}}</div>
            <div class="tree-tab-class" ref="treeTab2" @click="tipsClick(show_mode_list[1])">{{show_mode_list[1]}}</div>
          </div>
          <el-tree node-key="id" :default-checked-keys="[1]" :default-expand-all="true" :data="building_levels" show-checkbox @check ="CheckFun" @check-change ="CheckChange"></el-tree>
        </el-card>
      </div>
    </div>
    <SelectInfo></SelectInfo>
  </div>
</template>

<script>
import {addGLTF} from "../../Main/loadGLTF";
import {BuildingMaterial} from "../../Main/BuildingMaterial";
import SelectInfo from "./SelectInfo";
let pickHandler;
let treeTab1;
let treeTab2;
let select_model;
export default {
  name: "BuildingSplitting",
  data() {
    return {
      show_controller:false,
      title:"Multi-owner Apartment",
      pos: AppConfig.pos,
      activeName: 'COMPLEX',
      show_mode_list: AppConfig.show_mode_list,
      building_levels: AppConfig.building_levels,
      select_list:AppConfig.search_type,
      checkedNodes: undefined,
      translucency:false,
      search_type: AppConfig.search_type[0],
      search_content:""
    };
  },
  watch:{
    
    'show_controller'(newAge, oldAge) {
      if (!newAge){
        this.init();
      }
    },
  },
  mounted() {
 
    this.activeName = this.show_mode_list[0]

    this.loadModel();
   
    pickHandler = new Cesium.ScreenSpaceEventHandler(earth.canvas);
   
    treeTab1 = this.$refs.treeTab1;
    treeTab2 = this.$refs.treeTab2;
    
    this.$bus.on("get-use-click-mitt",(clickitem)=>{
      if (clickitem === this.title) {
        this.show_controller = true;
        
        this.modeChangeFun(0);
      }else {
        this.show_controller = false;
        
        this.init();
      }
    });
  
    this.$bus.on("init-HIGHLIGHT-mitt",()=>{
      this.initSecltModel()
    });
   
    this.$bus.on("search-has-result-mitt",()=>{
      this.tipsClick(this.show_mode_list[1])
    });
  },
  methods:{
    changeTranslucency(checked){
      let scene = earth.scene;
      let globe = scene.globe;
      scene.screenSpaceCameraController.enableCollisionDetection = !checked;
      globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
        400.0,
        0.0,
        800.0,
        1.0
      );
      globe.translucency.enabled = checked;
      globe.translucency.frontFaceAlphaByDistance.nearValue = Cesium.Math.clamp(0.3, 0.0, 0.1);
      globe.translucency.frontFaceAlphaByDistance.farValue = 1.0;
      if (checked){
        ModelListAll.forEach((model,key)=>{
          model.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.2)
        })
        earth.camera.flyTo(earth.TranslucencyOBJ);
      }else {
        ModelListAll.forEach((model,key)=>{
          model.color = undefined
         
        })
        earth.camera.flyTo(earth.HomeOBJ);
      }
      this.checkedNodes = undefined;
    },
    init(){
      
      this.modeChangeFun(-1);
     
      this.initSecltModel()
      
      this.sendID("none")
      
      this.checkedNodes = undefined;
     
      treeTab1.classList.add("tree-tab-click-class")
      treeTab2.classList.remove("tree-tab-click-class")
     
      this.removeHandler();
    },
    removeHandler(){
      pickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除事件
    },
    CheckFun(data,checklist){
    
      this.checkedNodes = checklist.checkedNodes
    },
    
    tipsClick(tab) {
      this.activeName = tab;
     
      if (tab === this.show_mode_list[1]){
       
        treeTab1.classList.remove("tree-tab-click-class")
        treeTab2.classList.add("tree-tab-click-class")
       
        this.modeChangeFun(1)
       
        this.pickEntity();
      }else {
       
        treeTab1.classList.add("tree-tab-click-class")
        treeTab2.classList.remove("tree-tab-click-class")
       
        this.modeChangeFun(0)
       
        this.removeHandler()
      }
    },
   
    modeChangeFun(type){
      if (type === -1){
        
        ModelListC.forEach(model=>{
          model.show = false;
        })
        ModelListF.forEach(model=>{
          model.show = false
        })
      
        ModelListAll.get("building").show = true;
        ModelListAll.get("public").show = false;
        ModelListAll.get("out").show = true;
      }
      else if (type === 0) {
        
        ModelListAll.get("building").show = false;
        ModelListAll.get("public").show = false;
        ModelListAll.get("out").show = true;
        
        if (this.checkedNodes === undefined){
        
          ModelListC.forEach(model=>{model.show = true;})
        }else {
          
          ModelListC.forEach((model,key)=>{
            this.checkedNodes.forEach((value)=>{
              if (value.key === key){
                model.show = true;
              }
            })
          })
        }
    
        ModelListF.forEach((model,key)=>{
          model.show = false;
        })
      }
      else {
       
        ModelListAll.get("building").show = false;
        ModelListAll.get("public").show = true;
        ModelListAll.get("out").show = true;

        ModelListC.forEach(model=>{model.show = false;})
 
        if (this.checkedNodes === undefined){
      
          ModelListF.forEach(model=>{model.show = true;})
        }else {
    
          ModelListF.forEach((model,key)=>{
            this.checkedNodes.forEach((value)=>{
              if (value.key === key.split('-')[0]){
                model.show = true;
              }
            })
          })
          ModelListF.get("lift-00").show = true; 
        }
      }
    },
    CheckChange(data,checked) {
      if (this.show_controller){
        if (data.id != 1){
          if (this.activeName === this.show_mode_list[0]){
            ModelListC.get(data.key).show = checked;
          }else {
            ModelListF.forEach((model,key)=>{
              if (key.split('-')[0] === data.key){
                model.show = checked;
              }
            })
          }
        }
      }
    },
    loadModel(){
    
      ModelListAll.set("building",addGLTF(earth,"building", "static/model/building/building.gltf",[this.pos[0],this.pos[1],this.pos[2] + 0.02],true,26,1,false))
      ModelListAll.set("out",addGLTF(earth,"out", "static/model/building/out.gltf",[this.pos[0],this.pos[1],this.pos[2] + 0.02],true,26,1,false))
      ModelListAll.set("public",addGLTF(earth,"public", "static/model/building/public.gltf",[this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26, 1.01,false, "HIGHLIGHT",Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.05)))

      ModelListC.set("top",addGLTF(earth,"top", "static/model/building/top.gltf",this.pos,false,26,1,false))
      ModelListC.set("B2",addGLTF(earth,"B2", "static/model/building/D2.gltf", this.pos,false,26,1,false))
      ModelListC.set("B1",addGLTF(earth,"B1", "static/model/building/D1.gltf", this.pos,false,26,1,false))
      ModelListC.set("1",addGLTF(earth,"1", "static/model/building/1.gltf", this.pos,false,26,1,false))
      ModelListC.set("2",addGLTF(earth,"2", "static/model/building/2.gltf", this.pos,false,26,1,false))
      ModelListC.set("3",addGLTF(earth,"3", "static/model/building/3.gltf", this.pos,false,26,1,false))
      ModelListC.set("4",addGLTF(earth,"4", "static/model/building/4.gltf", this.pos,false,26,1,false))

    
      ModelListF.set("1-Entrance",addGLTF(earth,"1-Entrance", "static/model/building/1-4.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.0],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(232/255,137/255,185/255))));
      ModelListF.set("1-01",addGLTF(earth,"1-01", "static/model/building/1-1.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.0],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(214/255,185/255,98./255))));
      ModelListF.set("1-02",addGLTF(earth,"1-02", "static/model/building/1-2.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.0],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(111/255,175/255,219/255))));
      ModelListF.set("1-03",addGLTF(earth,"1-03", "static/model/building/1-3.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.0],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(195/255,184/255,237/255))));
      ModelListF.set("1-05",addGLTF(earth,"1-05", "static/model/building/1-5.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.0],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(95./255,222/255,142/255))));
      ModelListF.set("2-01",addGLTF(earth,"2-01", "static/model/building/2-1.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.3],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(178/255,144/255,39./255))));
      ModelListF.set("2-02",addGLTF(earth,"2-02", "static/model/building/2-2.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.3],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(72./255,143/255,196/255))));
      ModelListF.set("2-03",addGLTF(earth,"2-03", "static/model/building/2-3.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.3],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(117/255,95./255,210/255))));
      ModelListF.set("2-04",addGLTF(earth,"2-04", "static/model/building/2-4.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.3],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(219/255,80./255,149/255))));
      ModelListF.set("2-05",addGLTF(earth,"2-05", "static/model/building/2-5.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.3],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(36./255,167/255,85./255))));
      ModelListF.set("3-01",addGLTF(earth,"3-01", "static/model/building/3-1.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.6],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(227/255,173/255,10./255))));
      ModelListF.set("3-02",addGLTF(earth,"3-02", "static/model/building/3-2.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.6],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(39./255,103/255,151/255))));
      ModelListF.set("3-03",addGLTF(earth,"3-03", "static/model/building/3-3.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.6],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(62./255,44./255,150/255))));
      ModelListF.set("3-04",addGLTF(earth,"3-04", "static/model/building/3-4.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.6],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(214/255,36./255,126/255))));
      ModelListF.set("3-05",addGLTF(earth,"3-05", "static/model/building/3-5.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.6],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(39./255,144/255,77./255))));
      ModelListF.set("4-01",addGLTF(earth,"4-01", "static/model/building/4-1.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(173/255,81./255,8.0/255))));
      ModelListF.set("4-02",addGLTF(earth,"4-02", "static/model/building/4-2.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(7.0/255,57./255,94./255))));
      ModelListF.set("4-03",addGLTF(earth,"4-03", "static/model/building/4-3.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(30./255,13./255,106/255))));
      ModelListF.set("4-04",addGLTF(earth,"4-04", "static/model/building/4-4.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(232/255,5.0/255,118/255))));
      ModelListF.set("4-05",addGLTF(earth,"4-05", "static/model/building/4-5.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,1.0,true, undefined,undefined,new BuildingMaterial(new Cesium.Cartesian3(13./255,116/255,52./255))));
     
      ModelListF.set("top-00",addGLTF(earth,"top-00", "static/model/building/top.gltf", [this.pos[0],this.pos[1],this.pos[2] + 1.0],false,26,1.0,true, "HIGHLIGHT",Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.2)))
      ModelListF.set("lift-00",addGLTF(earth,"lift-00", "static/model/building/lift.gltf", [this.pos[0],this.pos[1],this.pos[2] + 0.9],false,26,0.95,true, "HIGHLIGHT",Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.2)))
      ModelListF.set("B1-00",addGLTF(earth,"B1-00", "static/model/building/D1.gltf", [this.pos[0],this.pos[1],this.pos[2]],false,26,0.95,true, "HIGHLIGHT",Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.5)))
      ModelListF.set("B2-00",addGLTF(earth,"B2-00", "static/model/building/D2.gltf", [this.pos[0],this.pos[1],this.pos[2]],false,26,0.95,true, "HIGHLIGHT",Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.5)))
    },
    pickEntity(){
      pickHandler.setInputAction((event) => {
        var pick;
        var pickmodels = earth.scene.drillPick(event.position);
        if (pickmodels[0].id === 'public' || pickmodels[0].id === 'out'){
          pick = pickmodels[1];
        }else {
          pick = pickmodels[0];
        }
        if (ModelListF.has(pick.primitive.id)){
          this.sendID({type:'click', content:pick.primitive.id});
          if(!select_model || select_model.id !== pick.primitive.id){
            pick.primitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
            pick.primitive.colorBlendAmount = 0.81;
            pick.primitive.color = Cesium.Color.fromCssColorString("rgba(50,240,20,0.9)");
            this.initSecltModel()
            select_model = pick.primitive;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    initSecltModel(){
      if (select_model){
        select_model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
        select_model.colorBlendAmount = 0.5;
        select_model.color = select_model.OrignColor;
        select_model = undefined;
      }
    },
    sendID(obj){
      this.$bus.emit("change-show-info-mitt",obj);
    }
  },
  components:{
    SelectInfo
  }
}
</script>

<style scoped>
.box-main-box{
  position: absolute;
  top: -450px;
  left: 80px;
  /*background-color: transparent;*/
  background-color: rgb(255, 255, 255);
  width: auto;
  height: auto;
  border-radius: 5px;
  padding-right: 5px;
  z-index: 99999999;
}
.tree-tab-class{
  cursor: pointer;
  margin: -2px;
  display:inline-block;
  width: 121px;
  padding: 10px;
  border: none;
  font-size: 16px;
  background-color: rgba(206, 206, 206, 0.5);
  text-align: center;
}
.tree-tab-click-class, .tree-tab-class:hover, .tree-tab-class:focus{
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.tree-tab-content-class >>> .el-card__body, .el-main {
  padding: 0px;
  padding-bottom: 20px;
 }
.tree-tab-content-class >>>.el-input-group__prepend {
  width: 90px !important;
  padding: 0 !important;
  padding-left: 10px !important;
}
.tree-tab-content-class >>>.el-input__suffix {
  display: none !important;
}
</style>
