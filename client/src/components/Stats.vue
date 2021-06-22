<template>
  <div class="hello">
    <RadioToggleButtons
        v-model="filterParam"
        :items="filterValues"
    />
    <br/><br/>
    <Slider v-model="thresholds[filterParam]" :min="minCount" :max="maxCount" tooltip color="#FB278D"
            track-color="#FEFEFE"/>
  </div>
  <br/>
  <li v-for="result in resultsByParamFiltered" :key="result.name" :style="{opacity: getOpacity(result)}">
    <span class="name">
      <img alt="" v-if="filterParam === 'countryName'" :src="`https://international-iq-test.com${result.flagImg}`"/>
      {{ result.name }}
    </span>&nbsp;
    <span class="result">{{ result.value }}</span>&nbsp;
    (<span class="count">{{ result.count }}</span>)
  </li>
  <br/>
  <i>Last record added {{ lastRecordAddTime }} ({{ totalRecords }} total)</i>
</template>

<script lang="ts">
import Slider from "vue3-slider";
import { computed, defineComponent, ref, watch } from 'vue';
import handleSelectFilterParam from "./handleSelectFilterParam";
import RadioToggleButtons from "./RadioToggleButtons.vue";
import { Ref } from "@vue/reactivity";
import { DataEntry, DataEntryGroup } from "@/components/interface";

export default defineComponent({
  name: 'Stats',
  components: {
    Slider,
    RadioToggleButtons
  },

  setup() {
    const statsData: Ref<DataEntry[]> = ref([]);
    const lastRecordAddTime = ref("never");
    const minCount = ref(0);
    const maxCount = ref(1);
    const totalRecords = ref(0);
    const thresholds: Ref<Partial<Record<keyof DataEntry, number>>> = ref({});
    const filterParam: Ref<keyof DataEntry> = ref("countryName");
    const resultsByParam: Ref<DataEntryGroup[]> = ref([]);
    const resultsByParamFiltered: Ref<DataEntryGroup[]> = computed(() => {
      return resultsByParam.value.filter((resultItem) => {
        return resultItem.count >= thresholds.value[filterParam.value]!;
      })
    });
    const getStatsData = async () => {
      statsData.value = await (await fetch("/studies/iq/data")).json() as DataEntry[];
    };

    const getOpacity = (resultItem: DataEntryGroup) => {
      return resultItem.count / maxCount.value + 0.5;
    };

    getStatsData();
    setInterval(getStatsData, 60000);

    watch([filterParam, statsData], ([value]) => {
      handleSelectFilterParam(statsData.value, value, resultsByParam,
          minCount, maxCount, thresholds, lastRecordAddTime, totalRecords);
    }, { immediate: true });

    return {
      minCount,
      maxCount,
      thresholds,
      resultsByParamFiltered,
      getOpacity,
      filterParam,
      filterValues: [{ title: "Countries", value: "countryName" }, { title: "Names", value: "username" }],
      lastRecordAddTime,
      totalRecords
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}

span.result {
  font-size: 23px;
  vertical-align: sub;
  line-height: 31px;
}

.name img {
  width: 19px;
  vertical-align: middle;
}
</style>
<style src="@vueform/toggle/themes/default.css"></style>
