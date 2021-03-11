<template>
  <section>
    <ImageButton label="Upload image" @click="isModalOpen = true" />
    <b-modal
      v-model="isModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Upload image</p>
          <button type="button" class="delete" @click="isModalOpen = false" />
        </header>
        <div class="modal-card-body">
          <b-field v-if="!fileData">
            <UploadSection v-model="file" />
          </b-field>
          <b-image class="image" v-else :src="fileData" />
        </div>
        <footer v-if="!!fileData" class="modal-card-footer">
          <p class="modal-card-title">Login</p>
          <ImageButton label="Upload" @click="upload" :loading="loading" />
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { createBlob, uploadFile, createImage } from '../requests';
import UploadSection from './UploadSection';
import ImageButton from './ImageButton';

export default {
  name: 'UploadModal',
  components: { UploadSection, ImageButton },
  data: () => ({ isModalOpen: false, file: null, fileData: null, loading: false }),
  watch: {
    file: function() {
      if (!this.file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => (this.fileData = e.target.result);
      reader.readAsDataURL(this.file);
    },
    isModalOpen: function() {
      this.fileData = null;
      this.file = null;
    },
  },
  methods: {
    async upload() {
      this.loading = true;
      try {
        const blob = await createBlob(this.file.name);
        await uploadFile({ writeUrl: blob.writeUrl, fileData: this.fileData });
        await createImage({ imageUrl: blob.readUrl, imageName: this.file.name });

        this.$buefy.toast.open({
          message: 'Image uploaded!',
          type: 'is-success',
        });
      } catch (err) {
        this.$buefy.toast.open({
          message: 'Unable to upload image!',
          type: 'is-danger',
        });
        throw err;
      } finally {
        this.loading = false;
        this.isModalOpen = false;
      }
    },
  },
};
</script>

<style scoped>
.img {
  max-width: 100%;
  height: 80vh;
}
</style>
