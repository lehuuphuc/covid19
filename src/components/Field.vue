<template>
  <div class="field row no-wrap">
    <div
      v-if="slots.label"
      class="field__label col-auto text-weight-medium"
    >
      <slot name="label" />
    </div>
    <div
      class="field__value  ellipsis"
      :class="{ 'q-ml-sm': slots.label }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useSlots, useAttrs, getCurrentInstance } from 'vue';

// const props = defineProps({ foo: String });
// const emit = defineEmits(['change', 'input']);
const slots = useSlots();
// const attrs = useAttrs();
// const value = ref(null);
// const computedValue = computed(() => 1234);

// optional
// defineExpose({
//   value,
//   computedValue,
// });
</script>

<style scoped lang="scss"></style>
