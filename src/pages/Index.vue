<template>
  <q-page class="q-pa-lg">
    <q-table
      title="Covid statistic"
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      row-key="name"
      @row-click="rowClickHandler"
    />
    <country-modal v-model="isModalVisible" :country-code="'US'" />
    <loader v-if="isLoading" />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { camelCaseKeys, handleError, fetchCovid19Data } from 'src/helpers/helpers';
import Loader from 'src/components/Loader.vue';
import CountryModal from 'src/components/CountryModal.vue';

const isLoading = ref(false);
const rawData = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%',
  },
]);
const columns = computed(() => [
  {
    name: 'country',
    required: true,
    label: 'Country',
    align: 'left',
    field: 'country',
  },
  {
    name: 'totalConfirmed',
    required: true,
    label: 'Total Confirmed Cases',
    align: 'right',
    field: (row) => row.totalConfirmed,
    sortable: true,
  },
  {
    name: 'totalDeaths',
    required: true,
    label: 'Total Deaths',
    align: 'right',
    field: 'totalDeaths',
    sortable: true,
  },
  {
    name: 'totalRecovered',
    required: true,
    label: 'Total Recovered ',
    align: 'right',
    field: 'totalRecovered',
    sortable: true,
  },
]);
const rows = computed(() => rawData.value);
const pagination = ref({
  sortBy: 'totalConfirmed',
  descending: true,
  page: 1,
  rowsPerPage: 0,
});
const isModalVisible = ref(false);

async function initialize () {
  isLoading.value = true;
  const response = await fetchCovid19Data().catch(handleError());
  rawData.value = camelCaseKeys(response?.data?.Countries ?? []);
  isLoading.value = false;
}

function rowClickHandler () {
  isModalVisible.value = true;
}

initialize();
</script>
