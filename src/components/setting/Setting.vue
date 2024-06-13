<template>
  <div class="box-main-box" v-show="show_controller" v-divDrag>
    <div slot="header" class="header-class clearfix">
      <span class="box-header-tittle-class">{{ title }}</span>
      <span class="box-close-class" @click="show_controller=false">X</span>
    </div>

    <div class="box-content-class">
      <el-card style="width: 320px;height: 280px">
        <div style="padding: 10px">
          <span>Underground Mode：</span>
          <el-switch v-model="open_collision" active-color="#13ce66" @change="setCollisionDetection"
                     inactive-color="#ff4949"></el-switch>
        </div>
        <el-divider></el-divider>
        <div style="padding: 10px">
          <span>Sunlight Simulation：</span>
          <el-switch v-model="solar_simulation" active-color="#13ce66" @change="setSolarSimulation"
                     inactive-color="#ff4949"></el-switch>
          <div v-show="solar_simulation">
            <el-date-picker
              v-model="timestr"
              class="time-picker-class"
              type="datetime"
              style="width: 195px"
              placeholder="Select date and time" transfer="true" :popper-append-to-body="false" clearable
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-button style="padding: 10px" slot="append" @click="changeClimate">Change</el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <div style="padding: 10px">
          <span>Scene Model Transparency：</span>
          <el-input class="transparency-setting-class" style="width: 30px" @change="changeTranslucency" v-model="model_translucency"
                    placeholder="0-1"></el-input>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
let removeListener;
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      show_controller: false,
      title: "Setting",
      open_collision: false,
      solar_simulation: false,
      model_translucency: 1.0,
      climate_type: "Spring",
      timestr: ""
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
  },
  methods: {
    changeClimate() {
      let newTime = Cesium.JulianDate.fromDate(this.timestr);
     
      console.log(newTime,earth.clock.currentTime)
      earth.clock.currentTime = newTime;
      
      var start = Cesium.JulianDate.addDays(newTime, -0.5, new Cesium.JulianDate()); 
      var stop = Cesium.JulianDate.addDays(newTime, 5, new Cesium.JulianDate()); 
      earth.timeline.zoomTo(start, stop);
    },
    
    setCollisionDetection(checked) {
      let scene = earth.scene;
      let globe = scene.globe;
      console.log("checked", checked)
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
    },
    changeTranslucency(alpha) {
      console.log(alpha)
      ModelListAll.forEach((model, key) => {
        console.log(model.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, parseFloat(alpha)))
      })
    },
    
    setSolarSimulation(checked) {
      this.initEvent(checked);
      earth.shadows = checked;
    },
   
    initEvent(aor) {
      let _sn = 0;
      const updateScene = () => {
        const sd = Cesium.Cartesian3.normalize(earth.scene.sun._boundingVolume.center, new Cesium.Cartesian3);
        const vd = Cesium.Cartesian3.normalize(earth.camera.position, new Cesium.Cartesian3);
        const sn = parseFloat(Cesium.Cartesian3.dot(vd, sd).toFixed(3))
        if (sn === _sn) return false;
        if (sn > 0 || sn == 0) {
          console.log('Day Time');
          earth.scene.globe.showNight = false; 
          earth.scene.light.intensity = 1.0;
        } else {
          console.log('Night Time');
          earth.scene.globe.showNight = true; 
          earth.scene.light.intensity = 0.5;
        }
        _sn = sn;
      }
      if (aor) {
        earth.scene.light = ModelLight.orign
        removeListener = earth.scene.postRender.addEventListener(() => updateScene());
      } else {
        earth.scene.light = ModelLight.static
        removeListener();
      }
    }
  }
}
</script>

<style scoped>
.box-main-box {
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

.transparency-setting-class >>> .el-input__inner {
  padding: 0 !important;
  margin: 0 !important;
}
.time-picker-class >>> .el-input__inner {
  padding: 0 !important;
  margin: 0 !important;
  padding-left: 38px !important;
}
</style>
