<script>
import DemoSelector from "./components/demoSelector.vue";
import ComposerInternalInfo from "./components/composerInternalInfo.vue";
import ComposerAndViewer from './components/composerAndViewer.vue';
import SynPeriodicTables from "./components/synPeriodicTables.vue";

export default {
  name: "App.vue",
  components: {
    DemoSelector, ComposerInternalInfo, ComposerAndViewer, SynPeriodicTables
  },
  data()
  {
    return {
      selectedDemoIndex: '1'
    }
  }
}
</script>

<template>
  <header>
    <h1>Kekule-Vue Component Demos {{selectedDemoIndex}}</h1>
  </header>

  <main>
  <section>
    <label>
      Select the demo: <demo-selector v-model="selectedDemoIndex"></demo-selector>
    </label>
  </section>

  <template v-if="selectedDemoIndex==='1'">
  <section>
    <h2>Composer Internal Information Demo</h2>
    <p>
      Try do some manipulations in the composer widget and check the live-updated information on the list.
      Vue property <i>vue-predefined-setting</i> is used here to set to the initial property value of composer widget.
      Several parameterized v-models are used to synchronize data between composer widget and information list.
    </p>
    <pre>
[Code]:
  &lt;composer class="composer" vue-predefined-setting="fullFunc"
      v-model:vueSelection="selection" v-model:vueHotTrackedObjs="hotTrackedObjs"
      v-model:vueShowObjInspector="showObjInspector" v-model:vueShowIssueInspector="showIssueInspector"&gt;&lt;/composer&gt;</pre>

    <composer-internal-info></composer-internal-info>
  </section>
  </template>

  <template v-if="selectedDemoIndex==='2'">
  <section>
    <h2>Composer and Viewer Demo</h2>
    <p>
      Try edit in the composer widget to seen the changes in viewer widget. We use v-model to retrieve chemObj from composer and use vue property to pass it to viewer.
      The event userModificationDone is also be observed to force repaint the viewer when the chemObj in composer has been modified
      (since the viewer widget do not have a automatically refresh mechanism to the chem object's changes).
    </p>
    <pre>
    [Code]:
      &lt;composer ref="composer" vue-predefined-setting="fullFunc" v-model="chemObj" @userModificationDone="onComposerUserModificationDone"&gt;&lt;/composer&gt;
      &lt;viewer ref="viewer" vue-predefined-setting="basic" :vue-chem-obj="chemObj"&gt;&lt;/viewer&gt;</pre>

    <composer-and-viewer></composer-and-viewer>
  </section>
  </template>

  <template v-if="selectedDemoIndex==='3'">
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
  </template>

  </main>

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
