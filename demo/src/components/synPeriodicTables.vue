<template>
  <p>
    <label>Use mini mode: <input type="checkbox" v-model="useMiniMode" /></label>
    <label>Selected symbols: {{ selectedSymbols.join(', ') }}</label>
  </p>
  <section class="stage">
    <periodic-table class="ptable" ref="ptable1" v-model="selectedSymbols" :vue-use-mini-mode="useMiniMode"></periodic-table>
    <periodic-table class="ptable" ref="ptable2" v-model:vueSelectedSymbols="selectedSymbols" :vue-use-mini-mode="useMiniMode"></periodic-table>
  </section>
</template>

<script>
import { Kekule } from 'kekule/mod/chemWidget';
import 'kekule/theme';
import { Components } from 'kekule-vue';

let PeriodicTable = Components.PeriodicTable;

export default {
  name: "synPeriodicTables",
  components: {PeriodicTable},
  data()
  {
    return {
      'selectedSymbols': ['C', 'H'],
      'useMiniMode': true,
    }
  }
}


</script>

<style scoped>
  .stage
  {
    /*display: flex;*/
    /*flex-direction: row;*/
    min-height: 400px;
  }
  .ptable
  {
    /*flex: 0 0 auto;*/
    display: inline-block;
    margin: 0.5em;
  }

  label
  {
    margin: 0.2em 1em;
  }
</style>