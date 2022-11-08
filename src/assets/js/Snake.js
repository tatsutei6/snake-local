import { GameObject } from './GameObject'
import { Cell } from './Cell'

/**
 * 蛇本质上是一个Cell的数组
 */
export class Snake extends GameObject {
  constructor(info, gameMap) {
    super()
    this.gameMap = gameMap
    // 蛇的信息
    this.id = info.id
    this.color = info.color

    // 蛇的身体(包括head)
    this.cells = [new Cell(info.row, info.column)]

    // 蛇的移动的下个位置
    this.nextCell = undefined

    // 蛇每秒走5个格子
    this.speed = 5
    // -1表示没有指令，0、1、2、3表示上右下左
    this.direction = -1
    // idle表示静止，move表示正在移动，over表示游戏结束
    this.status = 'idle'
    // 4个方向行的偏移量
    this.dRows = [-1, 0, 1, 0]
    // 4个方向列的偏移量
    this.dColumns = [0, 1, 0, -1]
    // 允许的误差
    this.eps = 1e-2
    // 蛇两只眼睛的x的偏移量
    this.eyeDx = [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1]
    ]
    // 蛇两只眼睛的y的偏移量
    this.eyeDy = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
    ]
    // 回合数
    this.round = 0
    // 允许的误差
    this.eps = 1e-2

    this.eyeDirection = 0
    if (this.id === 1) {
      this.eyeDirection = 2  // 左下角的蛇初始朝上，右上角的蛇朝下
    }

  }

  start() {

  }

  /**
   * 设置蛇的移动方向
   * @param d
   */
  setDirection(d) {
    this.direction = d
  }

  /**
   * 检测当前回合，蛇的长度是否增加
   */
  isExpandTail() {
    if (this.round <= 5) {
      return true
    }
    if (this.round % 3 === 1) {
      return true
    }
    return false
  }

  /**
   * 蛇移动到下一个小正方形的逻辑处理
   */
  nextRound() {
    const d = this.direction
    this.nextCell = new Cell(this.cells[0].row + this.dRows[d], this.cells[0].column + this.dColumns[d])
    // 更新眼睛的方向
    this.eyeDirection = d
    // 清空方向
    this.direction = -1
    this.status = 'move'
    // 回合数加1
    this.round++

    // 蛇的移动只改变cells中的第一个元素和最后一个元素的位置
    const k = this.cells.length
    for (let i = k; i > 0; i--) {
      // 将第i个元素深拷贝赋值给第i-1个元素
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]))
    }

    // 蛇撞墙或者撞到蛇身（自己或对方）
    if (this.gameMap.isGameOver(this.nextCell)) {
      this.status = 'over'
    }
  }

  /**
   * 处理蛇的移动
   */
  updateMove() {
    const start = this.cells[0]
    const dest = this.nextCell
    const distance = this.countDistance(start, dest)

    // 到达目标点
    if (this.isDest(start, dest)) {
      this.status = 'idle'
      this.cells[0] = this.nextCell
      this.nextCell = undefined
      if (!this.isExpandTail()) {
        this.cells.pop()
      }
    } else {
      // 每帧移动的距离，this.timeDelta单位为毫秒，所以除以1000
      const moveDistance = this.speed * this.timeDelta / 1000
      this.moveTo(start, dest, moveDistance, distance)

      // 如果蛇的长度不变长，那么尾巴也要跟着移动
      if (!this.isExpandTail()) {
        const k = this.cells.length
        const tail = this.cells[k - 1]
        const tailTarget = this.cells[k - 2]
        this.moveTo(tail, tailTarget, moveDistance, distance)
      }
    }
  }

  /**
   * 计算两个点之间的距离(支持斜线距离)
   * @param start
   * @param dest
   * @returns {number}
   */
  countDistance(start, dest) {
    const dx = dest.x - start.x
    const dy = dest.y - start.y
    // 从起始点到终点的距离（支持斜线的移动）
    // 本质上就是求斜边的长度
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * 判断是否到达目标点
   * @param start
   * @param dest
   * @returns {boolean}
   */
  isDest(start, dest) {
    const distance = this.countDistance(start, dest)
    return distance <= this.eps
  }

  /**
   *
   * @param start 起始点
   * @param dest 终点
   * @param moveDistance 每帧移动的距离
   * @param distance 起始点到终点的距离
   */
  moveTo(start, dest, moveDistance, distance) {
    const dx = dest.x - start.x
    const dy = dest.y - start.y
    // 每帧移动的距离，分配给x和y，
    start.x += moveDistance * dx / distance
    start.y += moveDistance * dy / distance
  }

  /**
   * 每一帧执行一次，每秒执行60帧
   */
  update() {
    // 如果蛇的状态是move
    if (this.status === 'move') {
      this.updateMove()
    }
    this.render()
  }

  render() {
    const _L = this.gameMap.L
    const _ctx = this.gameMap.ctx

    _ctx.fillStyle = this.color
    if (this.status === 'over') {
      _ctx.fillStyle = 'grey'
    }
    // 绘制蛇
    for (const cell of this.cells) {
      _ctx.beginPath()
      // 画圆
      // 以cell的中心点为圆心，半径为L/2的圆
      _ctx.arc(cell.x * _L, cell.y * _L, _L / 2 * 0.8, 0, 2 * Math.PI)
      _ctx.fill()
    }

    // 将蛇的身体变为正方形，蛇头和蛇尾变为半圆形
    for (let i = 1; i < this.cells.length; i++) {
      const cellA = this.cells[i - 1], cellB = this.cells[i]
      // 如果两个cell的x坐标相等以及y坐标相等，即两个cell重合，则无需处理
      if (Math.abs(cellA.x - cellB.x) < this.eps && Math.abs(cellA.y - cellB.y) < this.eps)
        continue
      // 如果两个cell的x坐标相等，那么就是垂直方向
      if (Math.abs(cellA.x - cellB.x) < this.eps) {
        _ctx.fillRect((cellA.x - 0.4) * _L, Math.min(cellA.y, cellB.y) * _L, _L * 0.8, Math.abs(cellA.y - cellB.y) * _L)
        // 如果两个cell的y坐标相等，那么就是水平方向
      } else {
        _ctx.fillRect(Math.min(cellA.x, cellB.x) * _L, (cellA.y - 0.4) * _L, Math.abs(cellA.x - cellB.x) * _L, _L * 0.8)
      }
    }
    // 绘制蛇的眼睛
    _ctx.fillStyle = 'black'
    // 绘制2个眼睛（画两个小圆圈）
    for (let i = 0; i < 2; i++) {
      const eyeX = (this.cells[0].x + this.eyeDx[this.eyeDirection][i] * 0.15) * _L
      const eyeY = (this.cells[0].y + this.eyeDy[this.eyeDirection][i] * 0.15) * _L

      _ctx.beginPath()
      _ctx.arc(eyeX, eyeY, _L * 0.05, 0, Math.PI * 2)
      _ctx.fill()
    }

  }
}