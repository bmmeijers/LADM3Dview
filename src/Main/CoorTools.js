
function getCoorMessage(viewer,Handler) {
  Handler.setInputAction((event) => {
    var pick = viewer.scene.pick(event.position);
    let earthPosition = viewer.camera.pickEllipsoid(
      event.position,
      viewer.scene.globe.ellipsoid
    );
    if (Cesium.defined(pick)){
      console.log("pick: ",pick)
    }
    let goePt = Cesium.Cartographic.fromCartesian(earthPosition);
    let latitude = Cesium.Math.toDegrees(goePt.latitude);
    let longitude = Cesium.Math.toDegrees(goePt.longitude);
    let height = goePt.height;
    let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 150);
    console.log("xiangji:",viewer.scene.camera.directionWC)
    console.log("heading:", viewer.scene.camera.heading, ",pitch:", viewer.scene.camera.pitch, ",roll:", viewer.scene.camera.roll);
    console.log("WGS84:", longitude + "," + latitude + "," + height);
    console.log("笛卡尔:", position.x + "," + position.y + "," + position.z);

    const camera = viewer.scene.camera
    const cartographic = Cesium.Cartographic.fromCartesian(camera.position)
    const x = Cesium.Math.toDegrees(cartographic.longitude)
    const y = Cesium.Math.toDegrees(cartographic.latitude)
    const z = cartographic.height
    let pt = Cesium.Cartographic.fromDegrees(x, y, z);
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartesian3 = ellipsoid.cartographicToCartesian(pt);
    console.log("相机参数获取：")
    console.log("heading:", camera.heading, ",pitch:", camera.pitch, ",roll:", camera.roll);
    console.log("WGS84:", x + "," + y + "," + z);
    console.log("笛卡尔:", cartesian3.x + "," + cartesian3.y + "," + cartesian3.z);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


function Coor2BLH(earth, coor, isarr) {
  var ellipsoid = earth.scene.globe.ellipsoid;
  var cartesian3 = undefined;
  if (coor instanceof Array) {
    cartesian3 = new Cesium.Cartesian3(coor[0], coor[1], coor[2]);
  } else {
    cartesian3 = new Cesium.Cartesian3(coor.x, coor.y, coor.z);
  }
  var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
  var lat = Cesium.Math.toDegrees(cartographic.latitude);
  var lng = Cesium.Math.toDegrees(cartographic.longitude);
  // var alt = earth.scene.globe.getHeight(cartographic);
  var alt = cartographic.height;
  if (isarr === true) {
    return [lng, lat, alt];
  } else {
    return {lng: lng, lat: lat, alt: 0.0};
  }
}


function BLH2Coor(BLH) {
  if (BLH instanceof Array) {
    return Cesium.Cartesian3.fromDegrees(BLH[0], BLH[1], BLH[1]);
  } else {
    return Cesium.Cartesian3.fromDegrees(BLH.lng, BLH.lat, BLH.alt);
  }
}


function coor2WKT(coors,type) {
  let wktstr = "";
  if (type === "line"){
    wktstr = "LINESTRING(";
    for (let i = 0; i < coors.length; i++) {
      let blh = Coor2BLH(coors[i],true);
      if (i != 0){
        wktstr += ","
      }
      wktstr += blh[0] + " " + blh[1];
    }
    wktstr += ")";
  }else if (type === "polygon") {
    
    wktstr = "POLYGON((";
    for (let i = 0; i < coors.length; i++) {
      let blh = Coor2BLH(coors[i],true);
      if (i != 0){
        wktstr += ","
      }
      wktstr += blh[0] + " " + blh[1];
    }
    wktstr += "))";
  }else {
    wktstr = "POINT(";
    let blh = Coor2BLH(coors[0],true);
    wktstr += blh[0] + " " + blh[1] + ")"
  }
  return wktstr;
}


function WKT2coor(wktstr,type) {
  let obj = [];
  if (type === "line"){
    let newwktstr = wktstr.replace("LINESTRING(","");
    newwktstr = newwktstr.replace(")","");
    let wktarr = newwktstr.split(',');
    for (let i = 0; i < wktarr.length; i++) {
      let lb = {
        lng:Number(wktarr[i].split(" ")[0]),
        lat:Number(wktarr[i].split(" ")[1]),
        alt:0
      }
      obj.push(BLH2Coor(lb));
    }
  }else if (type === "polygon") {
    
    let newwktstr = wktstr.replace("POLYGON((","");
    newwktstr = newwktstr.replace("))","");
    let wktarr = newwktstr.split(',');
    for (let i = 0; i < wktarr.length; i++) {
      let lb = {
        lng:Number(wktarr[i].split(" ")[0]),
        lat:Number(wktarr[i].split(" ")[1]),
        alt:0
      }
      obj.push(BLH2Coor(lb));
    }
  }else {
    let newwktstr = wktstr.replace("POINT(","");
    newwktstr = newwktstr.replace(")","");
    let lb = {
      lng:Number(newwktstr.split(" ")[0]),
      lat:Number(newwktstr.split(" ")[1]),
      alt:0
    }
    obj.push(BLH2Coor(lb));
  }

  return obj;
}



export {
  getCoorMessage,
  Coor2BLH,
  BLH2Coor,
  WKT2coor,
  coor2WKT

}
