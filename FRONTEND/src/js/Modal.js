export class Modal {
  constructor() {
    this.title = "";
    this.body = null;
  }

  markup() {
    return `
            <div class="ticket-form modal">
                <div class="header">${this.title}</div>
                <div  class="ticket-form-body">${this.body}</div>
                <div class="ticket-form-buttons">
                  <button class="cancel-btn">Отмена</button>
                  <button class="ok-btn">Ok</button>
                </div>
            </div>
            `;
  }

  render(container) {
    container.insertAdjacentHTML("beforeend", this.markup());
    this.element = container.querySelector(".ticket-form");
    this.bindEvents();
  }

  bindEvents() {
    this.element.querySelector(".ok-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.onOk();
    });

    this.element.querySelector(".cancel-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.onCancel();
    });
  }

  onOk(callback) {
    if (callback) {
      callback();
    }
    console.log("callback error");
    this.close();
  }

  onCancel() {
    this.close();
  }

  close() {
    this.element.remove();
  }
}
