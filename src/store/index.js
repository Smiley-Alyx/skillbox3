import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import {API_BASE_URL} from "../config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
  },
  mutations: {
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
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity,
        };
      });
    }
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map(item => {
          const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
          return {
            ...item,
            product: {
              ...product,
              image: product.image.file.url
            }
          };
        });
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
  actions: {
    loadCart(context) {
      return axios
        .get(API_BASE_URL + `/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          if (typeof context.state.userAccessKey === undefined) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, {productId, amount}) {
      return axios
        .post(API_BASE_URL + `/api/baskets/products`, {
          productId: productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, {productId, amount}) {
      context.commit('updateCartProductAmount', {productId, amount});

      if (amount < 1) {
        return;
      }

      return axios
        .put(API_BASE_URL + `/api/baskets/products`, {
          productId: productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items);

        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, productId) {
      console.log(context.state.userAccessKey);
      return axios
        .delete(API_BASE_URL + `/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey
          },
          data: {
            'productId': productId
          }

        })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    }
  }
});
