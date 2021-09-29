<template>
  <div class="field row no-wrap">
    <div class="field__label col-auto text-weight-medium">
      <slot name="label" />
    </div>
    <div class="field__value q-ml-sm ellipsis">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
