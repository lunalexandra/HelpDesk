import { CreateTicketForm } from "./CreateTicketForm";
import { getAllTickets, updateTicketById } from "./api";
import { Ticket } from "./Ticket";
import { DeleteTicketForm } from "./DeleteTicketForm";
import { UpdateTicketForm } from "./UpdateTicketForm";
import { showDescription } from "./showDescription";

export class HelpDesk {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.tickets = [];
    this.bindToDOM();
    this.onClick();
  }

  static get markup() {
    return `
          <form class="form-tickets">
              <button type="button" class="btn-add-ticket">Добавить тикет</button>
              <div class="tickets-container"></div>
          </form>
          `;
  }

  static get btnSelector() {
    return ".btn-add-ticket";
  }

  static get formSelector() {
    return ".form-tickets";
  }

  static get containerSelector() {
    return ".tickets-container";
  }

  bindToDOM() {
    this.parentEl.innerHTML = HelpDesk.markup;
    this.element = this.parentEl.querySelector(HelpDesk.formSelector);
    this.btn = this.element.querySelector(HelpDesk.btnSelector);
    this.container = this.element.querySelector(HelpDesk.containerSelector);

    this.renderTickets();
  }

  async fetchAllTickets() {
    try {
      this.tickets = await getAllTickets();
      console.log(this.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  async renderTickets() {
    await this.fetchAllTickets();
    this.container.innerHTML = "";
    this.tickets.forEach((el) => {
      const ticket = new Ticket(el);
      this.container.insertAdjacentHTML("afterbegin", ticket.add());
      this.bindEvent(el.id);
      this.changeStatus(el.id, el.status);
    });
  }

  bindEvent(id) {
    const ticketElement = this.container.querySelector(`[data-id="${id}"]`);
    if (!ticketElement) {
      console.error(`Ticket element with id ${id} not found`);
      return;
    }
    const cross = ticketElement.querySelector(".delete-btn");
    if (cross) {
      cross.addEventListener("click", async (e) => {
        e.preventDefault();
        const deleteForm = new DeleteTicketForm(id);
        deleteForm.render(this.element);
      });
    }

    const editBtn = ticketElement.querySelector(".editing-btn");
    if (editBtn) {
      editBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const editForm = new UpdateTicketForm(id);
        editForm.render(this.element);
      });
    }

    ticketElement.addEventListener("click", (e) => showDescription(e, id));
  }

  onClick() {
    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      const createTicketForm = new CreateTicketForm();
      createTicketForm.render(this.element);
    });
  }

  changeStatus(id, status) {
    const ticketElement = this.container.querySelector(`[data-id="${id}"]`);
    if (!ticketElement) {
      console.error(`Ticket element with id ${id} not found`);
      return;
    }
    const tick = ticketElement.querySelector(".tick");
    if (tick) {
      tick.addEventListener("click", async (e) => {
        e.preventDefault();
        if (status) {
          updateTicketById(id, { status: false });
        }
        if (!status) {
          updateTicketById(id, { status: true });
        }
        location.reload();
      });
    }
  }
}
