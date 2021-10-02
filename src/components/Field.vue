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
import { useSlots } from 'vue';

const slots = useSlots();
</script>
