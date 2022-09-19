import { ref, watch } from "vue"
import { PixelState } from "@/model"

export const sizeX = ref(30)
export const sizeY = ref(30)

export const playgroundState = ref<PixelState[]>([])

export function initPlayground() {
  playgroundState.value = Array.from({ length: sizeX.value * sizeY.value }).map(() => PixelState.empty)
}
watch([sizeX, sizeY], () => {
  initPlayground()
}, { immediate: true })
