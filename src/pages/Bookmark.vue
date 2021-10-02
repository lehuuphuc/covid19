<template>
  <div class="q-pa-lg">
    <q-card class="my-card">
      <q-card-section class="q-pb-none">
        <div class="text-h6 q-mb-xs">Bookmarked Countries</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <template v-if="bookmarkedCountries?.length > 0">
          <field
            v-for="country in bookmarkedCountries"
            :key="country.code"
            class="cursor-pointer q-py-sm"
            @click="showCountryHandler(country)"
          >
            {{ country?.name }}
            <img
              v-if="country?.flagImageUri"
              :src="country?.flagImageUri"
              class="bookmark__country-flag vertical-middle q-ml-sm"
            >
          </field>
        </template>
        <template v-else>
          No country bookmarked
        </template>
      </q-card-section>
    </q-card>
  </div>
  <country-modal
    v-model="isModalVisible"
    :country-code="countryCode"
    should-fetch-from-bookmark
  />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Field from 'src/components/Field.vue';
import CountryModal from 'src/components/CountryModal.vue';

const $store = useStore();

const bookmarkedCountries = computed(() => $store.getters['app/bookmarkedCountries']);
const isModalVisible = ref(false);
const countryCode = ref(null);

function showCountryHandler (country) {
  if (!country?.code) {
    return;
  }

  countryCode.value = country?.code;
  isModalVisible.value = true;
}
</script>

<style scoped lang="scss">
.bookmark__country-flag { max-height: 1rem; }
.field:not(:last-child) {
  border-bottom: .0625rem solid $grey-3;
}
</style>
