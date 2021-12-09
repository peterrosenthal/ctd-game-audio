import { sequences, midiToSequenceProto } from '@magenta/music/es6'; 
import Plant from '../Plant';
import Component from './Component';

export default class MidiUpload extends Component {
  private fileReader: FileReader;
  private fileInput: HTMLInputElement;
  private interactionArea: HTMLImageElement;

  constructor() {
    super();

    // bind event listeners
    this.onFileReaderLoad = this.onFileReaderLoad.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.onInteractionAreaClick = this.onInteractionAreaClick.bind(this);
    this.onInteractionAreaDrag = this.onInteractionAreaDrag.bind(this);
    this.onInteractionAreaDrop = this.onInteractionAreaDrop.bind(this);

    // create file reader
    this.fileReader = new FileReader();
    this.fileReader.onload = this.onFileReaderLoad;

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '8em';
    this.element.style.height = '8em';
    this.element.style.display = 'flex';
    this.element.style.flexFlow = 'row';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';

    // create the file upload element
    this.fileInput = document.createElement('input');
    this.fileInput.style.display = 'none';
    this.fileInput.type = 'file';
    this.fileInput.addEventListener('change', this.onFileInputChange);
    this.element.appendChild(this.fileInput);

    // create the clickable/drag-droppable area
    this.interactionArea = document.createElement('img');
    this.interactionArea.style.width = '80%';
    this.interactionArea.style.height = '80%';
    this.interactionArea.style.cursor = 'pointer';
    this.interactionArea.src = './images/plus.svg';
    this.interactionArea.addEventListener('click', this.onInteractionAreaClick);
    this.interactionArea.addEventListener('dragenter', this.onInteractionAreaDrag);
    this.interactionArea.addEventListener('dragover', this.onInteractionAreaDrag);
    this.interactionArea.addEventListener('drop', this.onInteractionAreaDrop);
    this.element.appendChild(this.interactionArea);
  }

  onFileReaderLoad(): void {
    if (this.fileReader.result instanceof ArrayBuffer) {
      new Plant(sequences.quantizeNoteSequence(midiToSequenceProto(this.fileReader.result), 2));
    }
  }

  onFileInputChange(): void {
    if (this.fileInput.files === null || this.fileInput.files === undefined) {
      return;
    }
    for (let file of this.fileInput.files) {
      this.fileReader.readAsArrayBuffer(file);
    }
  }

  onInteractionAreaClick(): void {
    this.fileInput.click();
  }

  onInteractionAreaDrag(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  onInteractionAreaDrop(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();

    console.log('dropped!');

    if (e.dataTransfer === null || e.dataTransfer === undefined) {
      return;
    }
    for (let file of e.dataTransfer.files) {
      this.fileReader.readAsArrayBuffer(file);
    }
  }
}