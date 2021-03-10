<template>
  <section>
    <b-button
      label="Upload image"
      icon-left="image"
      type="is-primary"
      size="is-medium"
      @click="isModalOpen = true"
    />

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
import { BlockBlobClient } from '@azure/storage-blob';

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
        const blobResult = await fetch(
          `https://sls-weur-dev-imaginess.azurewebsites.net/api/createBlob`,
          {
            method: 'POST',
            body: JSON.stringify({ fileName: this.file.name }),
          }
        );

        const blob = await blobResult.json();

        const client = new BlockBlobClient(blob.writeUrl);
        const matches = this.fileData.match(/^data:(.+);base64,(.+)$/);
        const buffer = Buffer.from(matches[2], 'base64');
        var uploadResult = await client.uploadData(buffer, { blobHTTPHeaders: { blobContentType: matches[1] } });
        if (!uploadResult._response.status >= 400) {
          throw new Error(`Unexpected upload status '${uploadResult._response.status}'`);
        }

        this.$buefy.toast.open({
          message: 'Image uploaded!',
          type: 'is-success',
        });

        const result = await fetch(`https://sls-weur-dev-imaginess.azurewebsites.net/api/createImage`, {
          method: 'POST',
          body: JSON.stringify({ imageName: this.file.name, imageUrl: blob.readUrl }),
        });

        if(result.status >= 400) {
          throw new Error(`Unable to create image status: '${result.status}'`);
        }

        this.isModalOpen = false;
      } catch (err) {
        this.$buefy.toast.open({
          message: 'Unable to upload image!',
          type: 'is-danger',
        });
        throw err;
      } finally {
        this.loading = false;
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
