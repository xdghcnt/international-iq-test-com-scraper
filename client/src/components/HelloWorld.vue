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
    <span class="name">{{ result.name }}</span>&nbsp;
    <span class="result">{{ result.value }}</span>&nbsp;
    (<span class="count">{{ result.count }}</span>)
  </li>
</template>

<script>
import Slider from "vue3-slider";
import {computed, ref, watch} from 'vue';
import handleSelectFilterParam from "./handleSelectFilterParam";
import RadioToggleButtons from "./RadioToggleButtons";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  components: {
    Slider,
    RadioToggleButtons
  },

  setup() {
    const minCount = ref(0);
    const maxCount = ref(1);
    const thresholds = ref({});
    const filterParam = ref("countryName");
    const resultsByParam = ref([]);
    const resultsByParamFiltered = computed(() => {
      return resultsByParam.value.filter((resultItem) => {
        return resultItem.count >= thresholds.value[filterParam.value];
      })
    });

    const getOpacity = (resultItem) => {
      return resultItem.count / maxCount.value + 0.2;
    };

    watch(filterParam, (value) => {
      handleSelectFilterParam(value, resultsByParam, minCount, maxCount, thresholds);
    }, {immediate: true});

    return {
      minCount,
      maxCount,
      thresholds,
      resultsByParamFiltered,
      getOpacity,
      filterParam,
      filterValues: [{title: "Countries", value: "countryName"}, {title: "Names", value: "username"}]
    }
  }

}
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
</style>
<style src="@vueform/toggle/themes/default.css"></style>
