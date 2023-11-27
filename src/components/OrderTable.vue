<template>
  <div class="order-table-container">
    <div class="filter-container">
      <label for="dateFilter" class="filter-label-text">Выберите фильтр:</label>
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

    <table class="order-table">
      <thead class="order-table-heading">
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
          <td class="order-table-client_name">
            <b>{{ order.client_name }}</b>
          </td>
          <td>
            <div v-for="(diet, index) in order.diets" :key="index">
              {{ diet }}
              <span v-if="index !== order.diets.length - 1"> <hr /> </span>
            </div>
          </td>
          <td>{{ order.tariff[0] }}</td>
          <td class="order-table-custom">{{ order.address }}</td>
          <td>{{ order.phone }}</td>
          <td>
            <span>{{ formatDateRange(order.dates[0]) }}</span>
          </td>
          <td>{{ order.discount }}%</td>
          <td>{{ order.order_sum }} р.</td>
          <td>{{ order.order_payed }} р.</td>
          <td>{{ order.pay_status }}</td>
          <td>
            <comment-section
              :comment="order.courier_comment"
              :icon="require('@/assets/delivery-icons.png')"
            ></comment-section>
          </td>
          <td>
            <comment-section
              :comment="order.inner_comment"
              :icon="require('@/assets/comment-icons.png')"
            ></comment-section>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CommentSection from "./CommentSection.vue";

export default {
  name: "OrderTable",
  components: {
    CommentSection,
  },
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
      switch (this.selectedDateOption) {
        case "today":
          return this.orders.filter((order) => this.isToday(order.dates));
        case "tomorrow":
          return this.orders.filter((order) => this.isTomorrow(order.dates));
        case "soon":
          return this.orders.filter((order) => this.isSoon(order.dates));
        case "finished":
          return this.orders.filter((order) => this.isFinished(order.dates));
        default:
          return this.orders.slice();
      }
    },
    sortedOrders() {
      return this.filteredOrders.slice().sort(this.compareFunction);
    },
    todayTimestamp() {
      return new Date().setHours(0, 0, 0, 0);
    },
  },
  methods: {
    formatDateRange(date) {
      const options = { day: "2-digit", month: "short" };
      return `${new Date(date.start_date).toLocaleDateString(
        "ru-RU",
        options
      )} - ${new Date(date.end_date).toLocaleDateString("ru-RU", options)}`;
    },
    isToday(dates) {
      const today = new Date().toLocaleDateString("ru-RU");
      return dates.some(
        (date) => new Date(date.end_date).toLocaleDateString("ru-RU") === today
      );
    },
    isTomorrow(dates) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString("ru-RU");
      return dates.some(
        (date) =>
          new Date(date.end_date).toLocaleDateString("ru-RU") === tomorrowStr
      );
    },
    isSoon(dates) {
      return dates.every(
        (date) =>
          new Date(date.start_date).setHours(0, 0, 0, 0) > this.todayTimestamp
      );
    },
    isFinished(dates) {
      return dates.every(
        (date) =>
          new Date(date.end_date).setHours(0, 0, 0, 0) < this.todayTimestamp
      );
    },
    compareFunction(a, b) {
      const fieldA = this.getFieldValue(a);
      const fieldB = this.getFieldValue(b);

      let comparison = 0;
      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }

      return this.sortDesc ? comparison * -1 : comparison;
    },
    getFieldValue(item) {
      return this.sortBy === "o_id"
        ? Number(item[this.sortBy])
        : String(item[this.sortBy]).toLowerCase();
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
.order-table {
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

.order-table-heading {
  background-color: #e0b0ff;
}

.white-row {
  background-color: #fffafa;
}

.violet-row {
  background-color: #f5e6ff;
}

.order-table-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-container {
  text-align: start;
  font-size: 16px;
}

.filter-label-text {
  margin-right: 10px;
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

.order-table-client_name {
  color: #540099;
  text-align: start;
}

.order-table-custom {
  text-align: start;
}
</style>
