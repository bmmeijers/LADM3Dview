const BASE_URL_MODEL = "http://localhost:8012/";
const AppConfig = {
  tooltips: [
    {
      key: "HomeView",
      label: "HomeView",
      class: "el-icon-house",
    },
    {
      key: "ImageChange",
      label: "Basemap",
      class: "el-icon-picture",
    },
    {
      key: "BaimoChange",
      label: "LOD",
      class: "el-icon-finished",
    },
    {
      key: "BuildingSplitting",
      label: "Multi-owner Apartment",
      class: "el-icon-office-building",
    },
    {
      key: "SectioningAnalysis",
      label: "Dynamic slicing",
      class: "el-icon-c-scale-to-original",
    },
    {
      key: "Setting",
      label: "Setting",
      class: "el-icon-s-tools",
    }
  ],
  search_type:["Party_name","Apartment_id"],
  image_list:["Arcgis Online","TomTom","OpenStreet","PDOK"],
  sectioning_list:["Front view", "Side view", "Top view", "Clean"],
  building_levels: [{
    id:1, key: 'ALL', label: 'ALL', children:[
      {id:8, key: 'top', label: 'Roof'},
      {id:7, key: '4', label: '3'},
      {id:6, key: '3', label: '2'},
      {id:5, key: '2', label: '1'},
      {id:4, key: '1', label: '0'},
      {id:3, key: 'B1', label: 'B1'},
      {id:2, key: 'B2', label: 'B2'},
    ]
  }],
  show_mode_list:["BUILDING","LEGAL"],
  imageList:{
    ArcgisOnline:{
      type:"arcgis",
      url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    },
    TomTom:{
      type:"urltemplate",
      url:"https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=tAVCPMFZzha85zzQbJiBsOYENGGT58Lo"
    },
    OpenStreet:{
      type:"urltemplate",
      url: "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    },
    
  },
  parking_lot_location:[
    {
      id: 1,
      name:"010005",
      location: [4.239669715751084,52.068604929033405,0],
    },
    {
      id: 2,
      name:"010011",
      location: [4.239635611727903,52.068594601298350,0],
    },
    {
      id: 3,
      name:"010013",
      location: [4.239575422611239,52.068576265228600,0],
    },
    {
      id: 4,
      name:"010015",
      location: [4.239541195643507,52.068566346201610,0],
    },
    {
      id: 5,
      name:"010017",
      location: [4.239506900106183,52.068556185408830,0],
    },
    {
      id: 6,
      name:"010019",
      location: [4.239472823866629,52.068545929919814,0],
    },
    {
      id: 7,
      name:"010021",
      location: [4.239412827834927,52.068527603708695,0],
    },
    {
      id: 8,
      name:"010023",
      location: [4.23937872831444,52.0685174294012300,0],
    },
    {
      id: 9,
      name:"010025",
      location: [4.239344316621323,52.068507157905515,0],
    },
    {
      id: 10,
      name:"010028",
      location: [4.23931009907933,52.0684970964629840,0],
    },
    {
      id: 11,
      name:"010030",
      location: [4.239483211809999,52.068639114238636,0],
    },
    {
      id: 12,
      name:"010032",
      location: [4.239449001755944,52.068628979901240,0],
    },
    {
      id: 13,
      name:"010034",
      location: [4.239397546384297,52.068613587800190,0],
    },
    {
      id: 14,
      name:"Vacant",
      location: [4.239363695029711,52.068603332838750,0],
    }
  ],
  pos: [4.239724155659562,52.06886651664621,0],
  rotZ: 26,
  cameraP: {
    heading: 1.8193692899166578,
    pitch: -0.38949288501131796,
    roll: 0.00000264873661670606,
    lng: 4.238407379622978,
    lat: 52.06899478486668,
    h: 32.53587708767368,
  },
  TranslucencyP: {
    heading: 0.29632929269516506,
    pitch: 0.02893956082800364,
    roll: 0.0000010529219203192497,
    lng: 4.239208850306429,
    lat: 52.06819929268817,
    h: 0.6266776703432,
  },
  flyRoomOrParkinglot:{
    Parkinglot:{
      HLH:[4.239735442831695,52.06817130707202,44.736422917436215],
      heading: 5.8427185572763225,
      pitch: -0.8250306235649605,
      roll: 4.747998652021579e-7
    },
    Room1:{
      HLH:[4.240711358978873,52.06914942470274,31.272412536524513],
      heading: 4.298634629848463 ,
      pitch: -0.4214208592197344 ,
      roll: 4.850449606408347e-7
    },
    Room2:{
      HLH:[4.240212220447894,52.06826574728575,31.550226949933396],
      heading: 5.822708400315896 ,pitch: -0.4602017623670065 ,roll: 6.283184632435309
    },
    Room3:{
      HLH:[4.2386965713769795,52.06848198637013,31.722832561649966],
      heading: 1.0694156693097447 ,pitch: -0.46020184092698013 ,roll: 6.2831849384927665
    },
    Room4:{
      HLH:[4.238607928651648,52.06917319492282,30.3782454122352],
      heading: 1.965257011667095 ,pitch: -0.4363367522718855 ,roll: 2.4271841869705213e-7
    },
    Room5:{
      HLH:[4.239727379916734,52.06959558837296,30.004027928353583],
      heading: 3.291345056768166 ,pitch: -0.43037037123084865 ,roll: 6.283183645391912
    },
  }
};
