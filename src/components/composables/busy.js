import { computed, reactive, ref } from "vue"
import bus from "../../util/bus"

export const errorCode = {
  "auth/invalid-email": "Invalid credentials",
  "auth/wrong-password": "Invalid credentials",
  "auth/user-not-found": "Invalid credentials"
}

export function useBusy() {
  const busyCounter = ref(0)

  const busy = () => {
    busyCounter.value = busyCounter.value + 1
  }

  const unBusy = () => {
    busyCounter.value = busyCounter.value > 0 ? busyCounter.value - 1 : 0
  }

  const busyIndicator = reactive({
    isBusy: computed(() => {
      return busyCounter.value > 0
    }),
    busy,
    unBusy,
    load: async (fn) => {
      busy()
      try {
        return await fn()
      } catch (e) {
        if (e.code) {
          bus.emit("error", errorCode[e.code] || e.code)
        }
        throw e
      } finally {
        unBusy()
      }
    }
  })

  return busyIndicator
}
