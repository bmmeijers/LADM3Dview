<template>
  <div class="box-main-box" v-show="show_controller" v-divDrag>
    <div slot="header" class="header-class clearfix">
      <span class="box-header-tittle-class">{{ title }}</span>
      <span class="box-close-class" @click="show_controller=false">X</span>
    </div>

    <div class="box-content-class">
      <el-card style="width: 300px;">
          <div style="margin-left: -5px; margin-top: -5px; padding: 0; font-size: 15px">Use "Ctrl + wheel" Control clipping Plane</div>
          
          <el-button type="primary" v-for="btn in button_list" :key="btn" size="small" class="split-button-class"
                     @click="clippingFun(btn)">{{ btn }}
          </el-button>
      </el-card>
    </div>
  </div>
</template>

<script>

let clippingPlanes = undefined;

let planeM = [new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(0.0, -1.0, 0.0), new Cesium.Cartesian3(0.0, 0.0, -1.0)];

let clipping_shape = undefined;
let pos = undefined;
let targetY = 25.0;

let clipping_model = undefined;
let handler;

export default {
  name: "Dynamic slicing",
  components: {},
  data() {
    return {
      show_controller: false,
      title: "Dynamic slicing",
      button_list: AppConfig.sectioning_list,
      height: AppConfig.pos[2],
      lng: AppConfig.pos[0],
      lat: AppConfig.pos[1],
      yaw: AppConfig.rotZ,
      url: "static/model/building/building.gltf"
    };
  },
  
  mounted() {
    this.$bus.on("get-use-click-mitt", (clickitem) => {
      if (clickitem === this.title) {
        this.show_controller = true;
      } else {
        this.show_controller = false;
      }
    })
    pos = new Cesium.Cartesian3.fromDegrees(this.lng, this.lat, 0.0);
    
    handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  },
  methods: {
    clippingFun(type) {
      
      this.initClippingOBJ();
      if (type === this.button_list[3]) {
       
        ModelListAll.get("building").show = true;
        ModelListAll.get("out").color = undefined;
       
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.CTRL);
      } else {
        
        ModelListAll.get("building").show = false;
        ModelListAll.get("out").color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, parseFloat(0.3));
        
        if (type === this.button_list[0]) {
          
          targetY = 21;
          this.createClippingPlanes(0);
        } else if (type === this.button_list[1]) {
          targetY = 16;
          this.createClippingPlanes(1);
        } else if (type === this.button_list[2]) {
          targetY = 20;
          this.createClippingPlanes(2);
        }
        this.createClippingPlanesEntity(pos, this.yaw);
        
        clipping_model = this.addGLTF(earth, this.url, [this.lng, this.lat, this.height], this.yaw);
        handler.setInputAction(function(event){
          targetY += event/100;
        }, Cesium.ScreenSpaceEventType.WHEEL, Cesium.KeyboardEventModifier.CTRL);
      }

    },
    // 
    initClippingOBJ() {
      if (clipping_shape !== undefined) {
        earth.entities.remove(clipping_shape);
        clipping_shape = undefined;
      }
      if (clippingPlanes !== undefined) {
        clippingPlanes.destroy();
        clippingPlanes = undefined;
      }
      if (clipping_model !== undefined) {
        // 
        earth.scene.primitives.remove(clipping_model)
        clipping_model = undefined;
      }
    },
    // 
    createClippingPlanes(type) {
      clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [new Cesium.ClippingPlane(planeM[type], 0.0),],
        edgeWidth: 2.0,
        edgeColor: Cesium.Color.WHITE.withAlpha(0.2)
      });
    },
    // 
    createClippingPlanesEntity(position, heading_) {
      var heading = Cesium.Math.toRadians(-26);
      var pitch = 0.0;
      var roll = 0.0;
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr);
      clipping_shape = earth.entities.add({
        position: pos,
        orientation: orientation,
        plane: {
          dimensions: new Cesium.Cartesian2(50.0, 50.0),
          material: Cesium.Color.WHITE.withAlpha(0.2),
          plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(clippingPlanes.get(0)), false),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
        },
      });
      function createPlaneUpdateFunction(plane) {
        return function () {
          plane.distance = targetY;
          return plane;
        };
      }
    },
    //
    addGLTF(viewer, url, position, rotationz) {
      var origin = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
      var modelPrimitive = null;
      modelPrimitive = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url: url,
        modelMatrix: modelMatrix,
        show: true, // default
        scale: 1, // double size
        // minimumPixelSize : 128,          // never smaller than 128 pixels
        maximumScale: 20000, // never larger than 20000 * model size (overrides minimumPixelSize)
        allowPicking: true,
        scene: viewer.scene,
        // customShader: new BaiMoMaterial(),
        clippingPlanes: clippingPlanes,//设置模型切面
      }));
      modelPrimitive.type = "clippingModel"
      if (rotationz) {
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationz));
        //
        Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(mz), modelMatrix);
        modelPrimitive.modelMatrix = modelMatrix
      }

      return modelPrimitive;
    },
  },
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
.box-content-class >>> .el-input__inner {
  padding: 0 !important;
  margin: 0 !important;
}
.split-button-class{
  font-size: 20px;
  padding: 0;
  margin: 10px;
  margin-bottom: 0px;
  margin-left: 10px;
  width: 105px;
  height: 40px;
}
</style>
