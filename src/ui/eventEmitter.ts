import { EmitterEvents, IEventEmitter } from "../types"
import { OptionalKeys } from "../types/helper"
import { SinglePattern } from "../utils"

class EventEmitter implements IEventEmitter {
  events: EmitterEvents = {}
  on(event: OptionalKeys<EmitterEvents>, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event]!.push(listener)
  }

  emit(event: OptionalKeys<EmitterEvents>, ...args: any[]) {
    const listeners = this.events[event]
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args)
      })
    }
  }

  off(event: OptionalKeys<EmitterEvents>, listener: Function) {
    const listeners = this.events[event]
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener)
    }
  }

  clearAllListeners() {
    this.events = {}
  }
}

const SingleEventEmitter = SinglePattern(EventEmitter)
const eventEmitter = new SingleEventEmitter()

export { eventEmitter }
export type { EventEmitter }
