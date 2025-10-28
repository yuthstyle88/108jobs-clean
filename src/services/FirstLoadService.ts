import {isBrowser} from "@/utils/browser";

export class FirstLoadService {
  static #instance: FirstLoadService;
  #isFirstLoad: boolean;

  private constructor() {
    this.#isFirstLoad = true;
  }

  static get isFirstLoad() {
    return !isBrowser() || this.#Instance.isFirstLoad;
  }

  static get #Instance() {
    return this.#instance ?? (this.#instance = new this());
  }

  get isFirstLoad() {
    const isFirst = this.#isFirstLoad;
    if (isFirst) {
      this.#isFirstLoad = false;
    }

    return isFirst;
  }

  static falsify() {
    this.#Instance.falsify();
  }

  falsify() {
    this.#isFirstLoad = false;
  }
}
