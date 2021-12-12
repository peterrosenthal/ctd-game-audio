import { sequences, midiToSequenceProto, MusicVAE, INoteSequence } from '@magenta/music/es6'; 
import GameManager from '../GameManager';
import Plant from '../Plant';
import Settings from '../Settings';
import Component from './Component';
import Parent from './Parent';

export default class MidiUpload extends Component {
  private settings: Settings;

  private parent: Parent;
  private fileReader: FileReader;
  private fileInput: HTMLInputElement;
  private interactionArea: HTMLImageElement;

  constructor(parent: Parent) {
    super();

    this.parent = parent;

    this.settings = Settings.getInstance();

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
    this.element.style.minWidth = '4em';
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

  private async createPlant(sequence: INoteSequence): Promise<void> {
      const mvae = new MusicVAE(this.settings.generator.checkPointUrl);
      await mvae.initialize();
      const mvaedSequence = (await mvae.decode(await mvae.encode([sequence])))[0];
      const plant = new Plant(mvaedSequence);
      GameManager.addPlant(plant);
      this.parent.setPlant(plant);
      if (this.parent.combinator.parentA.plant !== undefined
       && this.parent.combinator.parentB.plant !== undefined) {
        this.parent.combinator.activateCombineButton();
      }
  }

  private onFileReaderLoad(): void {
    if (this.fileReader.result instanceof ArrayBuffer) {
      this.createPlant(sequences.quantizeNoteSequence(
        midiToSequenceProto(this.fileReader.result),
        2,
      ));
    }
    if (this.element === undefined) {
      return;
    }
    this.element.style.width = '25%';
    this.element.style.minWidth = '3em';
    this.element.style.maxWidth = '7em';
    this.element.style.flexBasis = '1';
  }

  private onFileInputChange(): void {
    if (this.fileInput.files === null || this.fileInput.files === undefined) {
      return;
    }
    for (let file of this.fileInput.files) {
      this.fileReader.readAsArrayBuffer(file);
    }
  }

  private onInteractionAreaClick(): void {
    this.fileInput.click();
  }

  private onInteractionAreaDrag(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  private onInteractionAreaDrop(e: DragEvent): void {
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

  private onInteractionAreaMouseEnter(): void {
    this.interactionArea.src = './images/plus-dark.svg';
  }

  private onInteractionAreaMouseLeave(): void {
    this.interactionArea.src = './images/plus-light.svg';
  }
}
