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
    this.subscribeOnEvent();
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
      this.bindEvent(el.id, el.status);
    });
  }

  async updateAndRenderTickets() {
    await this.fetchAllTickets();
    this.renderTickets();
  }

  bindEvent(id, status) {
    const ticketElement = this.container.querySelector(`[data-id="${id}"]`);
    if (!ticketElement) {
      console.error(`Ticket element with id ${id} not found`);
      return;
    }
    const cross = ticketElement.querySelector(".delete-btn");
    if (cross) {
      cross.addEventListener("click", async (e) => this.deleteTicket(e, id));
    }

    const editBtn = ticketElement.querySelector(".editing-btn");
    if (editBtn) {
      editBtn.addEventListener("click", async (e) => this.editTicket(e, id));
    }
    const tick = ticketElement.querySelector(".tick");
    if (tick) {
      tick.addEventListener("click", (e) => this.changeStatus(e, id, status));
    }

    ticketElement.addEventListener("click", (e) => showDescription(e, id));
  }

  subscribeOnEvent() {
    this.btn.addEventListener("click", (e) => this.addTicket(e));
  }

  addTicket(e) {
    e.preventDefault();
    const createTicketForm = new CreateTicketForm();
    createTicketForm.render(this.element);
    createTicketForm.callback = () => this.updateAndRenderTickets();
  }

  deleteTicket(e, id) {
    e.preventDefault();
    const deleteForm = new DeleteTicketForm(id);
    deleteForm.render(this.element);
    deleteForm.callback = () => this.updateAndRenderTickets();
  }

  editTicket(e, id) {
    e.preventDefault();
    const editForm = new UpdateTicketForm(id);
    editForm.render(this.element);
    editForm.callback = () => this.updateAndRenderTickets();
  }

  async changeStatus(e, id, status) {
    e.preventDefault();
    try {
      await updateTicketById(id, { status: !status });
      this.updateAndRenderTickets();
    } catch (error) {
      console.error(`Error updating ticket status:`, error);
    }
  }
}
