<template>
  <div>
    <div v-if="comment" class="comment">
      <img :src="icon" class="comment-icon" />
      <span class="order-table-custom">{{ comment }}</span>
    </div>
    <div v-else>
      <span>{{ comment }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentSection",
  props: {
    comment: String,
    icon: String,
  },
};
</script>

<style scoped>
.comment {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.comment-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
</style>
