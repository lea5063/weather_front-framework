<script setup>
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <el-card class="base-dashboard-card" shadow="always">
    <template v-if="title" #header>
      <div class="base-dashboard-card__header">
        <span v-if="icon" class="base-dashboard-card__icon">{{ icon }}</span>
        <span>{{ title }}</span>
      </div>
    </template>
    <slot />
  </el-card>
</template>

<style scoped>
.base-dashboard-card {
  --el-card-bg-color: rgba(17, 24, 39, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(10px);
}

.base-dashboard-card__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #fff;
}
</style>
