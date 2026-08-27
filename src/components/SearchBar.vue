<script setup>
const query = defineModel({ type: String, default: '' })

defineProps({
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['search'])

// 공백 검색을 막고 정리된 검색어를 부모 컴포넌트에 전달하기 위해 생성했습니다.
function handleSubmit() {
  const trimmed = query.value.trim()
  if (!trimmed) {
    return
  }
  emit('search', trimmed)
}
</script>

<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <input
      v-model="query"
      type="text"
      class="search-bar__input"
      placeholder="도시 이름 검색 (예: 서울, Seoul)"
      :disabled="isLoading"
    />
    <button type="submit" class="search-bar__button" :disabled="isLoading">
      {{ isLoading ? '검색 중...' : '검색' }}
    </button>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  width: 100%;
}

.search-bar__input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  outline: none;
}

.search-bar__button {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  cursor: pointer;
}

.search-bar__button:disabled,
.search-bar__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
