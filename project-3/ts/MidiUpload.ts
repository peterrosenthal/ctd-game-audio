import { sequences, midiToSequenceProto } from '@magenta/music/es6'; 
import Plant from './Plant';

export default class MidiUpload {
  private fileInput: HTMLInputElement;
  private fileReader: FileReader;

  constructor(parent: HTMLElement) {
    // bind event listeners
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.fileToMidi = this.fileToMidi.bind(this);

    // create file reader
    this.fileReader = new FileReader();
    this.fileReader.onload = this.fileToMidi;

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
    for (let file of this.fileInput.files) {
      this.fileReader.readAsArrayBuffer(file);
    }
  }

  fileToMidi(): void {
    if (this.fileReader.result instanceof ArrayBuffer) {
      new Plant(sequences.quantizeNoteSequence(midiToSequenceProto(this.fileReader.result), 2));
    }
  }
}