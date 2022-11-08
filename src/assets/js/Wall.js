import { GameObject } from './GameObject'

export class Wall extends GameObject {
  constructor(r, c, gameMap) {
    super()

    this.row = r
    this.column = c
    this.gameMap = gameMap
    this.color = '#B37226'
  }

  update() {
    this.render()
  }

  render() {
    // 单元格(小正方形)的边长
    const L = this.gameMap.L
    // canvas对象
    const ctx = this.gameMap.ctx

    ctx.fillStyle = this.color
    ctx.fillRect(this.column * L, this.row * L, L, L)
  }
}