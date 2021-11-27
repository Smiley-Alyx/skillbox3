<template>
  <button type="button" aria-label="Убрать один товар" @click="decrement">
    <svg width="10" height="10" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    decrement() {
      this.$emit('input', (parseInt(this.value)) > 1 ? parseInt(this.value) - 1 : 1);
    },
  },
};
</script>
