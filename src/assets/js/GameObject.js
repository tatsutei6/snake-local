const GAME_OBJECTS = []

export class GameObject {
  constructor() {
    this.timeDelta = 0
    this.started = false
    GAME_OBJECTS.push(this)
  }

  /**
   * 一回だけ実行される、オブジェクトが生成された時に実行される
   */
  start() {
  }

  /**
   * 毎フレーム実行される、最初のフレームは実行されない
   */
  update() {

  }


  /**
   * オブジェクト破棄の時の処理
   */
  onDestroy() {

  }

  /**
   * オブジェクトが破棄された時に実行される
   */
  destroy() {
    this.onDestroy()

    for (let i = 0; i < GAME_OBJECTS.length; i++) {
      const ele = GAME_OBJECTS[i]
      if (ele === this) {
        GAME_OBJECTS.splice(i)
        break
      }
    }
  }
}

// 前回実行したタイムスタンプ
let lastRunTimestamp
const step = timestamp => {
  // 遍历所有游戏对象
  for (let ele of GAME_OBJECTS) {
    // 如果游戏对象处于非"开始"状态，就调用start方法
    if (!ele.started) {
      ele.started = true
      ele.start()
    } else {
      ele.timeDelta = timestamp - lastRunTimestamp
      ele.update()
    }
  }

  lastRunTimestamp = timestamp
  requestAnimationFrame(step)
}

requestAnimationFrame(step)