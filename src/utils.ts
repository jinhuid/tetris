const $ = (selector: string) => {
  return document.querySelector(selector)
}

const customRaf = (
  fn: (time: number, ...args: any[]) => unknown,
  fps?: number
) => {
  if (!!fps) {
    if (!Number.isInteger(fps) || fps <= 0) {
      throw new TypeError("fps 应该是一个正整数")
    }
  }
  let timer: number
  function raf(this: any, ...args: any[]) {
    const run = (() => {
      if (fps) {
        const interval = 1000 / fps
        let lastTime = 0
        return (timeStamp: number) => {
          const deltaTime = timeStamp - lastTime
          if (deltaTime >= interval) {
            fn.apply(this, [timeStamp, ...args])
            lastTime = timeStamp - (deltaTime % interval)
          }
        }
      }
      return (timeStamp: number) => {
        fn.apply(this, [timeStamp, ...args])
      }
    })()
    const update = (timeStamp: number) => {
      // 这里的raf要放在前面
      timer = requestAnimationFrame(update)
      run(timeStamp)
    }
    cancel()
    update(0)
  }
  function cancel() {
    cancelAnimationFrame(timer)
  }
  return [raf, cancel] as const
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
