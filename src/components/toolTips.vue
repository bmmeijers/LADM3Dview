<template>
  <div class="right-tooltips-class">
    <div class="tools-container">
      <div class="tools-buttons">
        <el-tooltip v-for="tip in tooltips" :key="tip.key" class="tooltips-item" effect="dark" :content="tip.label"
                    placement="left">
          <el-button size="small" style="font-size: 20px;" :class="tip.class" @click="clickRun(tip.label)"></el-button>
        </el-tooltip>
      </div>
      <div class="tools-detail-box">
        <BuildingSplitting></BuildingSplitting>
        <ImageChange></ImageChange>
        <BaimoChange></BaimoChange>
        <SectioningAnalysis></SectioningAnalysis>
        <Setting></Setting>
      </div>
    </div>
  </div>
</template>

<script>
import BuildingSplitting from "./building_splitting/BuildingSplitting.vue"
import ImageChange from "./image_change/ImageChange.vue"
import BaimoChange from "./baimo_change/BaimoChange.vue"
import SectioningAnalysis from "./sectioning_analysis/SectioningAnalysis.vue";
import Setting from "./setting/Setting.vue"

export default {
  name: "",
  components: {
    BuildingSplitting,
    ImageChange,
    BaimoChange,
    SectioningAnalysis,
    Setting
  },
  data() {
    return {
      tooltips: AppConfig.tooltips,
    };
  },
  methods: {
    clickRun(clickitem) {
      if (clickitem === "HomeView") {
        earth.camera.flyTo(earth.HomeOBJ);
      } else {
        this.$bus.emit("get-use-click-mitt", clickitem)
      }
    },
  },
};
</script>

<style scoped>
.tooltips-item {
  margin: 4px;
}

.tools-detail-box {
  position: relative;
}
</style>

