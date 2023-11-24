<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div style="text-align: start; font-size: 16px">
      <label for="dateFilter" style="margin-right: 10px"
        >Выберите фильтр:</label
      >
      <select
        class="filter-select"
        id="dateFilter"
        v-model="selectedDateOption"
        @change="filterOrders"
      >
        <option value="soon">Доставка скоро начнется</option>
        <option value="today">Доставка заканчивается сегодня</option>
        <option value="tomorrow">Доставка заканчивается завтра</option>
        <option value="finished">Доставка закончилась</option>
        <option value="all">Показать все</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="sortTable('o_id')">Заказ</th>
          <th @click="sortTable('client_name')">Имя клиента</th>
          <th>Диеты</th>
          <th>Тариф</th>
          <th>Адрес</th>
          <th>Телефон</th>
          <th>Даты начала и окончания</th>
          <th>Скидка</th>
          <th>Сумма заказа</th>
          <th>Оплачено</th>
          <th @click="sortTable('pay_status')">Статус оплаты</th>
          <th>Комментарий курьера</th>
          <th>Внутренний комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in sortedOrders"
          :key="order.o_id"
          :class="index % 2 === 0 ? 'white-row' : 'violet-row'"
        >
          <td>{{ order.o_id }}</td>
          <td style="color: #540099; text-align: start">
            <b>{{ order.client_name }}</b>
          </td>
          <td>
            <div v-for="(diet, index) in order.diets" :key="index">
              {{ diet }}
              <span v-if="index !== order.diets.length - 1"> <hr /> </span>
            </div>
          </td>
          <td>{{ order.tariff[0] }}</td>
          <td style="text-align: start">{{ order.address }}</td>
          <td>{{ order.phone }}</td>
          <td>
            <span
              >{{ formatDate(order.dates[0].start_date) }} -
              {{ formatDate(order.dates[0].end_date) }}</span
            >
          </td>
          <td>{{ order.discount }}%</td>
          <td>{{ order.order_sum }} р.</td>
          <td>{{ order.order_payed }} р.</td>
          <td>{{ order.pay_status }}</td>
          <td>
            <div v-if="order.courier_comment" class="comment">
              <img
                src="@/assets/delivery-icons.png"
                style="width: 16px; height: 16px; margin-right: 6px"
              />
              <span style="text-align: start">{{ order.courier_comment }}</span>
            </div>
            <div v-else>
              <span>{{ order.courier_comment }}</span>
            </div>
          </td>
          <td>
            <div v-if="order.inner_comment" class="comment">
              <img
                src="@/assets/comment-icons.png"
                style="width: 16px; height: 16px; margin-right: 6px"
              /><span style="text-align: start">{{ order.inner_comment }}</span>
            </div>
            <div v-else>
              <span>{{ order.inner_comment }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "OrderTable",
  data() {
    return {
      sortBy: "client_name",
      sortDesc: false,
      selectedDateOption: "all",
    };
  },
  props: {
    orders: Array,
  },
  computed: {
    filteredOrders() {
      if (this.selectedDateOption === "today") {
        const today = new Date().toLocaleDateString("ru-RU");
        return this.orders.filter((order) =>
          order.dates.some(
            (date) =>
              new Date(date.end_date).toLocaleDateString("ru-RU") === today
          )
        );
      } else if (this.selectedDateOption === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toLocaleDateString("ru-RU");
        return this.orders.filter((order) =>
          order.dates.some(
            (date) =>
              new Date(date.end_date).toLocaleDateString("ru-RU") ===
              tomorrowStr
          )
        );
      } else if (this.selectedDateOption === "soon") {
        const todayTimestamp = new Date().setHours(0, 0, 0, 0);
        return this.orders.filter((order) =>
          order.dates.every(
            (date) =>
              new Date(date.start_date).setHours(0, 0, 0, 0) > todayTimestamp
          )
        );
      } else if (this.selectedDateOption === "finished") {
        const todayTimestamp = new Date().setHours(0, 0, 0, 0);
        return this.orders.filter((order) =>
          order.dates.every(
            (date) =>
              new Date(date.end_date).setHours(0, 0, 0, 0) < todayTimestamp
          )
        );
      } else {
        return this.orders.slice();
      }
    },
    sortedOrders() {
      const compareFunction = (a, b) => {
        const fieldA =
          this.sortBy === "o_id"
            ? Number(a[this.sortBy])
            : String(a[this.sortBy]).toLowerCase();
        const fieldB =
          this.sortBy === "o_id"
            ? Number(b[this.sortBy])
            : String(b[this.sortBy]).toLowerCase();

        let comparison = 0;
        if (fieldA > fieldB) {
          comparison = 1;
        } else if (fieldA < fieldB) {
          comparison = -1;
        }

        return this.sortDesc ? comparison * -1 : comparison;
      };

      return this.filteredOrders.slice().sort(compareFunction);
    },
  },
  methods: {
    formatDate(dateString) {
      const options = { day: "2-digit", month: "short" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },
    sortTable(column) {
      if (column === this.sortBy) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = column;
        this.sortDesc = false;
      }
    },
  },
};
</script>

<style scoped>
table {
  font-size: 12px;
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 2px solid #f8f8ff;
  padding: 5px;
}

th {
  cursor: pointer;
}

thead {
  background-color: #e0b0ff;
}

.white-row {
  background-color: #fffafa;
}

.violet-row {
  background-color: #f5e6ff;
}

.comment {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.filter-select {
  font-size: 14px;
  border-color: #e0b0ff;
  border-width: 2px;
  border-radius: 8px;
  padding: 5px;
}

.filter-select:focus {
  border-color: #e0b0ff;
  outline: none;
}
</style>
