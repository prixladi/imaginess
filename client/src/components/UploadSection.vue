<template>
  <b-upload accept="image/*" :value="value" @input="$emit('input', $event)" drag-drop expanded>
    <section class="section">
      <div class="content has-text-centered">
        <p>
          <b-icon icon="upload" size="is-large"></b-icon>
        </p>
        <p>Drop your files here or click to upload</p>
      </div>
    </section>
  </b-upload>
</template>

<script>
export default {
  name: 'UploadSection',
  props: {
    value: { type: File },
  },
};
</script>