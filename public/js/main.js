import map from '../maps/map';

const TILE_SIZE = 24;

Class MapRenderer {
  contructor({ctx, map}) {
    this.context = ctx;
    this.map = map;
    this.tileSize = TILE_SIZE;
  }
  draw() {
    const {context, map, drawTile, w, h} = this;

    context.clearRect(0, 0, w, h);
    context.fillStyle = "rgba(255,0,0,0.6)";
    map.forEach((row, i) => {
      row.forEach((tile, j) => {
        if (tile !== 0) { //if tile is not walkable
          drawTile(j, i); //draw a rectangle at j,i
        }
      });
    });
  }

  drawTile(sprite, singleTileSpec, x, y) {
    const {context, tileSize} = this

    context.drawImage(
      sprite,
      singleTileSpec.x, singleTileSpec.y, tileSize, tileSize, // source coords
      Math.floor(x * tileSize), Math.floor(y * tileSize), tileSize, tileSize // destination coords
    );
  }
}

((window, document) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const mapRenderer = new MapRenderer({ctx, map})

  mapRenderer.draw();
})(window, document)
