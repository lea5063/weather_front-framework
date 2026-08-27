<script setup>
import { useConfigStore } from '../stores/configStore.js'

const configStore = useConfigStore()

// 전역 온도 단위를 섭씨와 화씨 사이에서 전환하기 위해 생성했습니다.
function handleToggle() {
  configStore.toggleUnit()
}
</script>

<template>
  <el-button size="small" round class="unit-toggler" @click="handleToggle">
    {{ configStore.unitSymbol }} 단위로 보기
  </el-button>
</template>

<style scoped>
.unit-toggler {
  white-space: nowrap;
}
</style>
