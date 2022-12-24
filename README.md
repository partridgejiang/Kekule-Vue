# Kekule-Vue
[Vue](https://github.com/vuejs/vue) component wrapper for [Kekule.js](https://github.com/partridgejiang/Kekule.js) widgets.

## Usage

Use the following codes to wrap a Kekule.js widget class to Vue component:

```javascript
// kekulevue-composer.js
import { Kekule } from 'kekule';
import { KekuleVue } from 'kekule-vue';

let Composer = KekuleVue.Utils.wrapWidget(Kekule.Editor.Composer, 
    {
      // Vue events will be emitted when Kekule events being invoked in widget 	
      exposeWidgetEvents: true,	
      // each of widget's property will map to the wrapped Vue component's computed property	
      exposeWidgetPropertiesToVueComputes: true,  
      // each of widget's property will map to the wrapped Vue component's property naming with 'initial' prefix, e.g. 'enableOperHistory' to 'initialEnableOperHistory'
      exposeWidgetPropertiesToVueProps: true,
      // explicitly set property names exposed to Vue
      //exposedProperties: []
      // property names hide from Vue
      ignoredProperties: ['editorNexus', 'actionMap']
    });

export { Composer };

```

Then the wrapped component can be utilized in Vue application:

```vue
<!-- App.vue -->
<template>
  <!-- composer component with vue prop and event settings -->
  <composer ref="composer" 
            initial-predefined-setting="molOnly" :initial-enable-oper-history="false"  
            @selection-change="composerSelectionChange">
  </composer>
</template>
<script>
import { Composer } from './kekule-composer.js';
import 'kekule/theme';
export default {
  name: "App.vue",
  components: { Composer },
  methods: {
    composerSelectionChange(e)
    {
      console.log('Composer selection change', e.name, e.vueComponent, e.widget);
    }
  },

  mounted()
  {
    this.$refs.composer.showObjInspector = true;
    console.log(this.$refs.composer.getWidget()); // the Kekule widget object
    console.log(this.$refs.composer.getWidget().getVueComponent() === this.$refs.composer);  // true
  }
}
</script>
```

Some common-used Kekule widgets has already been wrapped with default options 
(```{exposeWidgetEvents: true, exposeWidgetPropertiesToVueComputes: true, 'exposeWidgetPropertiesToVueProps': true}```),
you can use them directly:

```vue
<!-- App.vue -->
<script>
import { Components } from 'kekule-vue';
import 'kekule/theme';
export default {
  name: "App.vue",
  components: {
    PeriodicTable: Components.PeriodicTable, 
    Viewer: Components.Viewer, 
    SpectrumInspector: Components.SpectrumInspector, 
    SpectrumObjInserter: Components.SpectrumObjInserter, 
    ChemObjInserter: Components.ChemObjInserter, 
    Composer: Components.Components
  }
}
</script>
```
