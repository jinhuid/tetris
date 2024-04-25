const $ = (selector: string) => {
  return document.querySelector(selector)
}

const customRaf = (fn: (...args: any[]) => {}, fps: number) => {
  if (!!fps) {
    if (!Number.isInteger(fps) || fps <= 0) {
      throw new TypeError("fps 应该是一个正整数")
    }
  }
  let timer: number
  function raf(...args: any[]) {
    const run = (() => {
      if (fps) {
        const interval = 1000 / fps
        let lastTime = 0
        return function (this: any, timeStamp: number) {
          const deltaTime = timeStamp - lastTime
          if (deltaTime >= interval) {
            fn.apply(this, args)
            lastTime = timeStamp - (deltaTime % interval)
          }
        }
      }
      return function (this: any) {
        fn.apply(this, args)
      }
    })()
    const update = (timeStamp: number) => {
      run(timeStamp)
      timer = requestAnimationFrame(update)
    }
    cancel()
    update(performance.now())
  }
  function cancel() {
    cancelAnimationFrame(timer)
  }
  return [raf, cancel]
}

function throttle(fn: (...args: any[]) => {}, delay: number) {
  let timer: number | null
  return function (this: any, ...args: any[]) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

export { $, customRaf, throttle }
