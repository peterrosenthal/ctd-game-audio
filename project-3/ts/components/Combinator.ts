import Generator from '../Generator';
import ChildrenCarousel from './ChildrenCarousel';
import Component from './Component';
import Parent from './Parent';

export default class Combinator extends Component {
  private generator: Generator;

  private parents: HTMLDivElement;
  private combineButton: HTMLButtonElement;
  private combineImage: HTMLImageElement;
  private carousel: ChildrenCarousel;

  parentA: Parent;
  parentB: Parent;

  constructor() {
    super();

    // bind event listeners
    this.onCombineButtonClick = this.onCombineButtonClick.bind(this);
    this.onCombineButtonMouseEnter = this.onCombineButtonMouseEnter.bind(this);
    this.onCombineButtonMouseLeave = this.onCombineButtonMouseLeave.bind(this);

    // initialize the generator
    this.generator = new Generator();

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '90%';
    this.element.style.maxWidth = '95em';
    this.element.style.margin = 'auto';

    // create the parents flexbox
    this.parents = document.createElement('div');
    this.parents.style.width = '100%';
    this.parents.style.maxWidth = '55em';
    this.parents.style.margin = 'auto';
    this.parents.style.display = 'flex';
    this.parents.style.flexFlow = 'row wrap';
    this.parents.style.alignItems = 'center';
    this.parents.style.justifyContent = 'space-around';
    this.element.appendChild(this.parents);

    // create the two parent components
    this.parentA = new Parent(this);
    this.parentA.initComponentToParent(this.parents);
    
    this.parentB = new Parent(this);
    this.parentB.initComponentToParent(this.parents);

    // create the combine button
    this.combineButton = document.createElement('button');
    this.combineButton.style.display = 'block';
    this.combineButton.style.background = 'none';
    this.combineButton.style.border = 'none';
    this.combineButton.style.width = '50%';
    this.combineButton.style.maxWidth = '18em';
    this.combineButton.style.margin = 'auto';
    this.combineButton.addEventListener('click', this.onCombineButtonClick);
    this.combineButton.addEventListener('mouseenter', this.onCombineButtonMouseEnter);
    this.combineButton.addEventListener('mouseleave', this.onCombineButtonMouseLeave);

    this.combineImage = document.createElement('img');
    this.combineImage.alt = 'Combine';
    this.combineImage.title = 'Combine parents into set of children';
    this.combineImage.src = './images/combine-light.svg';
    this.combineButton.appendChild(this.combineImage);

    // create the children carousel
    this.carousel = new ChildrenCarousel();
  }

  activateCombineButton(): void {
    if (this.element === undefined) {
      return;
    }
    this.element.appendChild(this.combineButton);
    this.carousel.initComponentToParent(this.element);
  }

  private async generate(): Promise<void> {
    if (this.parentA.plant === undefined || this.parentB.plant === undefined) {
      throw new Error('Could not generate children: one or both of the parent plants are undefined');
    }
    const childern = await this.generator.generateFromParents(this.parentA.plant, this.parentB.plant);
    this.carousel.setChildren(childern);
  }

  private onCombineButtonClick(): void {
    console.log('generating!');
    this.generate();  
  }

  private onCombineButtonMouseEnter(): void {
    this.combineImage.src = './images/combine-dark.svg';
  }

  private onCombineButtonMouseLeave(): void {
    this.combineImage.src = './images/combine-light.svg';
  }
}
