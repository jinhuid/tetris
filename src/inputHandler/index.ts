import { gameParam } from "../gameConfig"
import { OperateEvents } from "../types"
import { control } from "./inputHandlerConfig"

const isKeyPressed = {
  left: false,
  right: false,
  up: false,
  down: false,
  bottom: false,
}

type MoveKeys = (typeof control.operate)[keyof typeof control.operate][number]
type PauseKeys = (typeof control.pause)[number]
type Pause = "pause"
type Control = keyof typeof control.operate

let activeKey: MoveKeys | PauseKeys | null = null
window.onkeydown = (e) => {
  switch (true) {
    case control.pause.some((item) => item === e.key):
      activeKey = e.key as PauseKeys
      break
    case Object.values(control.operate)
      .flat(1)
      .some((item) => item === e.key):
      activeKey = e.key as MoveKeys
  }
}

window.onkeyup = (e) => {
  switch (true) {
    case activeKey === e.key:
      activeKey = null
    default:
      let ctrlKey
      if ((ctrlKey = findCtrlKey(e.key as MoveKeys))) {
        isKeyPressed[ctrlKey] = false
      }
  }
}

function findCtrlKey(activeKey: MoveKeys): Control
function findCtrlKey(activeKey: PauseKeys): Pause
function findCtrlKey(
  activeKey: MoveKeys | PauseKeys
): Control | Pause | undefined {
  if (control.pause.some((item) => item === activeKey)) {
    return "pause" as Pause
  }
  for (const [key, value] of Object.entries(control.operate)) {
    if (value.some((item) => item === activeKey)) {
      return key as Control
    }
  }
}

const getBrickDownInterval = (ctrlKey: Control) => {
  let interval = 1000 / gameParam.keySpeed
  if (control.speedUpKey.some((item) => item === ctrlKey)) {
    interval = 1000 / control.speedUpRate / gameParam.keySpeed
  }
  return interval
}

const getHandle = (function () {
  const direction = {
    left: "left",
    right: "right",
    down: "downOne",
    bottom: "downToBottom",
    up: "rotate",
  } as const
  return (operation: OperateEvents, ctrlKey: Control) => {
    if (
      control.onceKey.some((item) => item === ctrlKey) &&
      isKeyPressed[ctrlKey]
    )
      return null
    return operation[direction[ctrlKey]].bind(operation)
  }
})()

const isPauseKey = (
  activeKey: MoveKeys | PauseKeys
): activeKey is PauseKeys => {
  return control.pause.some((item) => item === activeKey)
}

let lastTime = 0
export const userActions = function (pause: boolean, operation: OperateEvents) {
  if (activeKey === null) return
  if (isPauseKey(activeKey)) {
    operation.pauseGame()
    activeKey = null
    return
  }
  if (pause) return
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
    handle?.()
  }
}
