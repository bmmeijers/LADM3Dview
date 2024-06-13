// import * as Cesium from "cesium";


export class BuildingMaterial extends Cesium.CustomShader {
  constructor(color) {
    super({
      uniforms: {
        color_: {
          value: color,
          type: Cesium.UniformType.VEC3
        },
      },
      varyings: {
        v_selectedColor: Cesium.VaryingType.VEC3
      },
      fragmentShaderText: `
  void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
    //*/ --获取模型的局部坐标
    vec3 positionMC = fsInput.attributes.positionMC;
    //*/ --顶点的法线向量
    vec3 normalEC = fsInput.attributes.normalEC;
    //*/ --自定义系数
    float ambientCoefficient = 0.8;
    //*/ --自定义系数
    float diffuseCoefficient = max(0.0, dot(normalEC, czm_sunDirectionEC) * 2.0);
    //
    material.diffuse = mix(mix(vec3(0.000), vec3(0.5),clamp(positionMC.y / 300., 0.0, 1.0)) , color_ ,0.3);
    material.diffuse *= min(diffuseCoefficient + ambientCoefficient, 1.0);
    material.alpha = 0.5;
  }
  `
    });
    
  }
}
