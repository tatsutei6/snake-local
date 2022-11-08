import { GameObject } from './GameObject'
import { Wall } from './Wall'
import { Snake } from './Snake'

export class GameMapObject extends GameObject {
  constructor(ctx, parent) {
    // 调用父类的构造函数，GameMapObject先加入到GAME_OBJECTS
    super()
    this.ctx = ctx
    this.parent = parent
    // 小正方形的边长
    this.L = 0

    this.rows = 13
    this.columns = 14

    // 边界内障碍物的数量
    this.innerBarrierCount = 16
    this.walls = []

    // 蛇
    this.snakes = [
      new Snake({ id: 0, color: '#4876EC', row: this.rows - 2, column: 1 }, this),
      new Snake({ id: 1, color: '#F94848', row: 1, column: this.columns - 2 }, this)
    ]


  }

  /**
   * 判断是否游戏结束
   */
  isGameOver(cell) {
    // 撞到墙gameOver
    for (const wall of this.walls) {
      if (wall.row === cell.row && wall.column === cell.column)
        return true
    }

    // 撞到自己或者对方gameOver
    for (const snake of this.snakes) {
      let k = snake.cells.length
      // 如果蛇尾不增加，则不判断是否碰撞蛇尾
      if (!snake.isExpandTail()) {
        k--
      }
      // 判断是否碰撞蛇身
      for (let i = 0; i < k; i++) {
        if (cell.row === snake.cells[i].row && cell.column === snake.cells[i].column) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 生成墙和障碍物
   */
  createWallsAndBarriers() {
    const g = []

    // 初始化g
    for (let r = 0; r < this.rows; r++) {
      g[r] = []
      for (let c = 0; c < this.columns; c++) {
        // 边界位置
        if (this.isBorder(r, c)) {
          g[r][c] = true
        } else {
          g[r][c] = false
        }
      }
    }
    // 随机生成障碍物的重试次数
    const retryCount = this.rows * this.columns
    // 生成墙内障碍物所在的位置（随机生成）
    for (let i = 0; i < this.innerBarrierCount / 2; i++) {
      for (let j = 0; j < retryCount; j++) {
        let r = Math.floor(Math.random() * this.rows)
        let c = Math.floor(Math.random() * this.columns)
        if (!this.isValidInnerBarrierPosition(g, r, c) ||
          !this.isValidInnerBarrierPosition(g, c, r)) {
          continue
        }

        // 对称生成随机障碍物，斜线对称（轴对称），地图为正方形可用
        // g[r][c] = true
        // g[c][r] = true

        // 横线对称（中心对称），地图为长方形可用
        g[r][c] = true
        g[this.rows - 1 - r][this.columns - 1 - c] = true
        break
      }
    }

    // 为了避免在isConnective中改变g的状态，生成g的副本
    const copyG = JSON.parse(JSON.stringify(g))
    if (!this.isConnective(copyG, this.rows - 2, 1, 1, this.columns - 2)) {
      return false
    }

    // 在canvas上，生成四周的边界墙以及墙内的随机障碍物
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        // 如果为边界位置，或者该位置已经有障碍物了
        if (g[r][c]) {
          this.walls.push(new Wall(r, c, this))
        }
      }
    }
    return true
  }

  /**
   * 判断是否是边界位置
   * @param r
   * @param c
   * @returns {boolean}
   */
  isBorder(r, c) {
    return r === 0 || r === this.rows - 1 || c === 0 || c === this.columns - 1
  }

  /**
   * 判断是否是合法的内部障碍物位置
   * @param g
   * @param r
   * @param c
   * @returns {boolean}
   */
  isValidInnerBarrierPosition(g, r, c) {
    // 边界位置，超过了map的范围，或者该位置已经有障碍物了
    if (r === 0 || r >= this.rows - 1 || c === 0 || c >= this.columns - 1 || g[r][c]) {
      return false
    }
    // 两条蛇的初始位置（左下和右上）
    if ((r === this.rows - 2 && c === 1) || (r === 1 && c === this.columns - 2)) {
      return false
    }
    return true
  }

  /**
   * 判断两条蛇的初始位置是否连通
   * player1的初始位置为左下，player2的初始位置为右上
   * @param g
   * @param startX
   * @param startY
   * @param endX
   * @param endY
   * @returns {boolean}
   */
  isConnective(g, startX, startY, endX, endY) {
    if (startX === endX && startY === endY) {
      return true
    }
    g[startX][startY] = true
    // 上下左右四个方向
    const dx = [0, 1, 0, -1]
    const dy = [1, 0, -1, 0]

    for (let i = 0; i < dx.length; i++) {
      let x = startX + dx[i]
      let y = startY + dy[i]
      if (!g[x][y] && this.isConnective(g, x, y, endX, endY)) {
        return true
      }
    }
    return false
  }

  /**
   * 增加事件监听
   */
  addListeningEvents() {
    // 将焦点移动到canvas上，才能监听键盘事件
    this.ctx.canvas.focus()
    const [snake1, snake2] = this.snakes
    // 监听键盘事件
    this.ctx.canvas.addEventListener('keydown', (e) => {
      if (e.key === 'w') {
        snake1.setDirection(0)
      } else if (e.key === 'd') {
        snake1.setDirection(1)
      } else if (e.key === 's') {
        snake1.setDirection(2)
      } else if (e.key === 'a') {
        snake1.setDirection(3)
      } else if (e.key === 'ArrowUp') {
        snake2.setDirection(0)
      } else if (e.key === 'ArrowRight') {
        snake2.setDirection(1)
      } else if (e.key === 'ArrowDown') {
        snake2.setDirection(2)
      } else if (e.key === 'ArrowLeft') {
        snake2.setDirection(3)
      }
    })


  }

  start() {
    // 生成墙和障碍物的重试次数
    const retryCount = 100
    // 生成墙，Wall对象加入到GAME_OBJECTS中，是在GameMapObject后加入的
    // 所以Wall的渲染会覆盖掉GameMapObject的渲染
    for (let i = 0; i < retryCount; i++) {
      if (this.createWallsAndBarriers()) {
        break
      }
      console.log('重新生成墙,障碍物')
    }

    // 绑定监听函数
    this.addListeningEvents()
  }

  /**
   * 生成游戏Map的长宽
   * 随着窗口的大小变化，重新计算canvas的大小
   * 本质是求被某特定的长方形包围的最大正方形的长宽
   */
  updateSize() {
    // canvas为正方形，是多个小正方形组成，每个小正方形的边长为L
    // canvas的行数，列数和父元素的行数，列数一致
    this.L = Math.min(this.parent.clientWidth / this.columns, this.parent.clientHeight / this.rows)
    // 向下取整，消除浮点数造成的空隙
    // 单元格(小正方形)的边长
    this.L = Math.floor(this.L)
    // 设置canvas的宽度和高度
    this.ctx.canvas.width = this.L * this.columns
    this.ctx.canvas.height = this.L * this.rows
  }

  /**
   * 判断两条蛇是否准备好执行下一回合
   * @returns {boolean}
   */
  isReady() {
    for (const snake of this.snakes) {
      if (snake.status !== 'idle') return false
      if (snake.direction === -1) return false
    }
    return true
  }
  isValid(cell) {  // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
    console.log('isValid.cell', cell)
  }

  update() {
    // 随着窗口的大小变化，重新计算canvas的大小
    this.updateSize()
    // 两条蛇都准备好执行下一回合
    // 如果有一条蛇的状态为over或者move，则不执行下一回合
    if (this.isReady()) {
      // 执行两条蛇的nextRound
      for (const snake of this.snakes) {
        snake.nextRound()
      }
    }
    this.render()
  }

  render() {
    // canvas的背景色
    const colorEven = '#AAD751'
    const colorOdd = '#A2D149'

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        // 画一个小正方形
        this.ctx.fillStyle = (r + c) % 2 === 0 ? colorEven : colorOdd
        this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L)
      }
    }
  }
}