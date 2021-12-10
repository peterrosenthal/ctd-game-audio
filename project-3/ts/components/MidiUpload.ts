import { sequences, midiToSequenceProto } from '@magenta/music/es6'; 
import GameManager from '../GameManager';
import Plant from '../Plant';
import Component from './Component';
import Parent from './Parent';

export default class MidiUpload extends Component {
  private parent: Parent;
  private fileReader: FileReader;
  private fileInput: HTMLInputElement;
  private interactionArea: HTMLImageElement;

  constructor(parent: Parent) {
    super();

    this.parent = parent;

    // bind event listeners
    this.onFileReaderLoad = this.onFileReaderLoad.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.onInteractionAreaClick = this.onInteractionAreaClick.bind(this);
    this.onInteractionAreaDrag = this.onInteractionAreaDrag.bind(this);
    this.onInteractionAreaDrop = this.onInteractionAreaDrop.bind(this);
    this.onInteractionAreaMouseEnter = this.onInteractionAreaMouseEnter.bind(this);
    this.onInteractionAreaMouseLeave = this.onInteractionAreaMouseLeave.bind(this);

    // create file reader
    this.fileReader = new FileReader();
    this.fileReader.onload = this.onFileReaderLoad;

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '100%';
    this.element.style.height = '100%';
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
    this.interactionArea.src = './images/plus-light.svg';
    this.interactionArea.addEventListener('click', this.onInteractionAreaClick);
    this.interactionArea.addEventListener('dragenter', this.onInteractionAreaDrag);
    this.interactionArea.addEventListener('dragover', this.onInteractionAreaDrag);
    this.interactionArea.addEventListener('drop', this.onInteractionAreaDrop);
    this.interactionArea.addEventListener('mouseenter', this.onInteractionAreaMouseEnter);
    this.interactionArea.addEventListener('mouseleave', this.onInteractionAreaMouseLeave);
    this.element.appendChild(this.interactionArea);
  }

  onFileReaderLoad(): void {
    if (this.fileReader.result instanceof ArrayBuffer) {
      const plant = new Plant(sequences.quantizeNoteSequence(
        midiToSequenceProto(this.fileReader.result),
        2,
      ));
      GameManager.addPlant(plant);
      if (this.parent.plant === undefined) {
        this.parent.setPlant(plant);
      }
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

  onInteractionAreaMouseEnter(): void {
    this.interactionArea.src = './images/plus-dark.svg';
  }

  onInteractionAreaMouseLeave(): void {
    this.interactionArea.src = './images/plus-light.svg';
  }
}
