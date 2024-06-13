//***************************************************************//


function loadTerrain(viewer) {
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: "http://data.marsgis.cn/terrain"
  });
}


function loadData(earth) {
  
  
   loadTerrain(earth)
}

export {
  loadData
}
