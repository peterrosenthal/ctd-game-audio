import Plant from '../Plant';
import Settings from '../Settings';
import Child from './Child';
import Component from './Component';

export default class ChildrenCarousel extends Component {
  private settings: Settings;

  private children: Child[];
  private childInFocus: number;

  private buttons: HTMLDivElement;
  private leftButton: HTMLButtonElement;
  private leftImage: HTMLImageElement;
  private rightButton: HTMLButtonElement;
  private rightImage: HTMLImageElement;
  constructor() {
    super();

    // get the Settings instance
    this.settings = Settings.getInstance();

    // init children array
    this.children = [];
    for (let i = 0; i < this.settings.generator.numChildren; i++) {
      this.children.push(new Child());
    }
    this.childInFocus = Math.floor(this.children.length / 2);

    // bind event listeners
    this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
    this.onLeftButtonMouseEnter = this.onLeftButtonMouseEnter.bind(this);
    this.onLeftButtonMouseLeave = this.onLeftButtonMouseLeave.bind(this);
    this.onRightButtonClick = this.onRightButtonClick.bind(this);
    this.onRightButtonMouseEnter = this.onRightButtonMouseEnter.bind(this);
    this.onRightButtonMouseLeave = this.onRightButtonMouseLeave.bind(this);

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.position = 'relative';
    this.element.style.width = '95%';

    // create the buttons modal
    this.buttons = document.createElement('div');
    this.buttons.style.display = 'flex';
    this.buttons.style.flexFlow = 'row';
    this.buttons.style.alignItems = 'center';
    this.buttons.style.justifyContent = 'space-between';
    this.buttons.style.width = '100%';
    this.buttons.style.height = '100%';
    this.buttons.style.position = 'absolute';
    this.buttons.style.zIndex = '100';
    this.element.appendChild(this.buttons);
    
    // move left button
    this.leftButton = document.createElement('button');
    this.leftButton.style.background = 'none';
    this.leftButton.style.border = 'none';
    this.leftButton.addEventListener('click', this.onLeftButtonClick);
    this.leftButton.addEventListener('mouseenter', this.onLeftButtonMouseEnter);
    this.leftButton.addEventListener('mouseleave', this.onLeftButtonMouseLeave);
    this.buttons.appendChild(this.leftButton);
    this.leftImage = document.createElement('img');
    this.leftImage.alt = 'Left';
    this.leftImage.title = 'Left';
    this.leftImage.src = './images/left-dark.svg';
    this.leftButton.appendChild(this.leftImage);

    // move right button
    this.rightButton = document.createElement('button');
    this.rightButton.style.background = 'none';
    this.rightButton.style.border = 'none';
    this.rightButton.addEventListener('click', this.onRightButtonClick);
    this.rightButton.addEventListener('mouseenter', this.onRightButtonMouseEnter);
    this.rightButton.addEventListener('mouseleave', this.onRightButtonMouseLeave);
    this.buttons.appendChild(this.rightButton);
    this.rightImage = document.createElement('img');
    this.rightImage.alt = 'Right';
    this.rightImage.title = 'Right';
    this.rightImage.src = './images/right-dark.svg';
    this.rightButton.appendChild(this.rightImage);
  }

  setChildren(plants: Plant[]): void {
    while (this.children.length < plants.length) {
      this.children.push(new Child);
    }
    while (this.children.length > plants.length) {
      this.children.pop()?.removeComponent();
    }
    for (let i = 0; i < plants.length; i++) {
      const child = this.children[i];
      if (this.element !== undefined) {
        child.initComponentToParent(this.element);
      }
      child.setPlant(plants[i]);
    }
    this.setChildrenPositions();
  }

  private setChildrenPositions(): void {
    const maxZIndex = Math.max(this.childInFocus, this.children.length - this.childInFocus - 1);
    for (let i = 0; i < this.children.length; i ++) {
      const child = this.children[i];
      if (i < this.childInFocus) {
        child.setPosition(50 - ((this.childInFocus - i) / this.childInFocus) * 40);
        child.setZIndex(maxZIndex - (this.childInFocus - i));
        child.hideButtons();
      } else if (i > this.childInFocus) {
        child.setPosition(50 + ((i - this.childInFocus) / (this.children.length - 1 - this.childInFocus)) * 40);
        child.setZIndex(maxZIndex - (i - this.childInFocus));
        child.hideButtons();
      } else {
        child.setPosition(50);
        child.setZIndex(maxZIndex);
        child.showButtons();
      }
    }
  }

  private onLeftButtonClick(): void {
    if (this.childInFocus > 0) {
      this.childInFocus--;
      this.setChildrenPositions();
    }
  }

  private onLeftButtonMouseEnter(): void {
    this.leftImage.src = './images/left-light.svg';
  }

  private onLeftButtonMouseLeave(): void {
    this.leftImage.src = './images/left-dark.svg';
  }

  private onRightButtonClick(): void {
    if (this.childInFocus < this.children.length) {
      this.childInFocus++;
      this.setChildrenPositions();
    }
  }

  private onRightButtonMouseEnter(): void {
    this.rightImage.src = './images/right-light.svg';
  }
  
  private onRightButtonMouseLeave(): void {
    this.rightImage.src = './images/right-dark.svg';
  }
}
