<template>
  <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script>
export default {
  name: "demoSelector",
  props:['modelValue'],
  data()
  {
    return {
      options: [
        //{ text: 'Please select a demo...', value: undefined },
        { text: 'Composer internal information retrieve', value: '1' },
        { text: 'Composer and Viewer', value: '2' },
        { text: 'Synchronized periodic tables', value: '3' }
      ]
    }
  }
}
</script>

<style scoped>

</style>