<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./LoginForm.vue";
import MoreInfoForm from "./MoreInfoForm.vue";
import RegisterForm from "./RegisterForm.vue";

let creatingAccount = ref(false);
let newlyRegistered = ref(false);

function changeToRegister() {
    creatingAccount.value = true;
    console.log("account bool now", creatingAccount);
}

function changeToLogin() {
    creatingAccount.value = false;
    console.log("account bool now", creatingAccount);
}

function changeToMoreInfo() {
    newlyRegistered.value = true;
}

</script>

<template>
    <body>
        <div class="logo">
            <img src="@/assets/images/knowsy_logo.png">
        </div>
        <div class="container">
            <div class="options" v-if="!newlyRegistered">
                <div class="option">
                    <button @click="changeToLogin" :class="{ underline: !creatingAccount }">I Have an Account </button>
                </div>
                <div class="option">
                    <button @click="changeToRegister" :class="{ underline: creatingAccount }">Create an Account
                    </button>
                </div>
            </div>
            <div v-if="creatingAccount">
                <MoreInfoForm v-if="newlyRegistered" />
                <RegisterForm v-else @change-to-more-info="changeToMoreInfo" />
            </div>
            <div v-else>
                <LoginForm />
            </div>
        </div>
    </body>
</template>

<style scoped>
html {
    height: 100%;
}

body {
    /* Remember to use the other versions for IE 10 and older browsers! */
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100%;
}

.container {

    width: 500px;
    height: 300px;
    background-color: #FBFBFB;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    backdrop-filter: blur(10px);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    gap: 4 em;
}


.options {
    display: flex;
    flex-direction: row;
    gap: 4em;
}


.underline {
    text-decoration: underline;
}
</style>
