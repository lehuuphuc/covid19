<template>
  <div
    class="loader fixed-top-right window-height flex justify-center items-center"
  >
    <q-spinner-oval
      size="3rem"
      color="blue-5"
    />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  background: rgba(#000, .5); z-index: 9999; width: 100vw; min-height: -webkit-fill-available;
}
</style>
