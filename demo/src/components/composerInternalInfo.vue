<template>
  <section class="stage">
    <ul>
      <li>{{ labelHotTracked }}</li>
      <li>Select {{ (selection || []).length }} object(s)</li>
      <li>The object inspector is {{ getVisibleLabel(showObjInspector) }} and the issue inspector is {{ getVisibleLabel(showIssueInspector) }}</li>
    </ul>
    <composer class="composer" vue-predefined-setting="fullFunc"
              v-model:vueSelection="selection" v-model:vueHotTrackedObjs="hotTrackedObjs"
              v-model:vueShowObjInspector="showObjInspector" v-model:vueShowIssueInspector="showIssueInspector"></composer>
  </section>
</template>

<script>
import { Kekule } from 'kekule/mod/chemWidget';
import 'kekule/theme';
import { Components } from 'kekule-vue';


let Composer = Components.Composer;

export default {
  name: "composerInternalInfo",
  components: { Composer },
  data()
  {
    return {
      selection: undefined,
      hotTrackedObjs: undefined,
      showObjInspector: undefined,
      showIssueInspector: undefined
    }
  },
  computed: {
    labelHotTracked()
    {
      if ((this.hotTrackedObjs || []).length > 0)
        return 'Now hot tracked on: ' + this.hotTrackedObjs[0].getClassName();
      else
        return 'No hot tracked object';
    }
  },
  methods:
  {
    getVisibleLabel(visible)
    {
      return visible? 'Visible': 'Invisible';
    }
  }
}
</script>

<style scoped>
  .stage
  {
    display: flex;
    flex-direction: column;
    height: 500px;
    min-width: 600px;
  }
  .composer
  {
    flex: 1 1 auto;
    margin: 0;
  }
</style>