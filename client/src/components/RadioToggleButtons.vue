<template>
  <span v-for="item in items" :key="item.id">
    <input :id="getId(item.value)" type="radio" :value="item.value" v-model="value" name="stub">
    <label :for="getId(item.value)">{{ item.title }}</label>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RadioToggleButtons",
  props: ['modelValue', 'items'],
  emits: ['update:modelValue'],
  methods: {
    getId: function (value: string) {
      return `RadioToggleButtons-${value}`;
    }
  },
  computed: {
    value: {
      get(): string {
        return this.modelValue
      },
      set(value: string) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
</script>

<style scoped>
input {
  display: none;
}

label {
  padding: 2px 4px;
  border: 1px solid transparent;
  cursor: pointer;
}

input:checked + label {
  border: 1px solid #41b883;
  cursor: default;
}
</style>