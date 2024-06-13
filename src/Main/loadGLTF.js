
function addGLTF(viewer,id_,url, position,show_,rotationz,scale,allowPick, BlendMode, color_, CS) {
  var origin = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
  var modelPrimitive = null;
  modelPrimitive = viewer.scene.primitives.add(Cesium.Model.fromGltf({
    id: id_,
    url: url,
    modelMatrix: modelMatrix,
    show: show_, // default
    scale: scale || 1, // double size
    // minimumPixelSize : 128,          // never smaller than 128 pixels
    maximumScale: 20000, // never larger than 20000 * model size (overrides minimumPixelSize)
    allowPicking: allowPick?allowPick:true,
    // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    scene: viewer.scene,
    colorBlendMode:Cesium.ColorBlendMode[BlendMode?BlendMode:"MIX"],
    customShader: CS?CS:undefined,
    // silhouetteSize: 5.0,
    // debugWireframe: true,
    // enableShowOutline:true,
    // showOutline:true,
    // outlineColor: Cesium.Color.RED,
  }));
  modelPrimitive.name = id_;
  modelPrimitive.type = "model";
  if (rotationz) {
    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationz));
    var rotationz = Cesium.Matrix4.fromRotationTranslation(mz);
    
    Cesium.Matrix4.multiply(modelMatrix, rotationz, modelMatrix);
    modelPrimitive.modelMatrix = modelMatrix
  }
  if (color_) {
    modelPrimitive.OrignColor = Cesium.Color.fromAlpha(Cesium.Color.WHITE, color_.alpha),
    modelPrimitive.color = color_;
  }

  modelPrimitive.readyPromise.then(function (model) {
    // Play all animations when the model is ready to render
    model.activeAnimations.addAll({
      speedup: 0.5,
      loop: Cesium.ModelAnimationLoop.REPEAT
    });
  });
  return modelPrimitive;
}

export {
  addGLTF
}
