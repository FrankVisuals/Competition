import { reactive } from "vue"

export function useDialog() {
  const data = reactive({
    open: false,
    loading: false,
    closing: false
  })

  const open = () => {
    data.open = true
  }

  const close = () => {
    data.closing = true

    setTimeout(() => {
      data.open = false
      data.closing = false
    }, 150)
  }

  return {
    data,
    open,
    close
  }
}
