<template>
  <div class="none-select-font">
    <toolTips></toolTips>
  </div>
</template>

<script>
import toolTips from "./components/toolTips.vue";
import {getCoorMessage} from "./Main/CoorTools.js";
import {addBox} from "./Main/addBox";
import {ParkingMaterial} from "./Main/ParkingMaterial";
import axios from 'axios';

export default {
  name: "app",
  components: {
    toolTips
  },
  mounted() {
    const loading  = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 1.0)'
    });

    // getCoorMessage(earth,new Cesium.ScreenSpaceEventHandler(earth.canvas));
    window.messagetype = {
      success: this.sendMessageFun("success"),
      warning: this.sendMessageFun("warning"),
      info: this.sendMessageFun("info"),
      error: this.sendMessageFun("error"),
    };

    this.loadApartmentData(loading);
    this.loadLegalInfoList();
    this.setupParkingLocations();
  },
  methods: {
    async loadApartmentData(loading) {
      try {
        console.log("Starting API request to /api/all");
        // const res = await axios.get("http://localhost:4547/api/all");
        const res = await axios.get("/api/all");
        console.log("Received response from /api/all:", res);
        if (res.status === 200 && Array.isArray(res.data.rows)) {
          console.log("Transforming data:", res.data.rows);
          const transformedData = await this.transformData(res.data.rows);
          console.log("Transformed data:", transformedData);
          const relationship_Building = this.categorizeToNameWithMap(transformedData, "Apartment_id");
          const relationship_Name = this.categorizeToNameWithMap(transformedData, "Party_name");
          this.$bus.emit("graph-data-send-ok", [relationship_Building, relationship_Name]);
          setTimeout(() => {
            loading.close();
          }, 3000);
        } else {
          console.error('Unexpected response format or status:', res);
          loading.close();
        }
      } catch (error) {
        console.error('Error loading apartment data:', error);
        loading.close();
      }
    },
    async loadLegalInfoList() {
      try {
        console.log("Starting API request to static/data/legal_info_list.json");
        const res = await axios.get("static/data/legal_info_list.json");
        console.log("Received response from legal_info_list.json:", res);
        res.data.list.forEach((value) => {
          const keys = Object.keys(value);
          const obj = keys.filter(key => key !== "id").map(key => ({ key, value: value[key] }));
          if (value.Status === "Vacant") {
            VacantRooms.set(value.id, "Vacant");
          }
          LegalInfoList.set(value.id, obj);
          IDmap.set((value.hasOwnProperty("Apartment ID") ? value["Apartment ID"] : value["Name"]).toString(), value.id);
        });
      } catch (error) {
        console.error('Error loading legal info list:', error);
      }
    },
    setupParkingLocations() {
      AppConfig.parking_lot_location.forEach(value => {
        ModelListParking.set(value.name, addBox(earth, value.location, [2.5, 4.4, 5], value.name, Cesium.Material.fromType('Color', { color: new Cesium.Color(1.0, 1.0, 1.0, 0.1) })));
      });
    },
    async transformData(data) {
      if (!Array.isArray(data)) {
        throw new TypeError('Expected an array of data');
      }

      const transformed = await Promise.all(data.map(async item => {
        const newItem = { ...item };
        try {
          console.log('Transforming item:', newItem);
          if (newItem["LA_Party_id"]) {
            const partyData = await this.queryPG__MM("LA_Party", newItem["LA_Party_id"]);
            newItem["LA_Party_id"] = partyData.length > 0 ? partyData[0] : null;
          }
          if (newItem["LA_RRR_id"]) {
            const rrrData = await this.queryPG__MM("LA_RRR", newItem["LA_RRR_id"]);
            newItem["LA_RRR_id"] = rrrData.length > 0 ? rrrData[0] : null;
          }
          if (newItem["LA_BAUnit_id"]) {
            const baUnitData = await this.queryPG__MM("LA_BAUnit", newItem["LA_BAUnit_id"]);
            newItem["LA_BAUnit_id"] = baUnitData.length > 0 ? baUnitData[0] : null;
          }
          if (newItem["LA_SpatialUnit_Apartment_id"]) {
            const spatialUnitApartmentData = await this.queryPG__MM("LA_SpatialUnit", newItem["LA_SpatialUnit_Apartment_id"]);
            newItem["LA_SpatialUnit_Apartment_id"] = spatialUnitApartmentData.length > 0 ? spatialUnitApartmentData[0] : null;
          }
          if (newItem["LA_SpatialUnit_Parkinglot_id"] !== null) {
            const spatialUnitParkinglotData = await this.queryPG__MM("LA_SpatialUnit", newItem["LA_SpatialUnit_Parkinglot_id"]);
            newItem["LA_SpatialUnit_Parkinglot_id"] = spatialUnitParkinglotData.length > 0 ? spatialUnitParkinglotData[0] : null;
          }
        } catch (error) {
          console.error('Error transforming item:', newItem, error);
        }
        return newItem;
      }));
      return transformed;
    },
    async queryPG__MM(table, id) {
      console.log(`Starting API request to /api/${table}/${id}.json`);
      try {
        const res = await axios.get(`/api/${table}/${id}.json`);
        console.log(`Received response from /api/${table}/${id}.json:`, res);
        if (res.status === 200) {
          return res.data.rows;
        } else {
          console.error('Unexpected response status:', res.status);
          throw new Error(`Unexpected response status: ${res.status}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    categorizeToNameWithArray(data, key) {
      const categorizedData = {};
      data.forEach(item => {
        const keyValue = item[key];
        if (!categorizedData[keyValue]) {
          categorizedData[keyValue] = [];
        }
        categorizedData[keyValue].push(item);
      });
      return categorizedData;
    },
    categorizeToNameWithMap(data, key) {
      const categorizedData = new Map();
      data.forEach(item => {
        const keyValue = item[key];
        if (!categorizedData.has(keyValue)) {
          categorizedData.set(keyValue, []);
        }
        categorizedData.get(keyValue).push(item);
      });
      return categorizedData;
    },
    sendMessageFun(type) {
      return (message) => {
        this.$notify({
          title: type,
          message: message,
          type: type,
          showClose: false,
          duration: 1000
        });
      };
    },
  }
};
</script>

<style>
</style>
