<template>
  <q-item
    clickable
    tag="a"
    :target="link ? '_blank' : undefined"
    :href="link"
    @click="clickHandler"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',

  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: null,
    },

    route: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: '',
    },
  },

  methods: {
    clickHandler () {
      if (!this.route || this.route === this.$route.name) {
        return;
      }

      this.$router.push({ name: this.route });
    },
  },
});
</script>
