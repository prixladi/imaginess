<template>
  <div id="app">
    <div v-if="!!image" @click="isModalOpen = true" class="imgWrapper">
      <b-image :src="image.url" ratio="5by3" :rounded="true" />
    </div>

    <b-modal v-if="!!image" v-model="isModalOpen">
      <b-image :src="image.url" />
    </b-modal>

    <b-button
      class="marginAround"
      label="Random image"
      icon-left="image"
      type="is-primary"
      size="is-medium"
      :loading="loading"
      @click="fetchRandomImage"
    />
    <UploadModal />
  </div>
</template>

<script>
import UploadModal from './components/UploadModal.vue';
import { getRandomImage } from './requests';

export default {
  name: 'Main',
  components: {
    UploadModal,
  },
  data: () => ({ image: null, loading: false, isModalOpen: false }),
  methods: {
    async fetchRandomImage() {
      this.loading = true;
      try {
        this.image = await getRandomImage();
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await this.fetchRandomImage();
  },
};
</script>

<style>
body {
  background-color: #242629;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 100em;
  margin: auto;
  padding: 0.5em;
  padding-top: 2em;
}

.imgWrapper {
  max-width: 50em;
  margin: auto;
}

.marginAround {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
