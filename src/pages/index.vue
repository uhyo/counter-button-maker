<template>
<div>
<h1>Hello</h1>
<p>{{message}}</p>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Index extends Vue {
  public message: string = 'world!';
}
</script>
