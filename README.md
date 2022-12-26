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
      // each of widget's property will map to the wrapped Vue component's property naming with 'vue' prefix, e.g. 'enableOperHistory' to 'vueEnableOperHistory'
      exposeWidgetPropertiesToVueProps: true,
      // explicitly set property names exposed to Vue
      //exposedProperties: []
      // property names hide from Vue
      ignoredProperties: ['editorNexus', 'actionMap'],
      // whether enable v-model binds in this widget
      enableVModel: true,
      // which Kekule property should be bound to default v-model,
      defaultModelValuePropName: 'chemObj',
      // if true, parametered v-model can be used on all properties of Kekule widget, e.g. v-model:vueEnableOperHistory (note property name prefixed with 'vue') 
      enableVModelOnAllProperties: true
    });

export { Composer };

```

Then the wrapped component can be utilized in Vue application:

```vue
<!-- App.vue -->
<template>
  <!-- composer component with vue prop and event settings, default v-model bound to chemObj and v-model:vueSelection to selection -->
  <composer ref="composer" 
            initial-predefined-setting="molOnly" :initial-enable-oper-history="false"  
            v-model="chemObj" v-model:vueSelection="selection"
            @selection-change="composerSelectionChange">
  </composer>
  <label>{{ (selection || []).length }} object(s) selected</label>
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
  data()
  {
    return {
      chemObj: undefined,
      selection: undefined
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
(```{exposeWidgetEvents: true, 'exposeWidgetPropertiesToVueProps': true, 'enableVModel': true, 'enableVModelOnAllProperties': true}```),
you can use them directly:

```vue
<!-- App.vue -->
<script>
import 'kekule';   // yes, you should import kekule package too.
import 'kekule/theme';
import { Components } from 'kekule-vue';
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

Several util methods are also wrapped in the Vue component to access the widget:
                                                                      
* ``vueComponent.getWidgetPropValue(kekulePropName)``: returns the property value of the wrapped Kekule widget;
* ``vueComponent.setWidgetPropValue(kekulePropName, value)``: sets the property value of the wrapped Kekule widget;
* ``vueComponent.getWidget()``: returns the wrapped Kekule widget instance itself.

Inside the wrapped Kekule widget, method ``kekuleWidget.getVueComponent()`` can be used to retrieve the wrapper Vue component.
E.g.:

```javascript
console.log(vueComponent.getWidget().getVueComponent() === vueComponent);  // true
console.log(vueComponent.getWidgetPropValue('enabled') === vueComponent.getWidget().enabled);  // true
```

You may also check the simple demo at the ``/demo``  directory of this repository to learn more.
