<template>
  <b-button
    :label="label"
    icon-left="image"
    type="is-primary"
    size="is-medium"
    @click="$emit('click')"
    :loading="loading"
  />
</template>

<script>
export default {
  name: 'ImageButton',
  props: {
    label: String,
    loading: Boolean,
  },
};
</script>
