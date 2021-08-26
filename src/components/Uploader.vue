<script>
import { QUploaderBase } from 'quasar';
import uuid from 'uuid/v4';

export default {
  name: 'Uploader',
  mixins: [QUploaderBase],
  props: {
    prefixPath: {
      type: String
    }
  },
  computed: {
    isUploading() {
      return this.uploading;
    },
    isBusy() {
      return this.uploading;
    }
  },
  data() {
    return {
      uploading: false,
      filesUploading: []
    };
  },
  methods: {
    abort() {},
    updateComponent(index, snapshot, status = 'uploading') {
      const file = this.files[index],
        uploadSize =
          typeof snapshot === 'object' ? snapshot.bytesTransferred : 0;
      this.__updateFile(file, status, uploadSize);
    },
    upload() {
      if (this.canUpload === false) {
        return;
      }
      this.uploading = true;
      this.queuedFiles.forEach(file => {
        this.filesUploading.push(this.uploadFileToFirestore(file));
      });
      Promise.all(this.filesUploading)
        .then(() => {
          this.uploading = false;
        })
        .catch(err => {
          this.$q.notify({
            color: 'negative',
            message: `Um ou mais arquivos não foram carregados. ${err}`
          });
        });
    },
    uploadFileToFirestore(file) {
      if (
        file.type.split('/')[1] ==
        'vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        var fileSuffix = 'docx';
      }
      if (
        file.type.split('/')[1] ==
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        var fileSuffix = 'xlsx';
      } else {
        var fileSuffix = file.type.split('/')[1];
      }

      const { storageRef } = this.$fb,
        index = this.filesUploading.length,
        name = uuid(),
        uploadImageStorageRef = storageRef(
          `${this.prefixPath}${name}.${fileSuffix}`
        ),
        profileImageStorageRef = uploadImageStorageRef.put(file),
        STATE_CHANGED = this.$fb.self().storage.TaskEvent.STATE_CHANGED;
      return new Promise((resolve, reject) => {
        profileImageStorageRef.on(
          STATE_CHANGED,
          snapshot => {
            this.updateComponent(index, snapshot);
          },
          err => {
            this.$q.notify({
              color: 'negative',
              message: `Ocorreu um problema com o upload. ${err}`
            });
            this.updateComponent(index, 0, 'failed');
            reject();
          },
          () => {
            this.uploadedFiles = this.uploadedFiles.concat(this.files);
            this.queuedFiles = [];
            this.filesUploading = [];
            this.files.forEach(async f => {
              this.updateComponent(index, 0, 'uploaded');
              if (
                f.__uploaded == file.__uploaded &&
                file.__status == 'uploaded'
              ) {
                let link = await profileImageStorageRef.snapshot.ref.getDownloadURL();
                this.$emit('uploaded', {
                  type: fileSuffix,
                  link: link,
                  name: name + '.' + fileSuffix
                });
              }
            });
            resolve();
          }
        );
      });
    }
  }
};
</script>
