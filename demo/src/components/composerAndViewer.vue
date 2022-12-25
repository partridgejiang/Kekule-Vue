<template>
  <section class="stage">
    <composer id="composer" ref="composer" vue-predefined-setting="fullFunc" v-model="chemObj" @editObjsUpdated="onComposerEditObjsUpdated"></composer>
    <viewer id="viewer" ref="viewer" vue-predefined-setting="basic" :vue-render-type="2" :vue-chem-obj="chemObj"></viewer>
  </section>
</template>

<script>
import { Kekule } from 'kekule/mod/chemWidget';
import 'kekule/theme';
import { Components } from 'kekule-vue';


let Viewer = Components.Viewer;
let Composer = Components.Composer;

export default {
  name: "composerAndViewer",
  components: {Viewer, Composer},
  data()
  {
    return {
      'chemObj': undefined
    }
  },
  mounted()
  {
    this.$refs.composer.getWidget().newDoc();
  },
  methods: {
    onComposerEditObjsUpdated()
    {
      this.$refs.viewer.getWidget().repaint();
    }
  }
}
</script>

<style scoped>
  .stage
  {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    min-width: 400px;
  }
  #composer, #viewer
  {
    flex: 1 1 auto;
    min-width: 300px;
    min-height: 200px;
    margin: 0.5em;
    border-radius: 0.2em;
  }

  #viewer
  {
    background-color: #fff;
    border: 1px solid #ccc;
    /*overflow: hidden;*/
  }

  @media (min-width: 1024px) {
    .stage
    {
      flex-direction: row;
    }
  }

</style>