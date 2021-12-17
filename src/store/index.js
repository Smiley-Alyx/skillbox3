import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import {API_BASE_URL} from "@/config";
import declension from "@/helpers/declension";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
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
      return declension([
        'товар',
        'товара',
        'товаров',
      ], getters.cartTotalProducts);
    },
    orderDetailInfo(state) {
      return state.orderInfo;
    },
    orderDetailProducts(state) {
      return state.orderInfo ? state.orderInfo.basket.items.map(item => {
        const product = item.product;
        return {
          id: item.id,
          amount: item.quantity,
          product: {
            ...product,
            image: product.image.file.url
          }
        };
      }) : {};
    },
    orderTotalProducts(state, getters) {
      return getters.orderDetailProducts.reduce(function (sum, item) {
        return sum + item.amount;
      }, 0);
    },
    orderTotalProductsStr(state, getters) {
      return declension([
        'товар',
        'товара',
        'товаров',
      ], getters.orderDetailProducts);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL + `/api/orders/` + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      return axios
        .get(API_BASE_URL + `/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          //if (typeof context.state.userAccessKey === 'undefined') {
          if (context.state.userAccessKey === null) {
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
