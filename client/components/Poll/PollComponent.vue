<script setup lang="ts">
const props = defineProps(["poll"]);

</script>

<template>
<div class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
    <h5 class="text-xl font-bold dark:text-white">{{ props.poll.prompt }}</h5>
    <p>Body</p>
    {{ props.poll }}
</div>


</template>

<style scoped>
</style>