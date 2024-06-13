<template>
  <div class="main-box">

    <div class="infobox-search-class" v-show="search_info_show" v-divDrag>
      <div slot="header" style="" class="header-class clearfix">
        <span class="box-close-class" @click="search_info_show=false">X</span>
      </div>
      <el-card>
        <el-table height="180px" :data="search_data" :show-header="false" empty-text="none">
          <el-table-column prop="key" label="key" header-align="center" width="150px"></el-table-column>
          <el-table-column prop="value" label="value"></el-table-column>
          <el-table-column label="setting" width="110">
            <template slot-scope="scope">
              <el-button size="mini" @click="queryRoomDetail(scope.$index, scope.row)">FlyTo</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="info-box-main-box" v-show="show_controller">
      <el-card style="display: inline-block;width: 25%;height: 350px">
        <el-table height="285px" :data="owner_other_rooms" :show-header="false" empty-text="none">
          <el-table-column prop="key" label="key"></el-table-column>
          <el-table-column prop="value" label="value"></el-table-column>
          <el-table-column label="setting" width="90">
            <template slot-scope="scope">
              <el-button size="mini" @click="changeDataInit({type:'others', content:scope.row.value})">FlyTo</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button v-show="back_btn_show" style="width: auto;float: right;margin-top: 5px;margin-bottom: 5px" type="warning" @click="room_infor_show=true">back</el-button>
      </el-card>
       <el-card style="display: inline-block;width: 24%;height: 350px">
    Current:
    <el-table max-height="300px" :data="current_owner" :show-header="true" empty-text="Vacant">
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="type" label="type"></el-table-column>
      <el-table-column label="setting" width="115">
        <template slot-scope="scope">
          <el-button size="mini" @click="checkData(scope.$index, scope.row)">All properties</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 0;padding: 0;margin-bottom: 5px" v-show="old_owner_show">
      Previous:
      <el-table max-height="105px" :data="old_owner" :show-header="true" empty-text="none">
        <el-table-column prop="name" label="name"></el-table-column>
        <el-table-column prop="type" label="type"></el-table-column>
        <el-table-column label="setting" width="115">
          <template slot-scope="scope">
            <el-button size="mini" @click="checkData(scope.$index, scope.row)">All properties</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 60px;background-color: transparent"></div>
        <el-button v-show="parking_lot_btn_show" style="width: auto;position: absolute;bottom: 17px;left: 505px;" type="primary" @click="FlyToParkingLot">
          view parking lot
        </el-button>
        <el-button style="width: auto;position: absolute;bottom: 17px;left: 855px;" type="danger" @click="show_controller=false">
          close
        </el-button>
      </el-card>

      <el-card class="building-info-class" v-show="room_infor_show">
        Property information:
        <el-table max-height="305px" :data="table_data" :show-header="false" empty-text="none">
          <el-table-column prop="key" label="key"></el-table-column>
          <el-table-column prop="value" label="value"></el-table-column>
        </el-table>

      </el-card>
      <el-card style="display: inline-block;width: 50%;">
        <div id="LadmGraphBox"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {LadmGraph} from "./LadmGraph";
import {AntVDataConvClass} from "./AntVDataConvClass";
let myGraph = undefined;
let G6Data = undefined;
let relationship_Building = new Map();
let relationship_Name = new Map();
export default {
  name: "SelectInfo",
  components: {},
  data() {
    return {
      show_controller: true,
      search_info_show: false,
      room_infor_show:false,
      old_owner_show: false,
      parking_lot_btn_show:false,
      back_btn_show: true,
      activeName: 'BASE',
      tab_list: ["BASE", "RELATIONSHIP"],
      btn_list: ["query other buildings", "query parking space"],
      table_data: [],
      old_owner: [],
      current_owner:[],
      owner_other_rooms:[],
      search_data:[],
    };
  },
  watch: {
  
    'show_controller'(newAge, oldAge) {
      if (!newAge) {
   
        this.$bus.emit("init-HIGHLIGHT-mitt", {});
      }
    },
  },
  mounted() {
    this.$bus.on("change-show-info-mitt", (input) => {
      if (input !== "none") {
        this.changeDataInit(input);
      } else {
        this.show_controller = false;
      }
    });
    this.$bus.on("graph-data-send-ok", ([BuildingList,NameList])=>{
      this.show_controller = false;
      myGraph = new LadmGraph("LadmGraphBox");
      relationship_Building = BuildingList;
      relationship_Name = NameList;
      G6Data = new AntVDataConvClass(NameList,BuildingList);
    });
  },
  methods: {

    changeDataInit(input){
    
      let idkey = undefined;
      let changetype = "click";
      let id = undefined;
      this.back_btn_show = true;
     
      if (input.type === "click"){
        id = input.content;
        changetype = input.type
      }else {
        idkey = input.content;
        changetype = input.type
      }
      //**************************************
     
      if (changetype === "click"){
        if (id === "top-00"){
          idkey = "Roof";
        }else if(id === "lift-00"){
          idkey = "Lift"
        } else if(id === "B1-00"){
          idkey = "B1";
        }else if(id === "B2-00"){
          idkey = "B2";
        }else if(id === "1-Entrance"){
          idkey = "Entrance";
        }else if(id.includes('-')){
          idkey = id.replace(/-/g, '');
        }else {
          idkey = undefined;
        }
      }else if (changetype === AppConfig.search_type[0] && !relationship_Name.has(idkey)){
          idkey = undefined;
      }else if (changetype === AppConfig.search_type[1] && !relationship_Building.has(idkey)){
          idkey = undefined;
      }
      //************************************************
    
      if(idkey !== undefined){
      
        if (changetype === "click"){
          //**************************************
          
          this.show_controller = true;
          this.room_infor_show = true;
          this.search_info_show = false;
         
          this.table_data = LegalInfoList.get(id);
         
          this.updataPeople(idkey);
         
          this.updateRoomColor({parkingID:relationship_Building.has(idkey)?relationship_Building.get(idkey)[0].LA_SpatialUnit_Parkinglot_id:null,roomID:id},false)
        }else {
          if (changetype === AppConfig.search_type[0]){
           
            this.search_info_show = true;
          
            this.search_data=[];
            relationship_Name.get(idkey).forEach(value=>{
              this.search_data.push({
                key:"Apartment id",
                value:value["Apartment_id"]
              })
            })
          }
          else if (changetype === AppConfig.search_type[1]){
           
            this.$bus.emit("search-has-result-mitt",true);
        
            this.show_controller = true;
            this.room_infor_show = true;
            this.search_info_show = false;
        
            const room_id = IDmap.get(idkey);
            this.table_data = LegalInfoList.get(room_id);
           
            this.updataPeople(idkey);
       
            this.updateRoomColor({parkingID:relationship_Building.get(idkey)[0].LA_SpatialUnit_Parkinglot_id,roomID:room_id},true)
          }
          else if (changetype === "others") {
            
            this.back_btn_show = false;
            this.show_controller = true;
           
            const room_id = IDmap.get(idkey);
            this.table_data = LegalInfoList.get(room_id);
            
            this.updataPeople(idkey);
            
            this.updateRoomColor({parkingID:relationship_Building.get(idkey)[0].LA_SpatialUnit_Parkinglot_id,roomID:room_id},true)
          }
        }
        if (!VacantRooms.has(IDmap.get(idkey)))
        {
          
          if (relationship_Name.has(idkey)){
            if (relationship_Name.get(idkey)[0]["LA_RRR_id"]["LA_RestrictionType"] !== null){
              myGraph.updateGraph(G6Data.getBankProp(idkey));
            }else if (relationship_Name.get(idkey)[0]["Party_name"] === "Association of owners"){
              myGraph.updateGraph(G6Data.getPublic());
            }else{
              myGraph.updateGraph(G6Data.getPeopleProp(idkey));
            }
          }else {
            if (relationship_Building.get(idkey)[0]["Party_name"] === "Association of owners"){
              myGraph.updateGraph(G6Data.getPublic());
            }else {
              myGraph.updateGraph(G6Data.getRoomProp(idkey));
            }
          }
        }
        else {
          myGraph.updateGraph({nodes: [], edges: []});
        }
      }else {
        
        this.search_info_show = false;
        messagetype.info("There is currently no information available!")
      }
    },
    updateRoomColor(obj,bool){
      if (bool){
        
        ModelListF.forEach((value,key)=>{
          if (key === obj.roomID){
            value.colorBlendMode = Cesium.ColorBlendMode.MIX;
            value.colorBlendAmount = 0.9;
            value.color = Cesium.Color.fromCssColorString("rgba(25.5,127.5,204,0.8)");
          }else {
            value.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT;
            value.colorBlendAmount = 0.5;
            value.color = value.OrignColor;
          }
        })
      
        this.FlyTo(obj.roomID)
      }
      
        ModelListParking.forEach((value,key)=>{
          if (obj.parkingID !== null){
            if (key === obj.parkingID["suID"]){
              value.appearance.material = Cesium.Material.fromType('Color',{color: new Cesium.Color(0.1,0.5,0.8,0.8)});
            }else {
              value.appearance.material = Cesium.Material.fromType('Color',{color: new Cesium.Color(1.0,1.0,1.0,0.1)});
            }
          }else {
            value.appearance.material = Cesium.Material.fromType('Color',{color: new Cesium.Color(1.0,1.0,1.0,0.1)});
          }
        })

    },
    updataPeople(idkey){
      this.current_owner = [];
      this.old_owner = [];
      this.parking_lot_btn_show = false;
      if (relationship_Building.has(idkey)){
        relationship_Building.get(idkey).forEach(value=>{
          if (value["Current_Owner"]){
          
            this.current_owner.push({
              name: value["Party_name"],
              type: value["LA_RRR_id"]["LA_RightType"]?value["LA_RRR_id"]["LA_RightType"]:value["LA_RRR_id"]["LA_RestrictionType"]
            })
          }else {
           
            this.old_owner.push({
              name: value["Party_name"],
              type: value["LA_RRR_id"]["LA_RightType"]?value["LA_RRR_id"]["LA_RightType"]:value["LA_RRR_id"]["LA_RestrictionType"]
            })
          }
          
          if (value["LA_SpatialUnit_Parkinglot_id"] !== null){
            this.parking_lot_btn_show = true;
          }
        })
      }
      this.old_owner_show = (this.old_owner.length !== 0);
    },
    queryRoomDetail(index, row){
      this.$bus.emit("search-has-result-mitt",true);
      this.changeDataInit({type:AppConfig.search_type[1],content:row.value})
    },
    checkData(index, row) {
      this.owner_other_rooms = [];
   
      console.log(relationship_Name)
      console.log(relationship_Name.has(row.name))
      if (relationship_Name.has(row.name)){
        this.room_infor_show = false;
     
        relationship_Name.get(row.name).forEach(value=>{
          this.owner_other_rooms.push({
            key:"Apartment id",
            value:value["Apartment_id"]
          })
        })
      }
    },
    FlyTo(row){
      const room = AppConfig.flyRoomOrParkinglot["Room"+row.substr(-1)]
      if (room !== undefined && room !== undefined){
        earth.camera.flyTo({destination: new Cesium.Cartesian3.fromDegrees(room.HLH[0],room.HLH[1],room.HLH[2]),
          orientation: {
            heading: room.heading,
            pitch: room.pitch,
            roll: room.roll,
          }});
      }else {
        earth.camera.flyTo(earth.HomeOBJ);
      }
    },
    FlyToParkingLot(){
      const room = AppConfig.flyRoomOrParkinglot["Parkinglot"]
      earth.camera.flyTo({destination: new Cesium.Cartesian3.fromDegrees(room.HLH[0],room.HLH[1],room.HLH[2]),
        orientation: {
          heading: room.heading,
          pitch: room.pitch,
          roll: room.roll,
        }});
    }
  }
}
</script>

<style scoped>

.box-content-class >>> .el-input__inner {
  padding: 0 !important;
  margin: 0 !important;
}
#LadmGraphBox{
  background-color: #ffffff;
  width: 100%;
  height: 328px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid black;
  border-radius: 5px;
}
#LadmGraphBox:hover {
  cursor: grab !important;
}

#LadmGraphBox:active {
  cursor: grabbing !important;
}

.info-box-main-box {
  position: fixed;
  bottom: 30px;
  left: 0px;
  background-color: rgb(255, 255, 255, 1.0);
  width: 100%;
  height: 360px;
  border-radius: 5px;
  padding-right: 5px;
}
.infobox-search-class{
  position: fixed;
  top: -5px;
  right: 0px;
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 10px;
  width: 350px;
  height: auto;
  background-color: white;
  border-radius: 5px;
  z-index: 99999999;
}

.infobox-content-class {
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 10px;
  width: 100%;
  height: 300px;
  background-color: transparent;
  /*background-color: rgb(255,251,240);*/
  border-radius: 5px;
}


.infobox-content-class >>> .el-table_1_column_1 {
  font-weight: bold;
}


.infobox-content-class >>> .el-table_1_column_2 {
  font-weight: normal;
}

.building-info-class {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 25%;
  height: 350px;
}
</style>
