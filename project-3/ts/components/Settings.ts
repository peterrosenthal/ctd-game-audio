import Component from './Component';

/**
 * Reactive settings. Use the static method getInstance() to (initialize
 * or) get the singleton instance of this class which running in the app.
 */
export default class Settings extends Component {
  private static instance: Settings | null | undefined;
  static getInstance(): Settings {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new Settings();
    }
    return this.instance;
  }

  private openCloseButton: HTMLButtonElement;
  private openCloseImage: HTMLImageElement;
  private form: HTMLFormElement;
  private instrumentDiv: HTMLDivElement;
  private instrumentLabel: HTMLLabelElement;
  private instrumentSelect: HTMLSelectElement;
  private checkpointDiv: HTMLDivElement;
  private checkpointLabel: HTMLLabelElement;
  private checkpointSelect: HTMLSelectElement;
  private numChildrenDiv: HTMLDivElement;
  private numChildrenLabel: HTMLLabelElement;
  private numChildrenInput: HTMLInputElement;
  private parentSimSkewDiv: HTMLDivElement;
  private parentSimSkewLabel: HTMLLabelElement;
  private parentSimSkewInput: HTMLInputElement;
  private parentSimTempDiv: HTMLDivElement;
  private parentSimTempLabel: HTMLLabelElement;
  private parentSimTempInput: HTMLInputElement;
  private interpResDiv: HTMLDivElement;
  private interpResLabel: HTMLLabelElement;
  private interpResInput: HTMLInputElement;
  private saveButton: HTMLButtonElement;
  private saveImage: HTMLImageElement;

  player = {
    url: 'https://storage.googleapis.com/magentadata/js/soundfonts/salamander',
    instruments: [
      {
        name: 'Piano',
        url: 'https://storage.googleapis.com/magentadata/js/soundfonts/salamander',
      },
      {
        name: 'Multi',
        url: 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus',
      },
      {
        name: 'Percussion',
        url: 'https://storage.googleapis.com/magentadata/js/soundfonts/jazz_kit',
      },
    ],
  };

  generator = {
    checkpointUrl: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
    checkpoints: [
      {
        name: 'Melody, 2 bars, small',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
      },
      {
        name: 'Melody, 4 bars, small',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2',
      },
      {
        name: 'Melody, 4 bars, medium',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',
      },
      {
        name: 'Melody, 16 bars, small',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_16bar_small_q2',
      },
      {
        name: 'Melody with chords, 2 bars, small',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_chords',
      },
      {
        name: 'Drums, 2 bars, small',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/drums_2bar_hikl_small',
      },
      {
        name: 'Drums, 4 bars, medium',
        url: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/drums_4bar_med_q2',
      },
    ],
    numChildren: 10,
    parentSimilaritySkew: 0.3,
    parentSimilarityTemperature: 1.0,
    interpolationResolutuion: 100,
  };

  camera = {
    fov: 55,
    near: 0.1,
    far: 1000,
    position: {
      x: 0,
      y: 0.75,
      z: 3,
    },
    lookAt: {
      x: 0,
      y: 1,
      z: 0,
    },
  };

  lights = {
    directional: {
      color: 0xfffffff,
      intensity: 0.3,
      position: {
        x: 5,
        y: 7,
        z: 2,
      },
    },
    ambient: {
      color: 0xffffff,
      intensity: 0.7,
    },
  };

  private constructor() {
    super();

    // bind event listeners
    this.onOpenButtonClick = this.onOpenButtonClick.bind(this);
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
    this.onOpenCloseButtonMouseEnter = this.onOpenCloseButtonMouseEnter.bind(this);
    this.onOpenCloseButtonMouseLeave = this.onOpenCloseButtonMouseLeave.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onSaveButtonMouseEnter = this.onSaveButtonMouseEnter.bind(this);
    this.onSaveButtonMouseLeave = this.onSaveButtonMouseLeave.bind(this);

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.zIndex = '200';
    this.element.style.width = '100%';

    // create the open/close button
    this.openCloseButton = document.createElement('button');
    this.openCloseButton.style.background = 'none';
    this.openCloseButton.style.border = 'none';
    this.openCloseButton.style.marginLeft = '4em';
    this.openCloseButton.addEventListener('click', this.onOpenButtonClick);
    this.openCloseButton.addEventListener('mouseenter', this.onOpenCloseButtonMouseEnter);
    this.openCloseButton.addEventListener('mouseleave', this.onOpenCloseButtonMouseLeave);
    this.element.appendChild(this.openCloseButton);
    this.openCloseImage = document.createElement('img');
    this.openCloseImage.alt = 'Settings';
    this.openCloseImage.title = 'Open settings';
    this.openCloseImage.src = './images/settings-light.svg';
    this.openCloseButton.appendChild(this.openCloseImage);

    // create the form element
    this.form = document.createElement('form');
    this.form.style.display = 'none';
    this.form.style.flexFlow = 'row wrap';
    this.form.style.alignItems = 'stretch';
    this.form.style.justifyContent = 'space-around';
    this.form.style.background = '#eee6d5';
    this.form.style.borderRadius = '0.2em';
    this.element.appendChild(this.form);

    // instrument select
    this.instrumentDiv = document.createElement('div');
    this.instrumentDiv.style.margin = '2em';
    this.form.appendChild(this.instrumentDiv);
    this.instrumentLabel = document.createElement('label');
    this.instrumentLabel.htmlFor = 'instrument';
    this.instrumentLabel.innerHTML = 'Instrument';
    this.instrumentDiv.appendChild(this.instrumentLabel);
    this.instrumentSelect = document.createElement('select');
    this.instrumentSelect.id = 'instrument';
    this.instrumentSelect.name = 'instrument';
    this.instrumentDiv.appendChild(this.instrumentSelect);
    for (let instrument of this.player.instruments) {
      const option = document.createElement('option');
      option.value = instrument.url;
      option.innerHTML = instrument.name;
      this.instrumentSelect.appendChild(option);
    }

    // checkpoint select
    this.checkpointDiv = document.createElement('div');
    this.checkpointDiv.style.margin = '2em';
    this.form.appendChild(this.checkpointDiv);
    this.checkpointLabel = document.createElement('label');
    this.checkpointLabel.htmlFor = 'checkpoint';
    this.checkpointLabel.innerHTML = 'Checkpoint';
    this.checkpointDiv.appendChild(this.checkpointLabel);
    this.checkpointSelect = document.createElement('select');
    this.checkpointSelect.id = 'checkpoint';
    this.checkpointSelect.name = 'checkpoint';
    this.checkpointDiv.appendChild(this.checkpointSelect);
    for (let checkpoint of this.generator.checkpoints) {
      const option = document.createElement('option');
      option.value = checkpoint.url;
      option.innerHTML = checkpoint.name;
      this.checkpointSelect.appendChild(option);
    }

    // number of children input
    this.numChildrenDiv = document.createElement('div');
    this.numChildrenDiv.style.margin = '2em';
    this.form.appendChild(this.numChildrenDiv);
    this.numChildrenLabel = document.createElement('label');
    this.numChildrenLabel.htmlFor = 'num-children';
    this.numChildrenLabel.innerHTML = 'Number of Children';
    this.numChildrenDiv.appendChild(this.numChildrenLabel);
    this.numChildrenInput = document.createElement('input');
    this.numChildrenInput.id = 'num-children';
    this.numChildrenInput.name = 'num-children';
    this.numChildrenInput.type = 'number';
    this.numChildrenInput.step = '1';
    this.numChildrenInput.min = '1';
    this.numChildrenInput.max = '100';
    this.numChildrenInput.value = `${this.generator.numChildren}`;
    this.numChildrenDiv.appendChild(this.numChildrenInput);

    // parent similarity skew input
    this.parentSimSkewDiv = document.createElement('div');
    this.parentSimSkewDiv.style.margin = '2em';
    this.form.appendChild(this.parentSimSkewDiv);
    this.parentSimSkewLabel = document.createElement('label');
    this.parentSimSkewLabel.htmlFor = 'parent-sim-skew';
    this.parentSimSkewLabel.innerHTML = 'Similarity Skew (higher = less similar)';
    this.parentSimSkewDiv.appendChild(this.parentSimSkewLabel);
    this.parentSimSkewInput = document.createElement('input');
    this.parentSimSkewInput.id = 'parent-sim-skew';
    this.parentSimSkewInput.name = 'parent-sim-skew';
    this.parentSimSkewInput.type = 'number';
    this.parentSimSkewInput.step = '0.01';
    this.parentSimSkewInput.min = '0.01';
    this.parentSimSkewInput.max = '1.00';
    this.parentSimSkewInput.value = `${this.generator.parentSimilaritySkew}`;
    this.parentSimSkewDiv.appendChild(this.parentSimSkewInput);

    // parent similarity skew input
    this.parentSimTempDiv = document.createElement('div');
    this.parentSimTempDiv.style.margin = '2em';
    this.form.appendChild(this.parentSimTempDiv);
    this.parentSimTempLabel = document.createElement('label');
    this.parentSimTempLabel.htmlFor = 'parent-sim-temp';
    this.parentSimTempLabel.innerHTML = 'Similarity Temperature (higher = less similar)';
    this.parentSimTempDiv.appendChild(this.parentSimTempLabel);
    this.parentSimTempInput = document.createElement('input');
    this.parentSimTempInput.id = 'parent-sim-temp';
    this.parentSimTempInput.name = 'parent-sim-temp';
    this.parentSimTempInput.type = 'number';
    this.parentSimTempInput.step = '0.01';
    this.parentSimTempInput.min = '0.01';
    this.parentSimTempInput.max = '10.00';
    this.parentSimTempInput.value = `${this.generator.parentSimilarityTemperature}`;
    this.parentSimTempDiv.appendChild(this.parentSimTempInput);

    // interpolation resolution input
    this.interpResDiv = document.createElement('div');
    this.interpResDiv.style.margin = '2em';
    this.form.appendChild(this.interpResDiv);
    this.interpResLabel = document.createElement('label');
    this.interpResLabel.htmlFor = 'interp-res';
    this.interpResLabel.innerHTML = 'Interpolation Resolution';
    this.interpResDiv.appendChild(this.interpResLabel);
    this.interpResInput = document.createElement('input');
    this.interpResInput.id = 'interp-res';
    this.interpResInput.name = 'interp-res';
    this.interpResInput.type = 'number';
    this.interpResInput.step = '1';
    this.interpResInput.min = '1';
    this.interpResInput.min = '1000';
    this.interpResInput.value = `${this.generator.interpolationResolutuion}`;
    this.interpResDiv.appendChild(this.interpResInput);

    // add a "line break" in the flexbox
    const flexBreak = document.createElement('div');
    flexBreak.style.flexBasis = '100%';
    flexBreak.style.height = '0';
    this.form.appendChild(flexBreak);

    // set settings button
    this.saveButton = document.createElement('button');
    this.saveButton.style.display = 'block';
    this.saveButton.style.background = 'none';
    this.saveButton.style.border = 'none';
    this.saveButton.type = 'button';
    this.saveButton.addEventListener('click', this.onSaveButtonClick);
    this.saveButton.addEventListener('mouseenter', this.onSaveButtonMouseEnter);
    this.saveButton.addEventListener('mouseleave', this.onSaveButtonMouseLeave);
    this.form.appendChild(this.saveButton);
    this.saveImage = document.createElement('img');
    this.saveImage.alt = 'Set Settings';
    this.saveImage.title = 'Set settings';
    this.saveImage.src = './images/set-settings-light.svg';
    this.saveButton.appendChild(this.saveImage);
  }

  private onOpenButtonClick(): void {
    this.form.style.display = 'flex';

    this.openCloseButton.removeEventListener('click', this.onOpenButtonClick);
    this.openCloseButton.addEventListener('click', this.onCloseButtonClick);
  }

  private onCloseButtonClick(): void {
    this.form.style.display = 'none';

    this.openCloseButton.removeEventListener('click', this.onCloseButtonClick);
    this.openCloseButton.addEventListener('click', this.onOpenButtonClick);
  }

  private onOpenCloseButtonMouseEnter(): void {
    this.openCloseImage.src = './images/settings-dark.svg';
  }

  private onOpenCloseButtonMouseLeave(): void {
    this.openCloseImage.src = './images/settings-light.svg';
  }

  private onSaveButtonClick(): void {
    this.player.url = this.instrumentSelect.value;
    this.generator.checkpointUrl = this.checkpointSelect.value;
    this.generator.numChildren = parseInt(this.numChildrenInput.value);
    this.generator.parentSimilaritySkew = parseFloat(this.parentSimSkewInput.value);
    this.generator.parentSimilarityTemperature = parseFloat (this.parentSimTempInput.value);
    this.generator.interpolationResolutuion = parseFloat(this.interpResInput.value);

    this.openCloseButton.click();
  }

  private onSaveButtonMouseEnter(): void {
    this.saveImage.src = './images/set-settings-dark.svg';
  }

  private onSaveButtonMouseLeave(): void {
    this.saveImage.src = './images/set-settings-light.svg';
  }
}
