<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import ComposerAndViewer from './components/composerAndViewer.vue';
import SynPeriodicTables from "./components/synPeriodicTables.vue";

</script>

<template>
  <header>
    <h1>Kekule-Vue Component Demos</h1>
  </header>

  <main>
  <section>
    <h2>Composer and Viewer Demo</h2>
    <p>
      Try edit in the composer widget to seen the changes in viewer widget. We use v-model to retrieve chemObj from composer and use vue property to pass it to viewer.
      The event editObjsUpdated is also be observed to force repaint the viewer when the chemObj in composer has been modified.
    </p>
    <pre>
    [Code]:
      &lt;composer ref="composer" vue-predefined-setting="fullFunc" v-model="chemObj" @editObjsUpdated="onComposerEditObjsUpdated"&gt;&lt;/composer&gt;
      &lt;viewer ref="viewer" vue-predefined-setting="basic" :vue-chem-obj="chemObj"&gt;&lt;/viewer&gt;</pre>

    <composer-and-viewer></composer-and-viewer>
  </section>
  <section>
    <h2>Sync Periodic Table Demo</h2>
    <p>
      Select element symbols in both periodic table to see the changes.
      Here v-model are applied to both widget, so the changes in one widget reflect to the other immediately.
      The default and named v-model (v-model:vueSelectedSymbols) are both workable.
    </p>
    <pre>
    [Code]:
      &lt;periodic-table v-model="selectedSymbols" :vue-use-mini-mode="useMiniMode"r&gt;&lt;/periodic-tabler&gt;
      &lt;periodic-table v-model:vueSelectedSymbols="selectedSymbols" :vue-use-mini-mode="useMiniMode"r&gt;&lt;/periodic-tabler&gt;</pre>
    <syn-periodic-tables></syn-periodic-tables>
  </section>
  </main>

  <!--
  <main>
    <TheWelcome />
  </main>
  -->

</template>

<style scoped>

  main, header
  {
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    line-height: 1.5;
  }


  pre
  {
    background-color: #eee;
    width: 90%;
    margin: 0 auto;
    padding: 0.5em;
  }
</style>
