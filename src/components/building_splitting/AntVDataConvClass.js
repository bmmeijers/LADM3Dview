
export class AntVDataConvClass{
  constructor(DataByName,DataByRoom) {
    this.nameList = DataByName;
    this.RoomList = DataByRoom;
  }
  
  getPublic(){
    console.log(this.nameList)
    return this.getAntVG6Data(this.nameList.get("Association of owners"))
    
  }
  
  getRoomProp(room_id){
    let roomdata = new Map();
    let roomowner = [];
    console.log(this.RoomList)
    
    if (this.RoomList.has(room_id)){
      this.RoomList.get(room_id).forEach(value=>{
        if (value["LA_RRR_id"]["LA_RightType"] === "Ownership" || value["LA_RRR_id"]["LA_RightType"] === "usufruct"){
          roomowner.push(value["Party_name"])
        }
        roomdata.set(value["Apartment_id"]+value["Party_name"],value);
      })
      roomowner.forEach(name=>{
        this.nameList.get(name).forEach(value=>{
          if (value["Apartment_id"] !== room_id.toString() && !roomdata.has(value["Apartment_id"]+value["Party_name"])){
            roomdata.set(value["Apartment_id"]+value["Party_name"],value);
          }
        })
      })
    }
    return this.getAntVG6Data(roomdata)
  }

  getPeopleProp(name){
    let roomdata = new Map();
   
    let ownerRooms = []; 
    let leaseRooms = []; 
    console.log(this.nameList)
    if (this.nameList.has(name)){
      this.nameList.get(name).forEach(value=>{
        if(this.judgeType(value) === "1"){
       
          ownerRooms.push(value["Apartment_id"]);
        }else {
    
          leaseRooms.push(value["Apartment_id"])
        }
    
        if (!roomdata.has(value["Apartment_id"]+value["Party_name"])){
          roomdata.set(value["Apartment_id"]+value["Party_name"],value);
        }
      })
    }
 
    ownerRooms.forEach(room_id=>{
      if (this.RoomList.has(room_id)){
        this.RoomList.get(room_id).forEach(value=>{
          if (value["Party_name"] !== name){
        
            if (!roomdata.has(value["Apartment_id"]+value["Party_name"])){
              roomdata.set(value["Apartment_id"]+value["Party_name"],value);
            }
          }
        })
      }
    })
   
    leaseRooms.forEach(room_id=>{
      let roomowner = [];
      if (this.RoomList.has(room_id)){
        this.RoomList.get(room_id).forEach(value=>{
         
          if (this.judgeType(value) === "1"){
            roomowner.push(value["Party_name"])
          }
         
          if(value["Party_name"] === name){
            roomdata.set(value["Apartment_id"]+value["Party_name"],value);
          }
        })
        roomowner.forEach(name=>{
          this.nameList.get(name).forEach(value=>{
            if (!roomdata.has(value["Apartment_id"]+value["Party_name"])){
              roomdata.set(value["Apartment_id"]+value["Party_name"],value);
            }
          })
        })
      }
    })
    return this.getAntVG6Data(roomdata)
  }

  getBankProp(bank_name){
    let roomdata = new Map();
    let bankRooms = []; 
    let people = []; 
    if (this.nameList.has(bank_name)){
      this.nameList.get(bank_name).forEach(value=>{
        bankRooms.push(value["Apartment_id"])
        if (!roomdata.has(value["Apartment_id"]+value["Party_name"])){
          roomdata.set(value["Apartment_id"]+value["Party_name"],value);
        }
      })
    }
   
    bankRooms.forEach(room_id=>{
      if (this.RoomList.has(room_id)){
        this.RoomList.get(room_id).forEach(value=>{
          if(this.judgeType(value)){
            people.push(value["Party_name"])
          }
        })
      }
    })
    
    people.forEach(name=>{
      if (this.nameList.has(name)){
        this.nameList.get(name).forEach(value=>{
          if (!roomdata.has(value["Apartment_id"]+value["Party_name"])){
            roomdata.set(value["Apartment_id"]+value["Party_name"],value);
          }
        })
      }
    })
    return this.getAntVG6Data(roomdata)
  }


  formatFun(obj,except) {
    let row = 0;
    let width = 0;
    let str = "";
    Object.keys(obj).forEach((key)=>{
      if (key !== except && key !== "id" && obj[key] !== null) {
        const newL = this.getRealLength(`${key}：${obj[key]}`);
        if (width < newL){
          width = newL;
        }
      row++;
        str += `${key}：${obj[key]}\n`;
      }
    })
    return {label:str.replace(/\n$/, ''), size:[width + 10,row * 15 + 30]}
  }
 
  getRealLength(str) {
    let realLength = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      if ((char >= 0x4e00 && char <= 0x9fff) || (char >= 65 && char <= 90)) {
        realLength += 9; 
      } else {
        realLength += 6; 
      }
    }
    return realLength + 20;
  }

 
  judgeType(value1){
    let onwer = ["Ownership","usufruct"];
  
    let value1Type = value1["LA_RRR_id"]["LA_RestrictionType"] === null?value1["LA_RRR_id"]["LA_RightType"]:value1["LA_RRR_id"]["LA_RestrictionType"];
   
    return onwer.includes(value1Type)?"1":"2";
  }
  judgeType1(value1){
    return value1["Current_Owner"]?"1":"2";
  }

  getAntVG6Data(datalist){
    let LA_Party = new Map;
    let LA_RRR = new Map;
    let LA_BAUnit = new Map;
    let LA_SpatialUnit = new Map;
    let id = 0;
    let data = {
      nodes:[],
      edges:[]
    }
    datalist.forEach(value=>{
 
      let source = "0";
      let target = "1";
 
      const partyid = value["LA_Party_id"]["Party_id"];
      if (LA_Party.has(partyid)){
    
        source = LA_Party.get(partyid);
      }else {
      
        source = id.toString();
        LA_Party.set(partyid,id.toString());
        const format = this.formatFun(value["LA_Party_id"],"Party_id");
    
        data.nodes.push({
          id: id.toString(),
          type: 'customNode', 
          title: "Party_id：" + partyid,
          label: format.label,
          size: format.size,
          color: value["Current_Owner"]?"#82ef78":"#d6fad3"
        })
        id++;
      }
     
      const rrrid = value["LA_RRR_id"]["rID"];
      if (LA_RRR.has(rrrid)){
       
        target = LA_RRR.get(rrrid);
      }else {
     
        target = id.toString();
        LA_RRR.set(rrrid,id.toString());
        const format = this.formatFun(value["LA_RRR_id"],"rID");
      
        data.nodes.push({
          id: id.toString(),
          type: 'customNode', 
          title: "rID：" + rrrid,
          label: format.label,
          size: format.size,
          color: value["Current_Owner"]?"#f1db74":"#faf3d0"
        })
        id++;
      }
   
      data.edges.push({
        source: source,
        target: target,
      })
     
      source = target;
     
      const uid = value["LA_BAUnit_id"]["id"];
      if (LA_BAUnit.has(uid)){
      
        target = LA_BAUnit.get(uid);
      }else {
       
        target = id.toString();
        LA_BAUnit.set(uid,id.toString());
        const format = this.formatFun(value["LA_BAUnit_id"],"uID");
       
        data.nodes.push({
          id: id.toString(),
          type: 'customNode', 
          title: "uID：" + value["LA_BAUnit_id"]["uID"],
          label: format.label,
          size: format.size,
          color: value["Current_Owner"]?"#f1db74":"#faf3d0"
        })
        id++;
      }
      
      data.edges.push({
        source: source,
        target: target,
      })
     
      source = target;
    
      const suid = value["LA_SpatialUnit_Apartment_id"]["suID"];
      const type = this.judgeType(value);
      const isnewowner = this.judgeType1(value)
      if (LA_SpatialUnit.has(suid)){
    
        target = LA_SpatialUnit.get(suid);
      }else {
     
        target = id.toString();
        LA_SpatialUnit.set(suid, id.toString());
        const format = this.formatFun(value["LA_SpatialUnit_Apartment_id"],"suID");
     
        data.nodes.push({
          id: id.toString(),
          type: 'customNode', 
          title: "suID：" + suid,
          label: format.label,
          size: format.size,
          color: "#5dbfee"
        })
        id++;
      }
     
      data.edges.push({
        source: source,
        target: target,
      })
     
      if (value["LA_SpatialUnit_Parkinglot_id"] !== null){
        const suidpark = value["LA_SpatialUnit_Parkinglot_id"]["suID"];
        if (LA_SpatialUnit.has(suidpark)){
         
          target = LA_SpatialUnit.get(suidpark);
        }else {
        
          target = id.toString();
          LA_SpatialUnit.set(suidpark, id.toString());
          const format = this.formatFun(value["LA_SpatialUnit_Parkinglot_id"],"suID");
          
          data.nodes.push({
            id: id.toString(),
            type: 'customNode', 
            title: "suID：" + suidpark,
            label: format.label,
            size: format.size,
            color: "#5dbfee"
          })
          id++;
        }
        
        data.edges.push({
          source: source,
          target: target,
        })
      }
    })
    return data;
  }
}
