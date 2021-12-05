<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      >
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <div class="product__counter form__counter">
      <ProductMinus v-model="amount"/>
      <input type="text" v-model.number="amount" name="count" oninput="if(this.value < 1) this.value = 1;">
      <ProductPlus v-model="amount"/>
    </div>

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapMutations } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import ProductPlus from '@/components/ProductPlus.vue';
import ProductMinus from '@/components/ProductMinus.vue';

export default {
  props: ['item'],
  components: {
    ProductPlus,
    ProductMinus,
  },
  filters: {
    numberFormat,
  },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch(
          'updateCartProductAmount',
          {
            productId: this.item.productId,
            amount: value,
          },
        );
      },
    },
  },
  methods: {
    ...mapMutations({
      deleteProduct: 'deleteCartProduct',
    }),
    productIncrement() {

    },
    deleteProduct(productId) {
      this.$store.dispatch('deleteCartProduct', productId);
    },
  },
};
</script>
