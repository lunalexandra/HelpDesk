import { Modal } from "./Modal";
import { createTicket } from "./api";

export class CreateTicketForm extends Modal {
  constructor() {
    super();
    this.title = "Добавить тикет";
    this.body = `
        <label for="short-description">Краткое описание</label>
        <input type="text" name="short-description" class="input">
        <label for="full-description">Подробное описание</label>
        <textarea name="full-description" class="input"></textarea>
    `;
    this.callback = null;
  }

  getValue() {
    this.shortDescription = this.element.querySelector(
      'input[name="short-description"]',
    ).value;
    this.fullDescription = this.element
      .querySelector('textarea[name="full-description"]')
      .value.replace(/\r?\n/g, "\n");
  }

  async clickOk() {
    this.getValue();
    if (this.shortDescription && this.shortDescription.trim()) {
      try {
        await this.onOk(() =>
          createTicket(this.shortDescription, this.fullDescription),
        );
        if (this.callback) {
          this.callback();
        }
      } catch (error) {
        console.error("Error creating ticket:", error);
      }
    } else {
      this.close();
    }
  }

  bindEvents() {
    this.element.querySelector(".ok-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.clickOk();
    });

    this.element.querySelector(".cancel-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.onCancel();
    });
  }
}
