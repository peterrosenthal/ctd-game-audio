import Component from './Component';
import Parent from './Parent';

export default class Combinator extends Component {
  private parentA: Parent;
  private parentB: Parent;

  constructor() {
    super();

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '90%';
    this.element.style.maxWidth = '55em';
    this.element.style.margin = 'auto';
    this.element.style.display = 'flex';
    this.element.style.flexFlow = 'row wrap';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'space-around';

    // create the two parent components
    this.parentA = new Parent();
    this.parentA.initComponentToParent(this.element);
    
    this.parentB = new Parent();
    this.parentB.initComponentToParent(this.element);
  }
}
