<template>
  <h1>Информация о заказах</h1>
  <OrderTable :orders="orders" />
</template>

<script>
import OrderTable from "./components/OrderTable.vue";

import data from "./assets/data.json";

export default {
  name: "App",
  components: {
    OrderTable,
  },
  data() {
    return {
      orders: data,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 20px 20px 40px;
}
</style>
