<template>
  <div>
    <p>Counter! {{count}}</p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Counter extends Vue {
  public count: number = 0;
}
</script>
