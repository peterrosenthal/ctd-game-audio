import { midiToSequenceProto } from '@magenta/music/es6/core'

export default class MidiUpload {
  fileInput: HTMLInputElement;

  constructor(parent: HTMLElement) {
    // bind event listeners
    this.onFileInputChange = this.onFileInputChange.bind(this);

    // create the file upload element
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.addEventListener('change', this.onFileInputChange);
    parent.appendChild(this.fileInput);
  }

  onFileInputChange(): void {
    if (this.fileInput.files === null || this.fileInput.files === undefined) {
      return;
    }
    const fileReader = new FileReader()
    fileReader.onload = function() {
      if (fileReader.result instanceof ArrayBuffer) {
        console.log(midiToSequenceProto(fileReader.result));
      }
    };
    for (let file of this.fileInput.files) {
      fileReader.readAsArrayBuffer(file);
    }
  }
}