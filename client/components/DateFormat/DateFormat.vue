<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';

// the date is takes is of type Date
const props = defineProps(["date"]);
const timeString = ref("");

onMounted(() => {
    const currentTime = new Date();
    const diff = currentTime.getTime() - props.date.getTime();
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = weeks / 4.345;
    const years = months / 12;

    if (seconds < 60) {
        timeString.value = `${Math.floor(seconds)} second(s) ago`
    } else if (minutes < 60) {
        const minute = Math.floor(minutes);
        const remainingSeconds = Math.floor(seconds - minute * 60);
        const minuteString = ((minute === 1) ? "minute" : "minutes");
        timeString.value = `${minute} ${minuteString} and ${remainingSeconds} seconds ago`;
    } else if (hours < 24) {
        const hour = Math.floor(hours);
        const remainingMinutes = Math.floor(minutes - hour * 60);
        const hourString = ((hour === 1) ? "hour" : "hours");
        timeString.value = `${hour} ${hourString} and ${remainingMinutes} minutes ago`
    } else if (days < 7) {
        const day = Math.floor(days);
        const remainingHour = Math.floor(hours - day * 24);
        const dayString = ((day === 1) ? "day" : "days");
        timeString.value = `${day} ${dayString} and ${remainingHour} hours ago`;
    } else if (weeks < 4.345) {
        const week = Math.floor(weeks);
        const remainingDays = Math.floor(days - week * 7);
        const weekString = ((week === 1) ? "week" : "weeks");
        timeString.value = `${week} ${weekString} and ${remainingDays} days ago`;
    } else if (months < 12) {
        const month = Math.floor(months);
        const monthString = ((month === 1) ? "month" : "months");
        timeString.value = `${month} ${monthString} ago`;
    } else {
        const options: Intl.DateTimeFormatOptions = { month: "long" };
        const monthName = new Intl.DateTimeFormat("en-US", options).format(props.date);
        const day = props.date.getDate();
        const year = props.date.getFullYear();
        timeString.value = `${monthName} ${day}, ${year}`
    }
})
</script>

<template>
<div>
    <p class="mb-3 text-sm text-gray-500">Last Updated: {{ timeString }}</p>
</div>
</template>

<style scoped>

</style>