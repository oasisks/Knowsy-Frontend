<script setup lang="ts">
import { storeToRefs } from 'pinia';
import LocationResourcePage from '../components/LocationResource/LocationResourcePage.vue';
import { useUserStore } from '../stores/user';

const {isLoggedIn} = storeToRefs(useUserStore());
</script>

<template>
    <div v-if="isLoggedIn">
        <LocationResourcePage :id="$route.params._id" />
    </div>
    <div v-else>
        <p>Please log in</p>
    </div>
</template>

<style scoped>

</style>