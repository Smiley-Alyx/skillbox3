import Vue from 'vue';
import Vuex from 'vuex';
import products from '@/data/products';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [
      {
        productId: 1,
        amount: 3,
      },
    ],
  },
  mutations: {
    addProductToCart(state, { productId, amount }) {
      const item = state.cartProducts.find(
        (item) => item.productId === productId,
      );

      if (item) {
        item.amount += amount;
      } else {
        state.cartProducts.push({
          productId,
          amount,
        });
      }
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find(
        (item) => item.productId === productId,
      );

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(
        (item) => item.productId !== productId,
      );
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map(
        (item) => {
          return {
            ...item,
            product: products.find(
              (p) => p.id === item.productId,
            ),
          };
        },
      );
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => (item.product.price * item.amount) + acc, 0,
      );
    },
    cartTotalProducts(state) {
      return state.cartProducts.reduce(function (sum, item) {
        return sum + item.amount;
      }, 0);
    },
    cartTotalProductsStr(state, getters) {
      const totalProducts = getters.cartTotalProducts;
      const titles = [
        'товар',
        'товара',
        'товаров',
      ];
      const cases = [2, 0, 1, 1, 1, 2];
      const casesIn = cases[(totalProducts % 10 < 5) ? totalProducts % 10 : 5];

      return titles[
        (totalProducts % 100 > 4 && totalProducts % 100 < 20) ? 2 : casesIn
      ];
    },
  },
});
