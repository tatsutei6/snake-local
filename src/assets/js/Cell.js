export class Cell {
  constructor(r, c) {
    this.row = r
    this.column = c
    // 横坐标，以Cell的中心点为坐标，所以加0.5
    this.x = c + 0.5
    // 纵坐标，以Cell的中心点为坐标，所以加0.5
    this.y = r + 0.5
  }
}