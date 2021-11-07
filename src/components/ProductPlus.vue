<template>
  <button type="button" aria-label="Добавить один товар" @click="increment">
    <svg width="10" height="10" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    increment() {
      this.$emit('input', this.value + 1);
    },
  },
};
</script>
