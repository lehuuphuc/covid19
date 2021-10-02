<template>
  <q-page class="q-pa-lg">
    <q-table
      title="Covid statistic"
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      :binary-state-sort="true"
      row-key="name"
      @row-click="rowClickHandler"
    />
    <country-modal
      v-model="isModalVisible"
      :country-code="countryCode"
    />
    <loader v-if="isLoading" />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { camelCaseKeys, handleError, fetchCovid19Data, formatNumber } from 'src/helpers/helpers';
import Loader from 'src/components/Loader.vue';
import CountryModal from 'src/components/CountryModal.vue';

const $q = useQuasar();
const isLoading = ref(false);
const rawData = ref([]);
const isMobileLayout = computed(() => $q.screen.lt.sm);
const columns = computed(() => [
  {
    name: 'country',
    required: true,
    label: isMobileLayout.value ? 'Country Code' : 'Country',
    align: 'left',
    field: isMobileLayout.value ? 'countryCode' : 'country',
    format (value, row) {
      return isMobileLayout.value ? value : `${value} (${row.countryCode})`;
    },
    sortable: true,
  },
  {
    name: 'totalConfirmed',
    required: true,
    label: 'Total Confirmed',
    align: 'right',
    field: (row) => (row.totalConfirmed),
    format: formatNumber,
    sortable: true,
  },
  {
    name: 'totalDeaths',
    required: true,
    label: 'Total Deaths',
    align: 'right',
    field: 'totalDeaths',
    format: formatNumber,
    sortable: true,
  },
  {
    name: 'totalRecovered',
    required: true,
    label: 'Total Recovered ',
    align: 'right',
    field: 'totalRecovered',
    format: formatNumber,
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
const countryCode = ref(null);

async function initialize () {
  isLoading.value = true;
  const response = await fetchCovid19Data().catch(handleError);
  rawData.value = camelCaseKeys(response?.data?.Countries ?? []);
  isLoading.value = false;
}

function rowClickHandler (event, row) {
  if (!row?.countryCode) {
    return;
  }

  countryCode.value = row?.countryCode;
  isModalVisible.value = true;
}

initialize();
</script>
