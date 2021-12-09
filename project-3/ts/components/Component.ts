export default class Component {
  protected element?: HTMLElement;
  private initialized: boolean;
  private hidden: boolean;
  private display: string;

  constructor() {
    this.initialized = false;
    this.hidden = false;
    this.display = 'auto';
  }

  initComponent(parent: HTMLElement): void {
    if (this.initialized || this.element === undefined) {
      return;
    }
    parent.appendChild(this.element);
    this.initialized = true;

    if (this.componentHasInitialized !== undefined) {
      this.componentHasInitialized();
    }
  }

  componentHasInitialized?(): void;

  removeComponent(): void {
    if (!this.initialized || this.element === undefined) {
      return;
    }
    this.element.remove();
    this.initialized = false;
  }

  hideComponent(): void {
    if (this.hidden || this.element === undefined) {
      return;
    }
    this.display = this.element.style.display;
    this.element.style.display = 'none';
    this.hidden = true;
  }

  showComponent(): void {
    if (!this.hidden || this.element === undefined) {
      return;
    }
    this.element.style.display = this.display;
    this.hidden = false;
  }
}
