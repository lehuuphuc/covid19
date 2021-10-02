<template>
  <q-dialog
    :model-value="props.modelValue"
    :persistent="false"
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="emit('update:model-value', $event)"
  >
    <q-card :class="{ 'country-modal--desktop': $q.screen.gt.xs }">
      <q-bar>
        <img
          v-if="country?.flagImageUri"
          :src="country?.flagImageUri"
          class="country-modal__country-flag vertical-middle q-ml-sm"
        >
        <q-space />
        <q-btn
          dense
          flat
          icon="star"
          :class="{ 'text-amber-8': isBookmarked }"
          @click="bookmarkHandler"
        >
          <q-tooltip anchor="top middle" self="bottom middle">Bookmark</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip anchor="top middle" self="bottom middle">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="country-modal__container">
        <div class="country-modal__country q-pb-sm">
          <!-- name -->
          <field>
            <template #label>
              Country:
            </template>
            {{ country?.name }}
          </field>
          <!-- capital -->
          <field>
            <template #label>
              Capital:
            </template>
            {{ country?.capital }}
          </field>
          <!-- states -->
          <field>
            <template #label>
              Number of states:
            </template>
            {{ country?.numRegions }}
          </field>
          <!-- currency -->
          <field>
            <template #label>
              Currency:
            </template>
            {{ country?.currencyCodes?.join(', ') }}
          </field>
        </div>
        <div
          v-if="country"
          class="country-modal__chart"
        >
          <div class="text-weight-medium">Total Confirmed Cases In Last 7 Days</div>
          <!-- chart -->
          <apexchart :options="chartData.chartOptions" :series="chartData.series" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <loader v-if="isLoading" />
</template>

<script setup>
import { ref, computed, useSlots, useAttrs, getCurrentInstance, defineProps, defineEmits, watch } from 'vue';
import { useQuasar } from 'quasar';
import { fetchCountryData, fetchCovid19DataByCountry, fetchCovid19Data, handleError, formatDate, formatNumber } from 'src/helpers/helpers';
import { BOOKMARKED_COUNTRIES } from 'src/constants/constants';
import { api } from 'src/boot/axios';
import Field from 'src/components/Field.vue';
import Loader from 'src/components/Loader.vue';
import { useStore } from 'vuex';

const props = defineProps({ modelValue: Boolean, countryCode: String, shouldFetchFromBookmark: Boolean });
const emit = defineEmits(['update:model-value']);
const $q = useQuasar();
const $store = useStore();
const bookmarkedCountries = computed(() => $store.getters['app/bookmarkedCountries']);
const isBookmarked = computed(() => !!bookmarkedCountries.value.find(({ code }) => code === props.countryCode));
console.log('bookmarkedCountries', bookmarkedCountries);

// const slots = useSlots();
// const attrs = useAttrs();
// const value = ref(null);
// const computedValue = computed(() => 1234);

// optional
// defineExpose({
//   value,
//   computedValue,
// });
console.log('aaa', formatNumber(123));
const isLoading = ref(false);
const country = ref(null);
const country1 = ref({
  capital: 'Washington, D.C.',
  code: 'US',
  currencyCodes: [
    'USD',
  ],
  flagImageUri: 'http://commons.wikimedia.org/wiki/Special:FilePath/Flag%20of%20the%20United%20States.svg',
  name: 'United States of America',
  numRegions: 56,
  wikiDataId: 'Q30',
  covid19Data: [
    {
      confirmed: 42900903,
      date: '2021-09-25T00:00:00Z',
    },
    {
      confirmed: 42931861,
      date: '2021-09-26T00:00:00Z',
    },
    {
      confirmed: 43116877,
      date: '2021-09-27T00:00:00Z',
    },
    {
      confirmed: 43226482,
      date: '2021-09-28T00:00:00Z',
    },
    {
      confirmed: 43349749,
      date: '2021-09-29T00:00:00Z',
    },
    {
      confirmed: 43460343,
      date: '2021-09-30T00:00:00Z',
    },
    {
      confirmed: 43618627,
      date: '2021-10-01T00:00:00Z',
    },
  ],
});
const chartData = computed(() => ({
  chartOptions: {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      // categories: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan'],
      categories: country.value?.covid19Data?.map(({ date }) => date) ?? [],
      labels: {
        formatter (value) {
          return formatDate(value);
        },
      },
    },
    yaxis: {
      labels: {
        formatter (value) {
          return formatNumber(value);
        },
      },
    },
    markers: {
      shape: 'circle',
      size: 6,
      hover: { size: 8 },
    },
  },
  // series: [
  //   {
  //     name: 'Total Confirmed',
  //     data: [100, 41, 35, 51, 49, 62, 69, 91, 148],
  //   },
  // ],
  series: [
    {
      name: 'Total Confirmed',
      data: country.value?.covid19Data?.map(({ confirmed }) => (confirmed)) ?? [],
    },
  ],
}));

function bookmarkHandler () {
  if (!country.value) {
    return;
  }

  const otherBookmarkedCountries = bookmarkedCountries.value.filter(({ code }) => code !== props.countryCode) || [];
  const updatedBookmarkedCountries = isBookmarked.value
    ? otherBookmarkedCountries
    : [...otherBookmarkedCountries, country.value];

  $q.localStorage.set(BOOKMARKED_COUNTRIES, updatedBookmarkedCountries);
  $store.commit('app/updateBookmarkedCountries', updatedBookmarkedCountries);
}

async function initialize () {
  console.log('initialize', country.value?.code);
  if (country.value?.code) {
    return;
  }

  if (props.shouldFetchFromBookmark) {
    const bookmarkedCountry = bookmarkedCountries.value.find(({ code }) => props.countryCode === code);

    if (bookmarkedCountry?.code) {
      country.value = bookmarkedCountry;
      isLoading.value = false;

      return;
    }
  }

  let countryData = null;
  isLoading.value = true;
  console.log('fetchCountryData');
  const countryResponse = await fetchCountryData(props.countryCode)
    .catch(handleError());
  console.log('111', countryResponse?.data?.data);
  countryData = countryResponse?.data?.data;

  if (!countryData) {
    isLoading.value = false;

    return;
  }

  console.log('fetchCovid19DataByCountry');
  const covid19DataResponse = await fetchCovid19DataByCountry(props.countryCode)
    .catch(handleError());
  const covid19Data = (covid19DataResponse?.data ?? []).map(({ Confirmed: confirmed, Date: date }) => ({ confirmed, date }));
  console.log('222', covid19Data);
  countryData.covid19Data = covid19Data;
  country.value = countryData;

  isLoading.value = false;
}

watch(() => props.modelValue, (value, previousValue) => {
  console.log('watch', value, previousValue);
  if (!value) {
    country.value = null;

    return;
  }
  console.log('watch', country);
  initialize();
});

</script>

<style scoped lang="scss">
.country-modal--desktop {
  min-width: 32rem;
}
.country-modal__country-flag { max-height: 1rem; }
.field { padding: .25rem 0; }
.field:not(:last-child) {
  border-bottom: .0625rem solid $grey-3;
}
</style>
