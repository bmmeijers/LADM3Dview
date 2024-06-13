// import {loadData} from "./loadDataBase.js";

const HomeOBJ = {destination: new Cesium.Cartesian3.fromDegrees(AppConfig.cameraP.lng,AppConfig.cameraP.lat,AppConfig.cameraP.h),
  orientation: {
    heading: AppConfig.cameraP.heading,
    pitch: AppConfig.cameraP.pitch,
    roll: AppConfig.cameraP.roll,
  }}
const TranslucencyOBJ = {destination: new Cesium.Cartesian3.fromDegrees(AppConfig.TranslucencyP.lng,AppConfig.TranslucencyP.lat,AppConfig.TranslucencyP.h),
  orientation: {
    heading: AppConfig.TranslucencyP.heading,
    pitch: AppConfig.TranslucencyP.pitch,
    roll: AppConfig.TranslucencyP.roll,
  }}


export default class InitCesium {
  constructor(options) {
    this.earth = undefined;
    this.id = options.id ? options.id : "Container";
  }


  InitEarth() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZGM0ZjdlNC04OGZmLTRmY2YtYTE5MC1mYjQ1OWM5ZjU3OTAiLCJpZCI6NjQ2NTksImlhdCI6MTYyOTM2NTEwNX0._fPOy51GAgLKB86DtlN6WQoA40_foZbcjq8SZe3xqWA';
    this.earth = new Cesium.Viewer(this.id, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: true,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      timeline: true,
      infoBox: false,
      selectionIndicator: false, 
      shouldAnimate: false, 
      // shadows: true, 
      contextOptions: {
        requestWebgl1: false,
        allowTextureFilterAnisotropic: true,
        webgl: {
          alpha: false,
          depth: true,
          stencil: true,
          antialias: true,
          powerPreference: 'high-performance',
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        },
      },
      sceneMode: Cesium.SceneMode.SCENE3D,
      clock: new Cesium.Clock(),
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      }),
      
    });
    console.log('Current time after setting:', Cesium.JulianDate.toDate(this.earth.clock.currentTime));

    this.earth.HomeOBJ = HomeOBJ;
    this.earth.TranslucencyOBJ = TranslucencyOBJ;

    window.ModelLight = {
      orign: this.earth.scene.light,
      static: new Cesium.DirectionalLight({ 
        // direction: this.earth.scene.camera.directionWC
        direction: new Cesium.Cartesian3(-0.1586984565633907, 0.4327340700883053, -0.8874435331158864),
        intensity: 1.0
      })
    }
    this.earth.scene.light = ModelLight.static;
    window.earth = this.earth;
    this.chushihuaEarth(this.earth);
    // loadData(this.earth);
    

  }

  chushihuaEarth(viewer) {
    // viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.scene.globe.depthTestAgainstTerrain = true;

    viewer.scene.globe.enableLighting = true;
    viewer.scene.fog.minimumBrightness = 0.5;
    viewer.scene.fog.density = 2.0e-4 * 1.2;
    viewer.scene.globe.atmosphereLightIntensity = 20;
    viewer.scene.globe.atmosphereBrightnessShift = -0.01;

    viewer.shadows = false;
    viewer.shadowMap.size = 5120;
    viewer.shadowMap.softShadows = true;
    viewer.shadowMap.maximumDistance = 10000;

    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000000000;
    
    viewer.scene.debugShowFramesPerSecond = false;
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]; 
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH]; //重置缩放，注释之后右键会既旋转又缩放
    viewer.scene.screenSpaceCameraController.translateEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
   
    viewer.camera.setView(HomeOBJ);
  }

  removeJagged(viewer) {
    if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){
      viewer.resolutionScale = window.devicePixelRatio;
    }
    viewer.scene.fxaa = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;
   
  }
}


