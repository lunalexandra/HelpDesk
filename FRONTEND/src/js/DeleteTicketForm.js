import { Modal } from "./Modal";
import { deleteTicketById } from "./api";

export class DeleteTicketForm extends Modal {
  constructor(id) {
    super();
    this.title = "Удалить тикет";
    this.body = `
        <div>Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
    `;
    this.id = id;
  }

  clickOk() {
    this.onOk(() => deleteTicketById(this.id));
    location.reload();
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
