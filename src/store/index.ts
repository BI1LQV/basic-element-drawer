import { ref, watch } from "vue"
import { PixelState } from "@/model"

export const sizeX = ref(10)
export const sizeY = ref(10)

export const playgroundState = ref<PixelState[]>([])

watch([sizeX, sizeY], () => {
  playgroundState.value = Array.from({ length: sizeX.value * sizeY.value }).map(() => PixelState.empty)
}, { immediate: true })
