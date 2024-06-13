// import * as Cesium from "cesium";


export class ParkingMaterial{
  constructor(c) {
    Cesium.Material._materialCache.addMaterial("ParkingMaterial",{
      fabric:{
        type:"ParkingMaterial",
        uniforms:{
          color_: {
            value: Cesium.Cartesian3(1.0,0.0,0.0),
            // value: Cesium.Cartesian3(c[0],c[1],c[2]),
            type: Cesium.UniformType.VEC3
          },
          alpha_: {
            value: 1.0,
            // value: c[3],
            type: Cesium.UniformType.FLOAT
          }
        },
        source:`
        void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
          material.diffuse = color_;
          return material;
        }
        `
      }
    })
  }

  addMaterial(fs){

  }

  isTranslucent(){

  }

  getType(){
    return "ParkingMaterial"
  }
  getValue(time,res){
    return res;
  }
}
