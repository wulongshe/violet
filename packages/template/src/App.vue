<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello world!')
const counter = ref(0)
const updateCounter = (offset) => counter.value += offset
</script>

<template>
  <h2>{{message}}</h2>
  <button @click="updateCounter(-1)">-</button>
  <input type="number" v-model="counter" style="width: 40px">
  <button @click="updateCounter(+1)">+</button>
  <h3>{{counter}}</h3>
</template>
