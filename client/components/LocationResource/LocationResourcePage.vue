<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(["title", "description"]);
</script>

<template>
<p>Title: {{ props.title }}</p>
<p>Project Descriptions: {{ $props.description }}</p>
<p>List of posts: Empty</p>
<p>Actionables: Empty</p>
</template>

<style scoped>
</style>