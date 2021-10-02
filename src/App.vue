<template>
  <router-view />
</template>
<script setup>
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { BOOKMARKED_COUNTRIES } from 'src/constants/constants';

const $store = useStore();
const $q = useQuasar();

const bookmarkedCountries = $q.localStorage.getItem(BOOKMARKED_COUNTRIES) || [];

$store.commit('app/updateBookmarkedCountries', bookmarkedCountries);
</script>
