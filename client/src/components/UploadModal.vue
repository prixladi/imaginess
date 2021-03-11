<template>
  <section>
    <b-button label="Upload image" icon-left="image" type="is-primary" size="is-medium" @click="isModalOpen = true" />
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
            <b-upload accept="image/jpeg" v-model="file" drag-drop expanded>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"></b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
          <b-image class="image" v-else :src="fileData" />
        </div>
        <footer v-if="!!fileData" class="modal-card-footer">
          <p class="modal-card-title">Login</p>
          <b-button
            label="Upload"
            icon-left="image"
            type="is-primary"
            size="is-medium"
            @click="upload"
            :loading="loading"
          />
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { createBlob, uploadFile, createImage } from '../requests';

export default {
  name: 'HelloWorld',
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
