import { gameParam, control } from "./config"

const isKeyPressed = {
  left: false,
  right: false,
  up: false,
  down: false,
  bottom: false,
}

export type Operation = {
  left: () => void
  right: () => void
  downOne: () => void
  downBottom: () => void
  rotate: () => void
}

type Keys = (typeof control.operate)[keyof typeof control.operate][number]
type CtrlKey = keyof typeof control.operate

let activeKey: Keys | null = null
window.onkeydown = (e) => {
  switch (e.key) {
    // case config.pause:
    // running ? cancelRaf() : render(ctx, config)
    // running = !running
    // break
    default:
      for (const key of Object.keys(control.operate)) {
        if (
          control.operate[key as keyof typeof control.operate].some(
            (item) => item === e.key
          )
        ) {
          activeKey = e.key as Keys
        }
      }
  }
}

let running = true
window.onkeyup = (e) => {
  switch (e.key) {
    case activeKey:
      activeKey = null
    default:
      let ctrlKey
      if ((ctrlKey = findCtrlKey(e.key as Keys))) {
        isKeyPressed[ctrlKey] = false
      }
  }
}

const findCtrlKey = (activeKey: Keys) => {
  for (const [key, value] of Object.entries(control.operate)) {
    if (value.some((item) => item === activeKey)) {
      return key as CtrlKey
    }
  }
}

const getBrickDownInterval = (ctrlKey: CtrlKey) => {
  let interval = 1000 / gameParam.keySpeed
  if (control.speedUpKey.some((item) => item === ctrlKey)) {
    interval = 500 / gameParam.keySpeed
  }
  return interval
}

const getHandle = (function () {
  const direction = {
    left: "left",
    right: "right",
    down: "downOne",
    bottom: "downBottom",
    up: "rotate",
  } as const
  return (operation: Operation, ctrlKey: CtrlKey) => {
    if (
      control.onceKey.some((item) => item === ctrlKey) &&
      isKeyPressed[ctrlKey]
    )
      return null
    return operation[direction[ctrlKey]].bind(
      operation
    ) as Operation[keyof Operation]
  }
})()

let lastTime = 0
export const userAction = function (operation: Operation) {
  if (activeKey === null) return
  let now = Date.now()
  const ctrlKey = findCtrlKey(activeKey)!
  if (!isKeyPressed[ctrlKey]) {
    lastTime = now
    let handle = getHandle(operation, ctrlKey)
    handle?.()
    isKeyPressed[ctrlKey] = true
    return
  }
  let interval = getBrickDownInterval(ctrlKey)
  if (now - lastTime >= interval) {
    lastTime = now - ((now - lastTime) % interval)
    let handle = getHandle(operation, ctrlKey)
    handle && handle()
  }
}
