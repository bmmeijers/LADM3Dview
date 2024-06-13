export function addBox(viewer,[lng,lat,height],[l,w,h],id,material){
  // material.uniforms.color = Cesium.Color.fromCssColorString("rbga(255,255,255,0.5)");
  let center = Cesium.Cartesian3.fromDegrees(lng, lat, height);
  let dimensions = new Cesium.Cartesian3(l, w, h);
  let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  let hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
    new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-26), 0.0, 0.0)
  );
  let hpr = Cesium.Matrix4.fromRotationTranslation(
    hprRotation,
    new Cesium.Cartesian3(0.0, 0.0, 0.0)
  );
  Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lng, lat, 0.5),
    label: {
      text: id,
      scaleByDistance: new Cesium.NearFarScalar(60, 1, 100, 0),
    },
  });
  return viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.BoxGeometry.fromDimensions({
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          dimensions: dimensions,
        }),
        modelMatrix: modelMatrix,
        id: id
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: false,
        material: material
      })
    })
  );
}
