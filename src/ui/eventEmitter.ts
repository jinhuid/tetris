import { EmitterEvents, IEventEmitter } from "../types"
import { SinglePattern } from "../utils"

class EventEmitter implements IEventEmitter {
  events: Partial<EmitterEvents> = {}
  on<E extends keyof EmitterEvents>(
    event: E,
    listener: EmitterEvents[E][number]
  ) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event]?.push(listener as (...args: any[]) => any)
  }

  emit<E extends keyof EmitterEvents>(
    event: E,
    ...args: Parameters<EmitterEvents[E][number]>
  ) {
    const listeners = this.events[event]
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...(args as [any]))
      })
    }
  }

  off<E extends keyof EmitterEvents>(
    event: E,
    listener: EmitterEvents[E][number]
  ) {
    const listeners = this.events[event]
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener) as ((
        ...args: any[]
      ) => any)[]
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
