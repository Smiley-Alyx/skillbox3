<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">
      {{
        $store.state.cartProducts.reduce(function (sum, item) {
          return sum + item.amount;
        }, 0)
      }}
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'CartIndicator',
};
</script>

<style scoped>

</style>
