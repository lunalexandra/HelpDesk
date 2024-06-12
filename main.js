/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Modal.js
class Modal {
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
  checkModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.style.outline = "5px solid lightblue";
      return true;
    }
    return false;
  }
  render(container) {
    if (this.checkModal()) {
      return;
    }
    container.insertAdjacentHTML("beforeend", this.markup());
    this.element = container.querySelector(".ticket-form");
    this.bindEvents();
  }
  bindEvents() {
    this.element.querySelector(".ok-btn").addEventListener("click", e => {
      e.preventDefault();
      this.onOk();
    });
    this.element.querySelector(".cancel-btn").addEventListener("click", e => {
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
;// CONCATENATED MODULE: ./src/js/api.js
const API_URL = "http://localhost:7070/api/tickets";
async function getAllTickets() {
  const response = await fetch(`${API_URL}?method=allTickets`);
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
}
async function getTicketById(id) {
  const response = await fetch(`${API_URL}?method=ticketById&id=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with id ${id}`);
  }
  return response.json();
}
async function createTicket(name, description) {
  const response = await fetch(`${API_URL}?method=createTicket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      description
    })
  });
  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }
  return response.json();
}
async function deleteTicketById(id) {
  const response = await fetch(`${API_URL}?method=deleteById&id=${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ticket with id ${id}`);
  }
}
async function updateTicketById(id, updates) {
  const response = await fetch(`${API_URL}?method=updateById&id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    throw new Error(`Failed to update ticket with id ${id}`);
  }
  return response.json();
}
;// CONCATENATED MODULE: ./src/js/CreateTicketForm.js


class CreateTicketForm extends Modal {
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
    this.shortDescription = this.element.querySelector('input[name="short-description"]').value;
    this.fullDescription = this.element.querySelector('textarea[name="full-description"]').value.replace(/\r?\n/g, "\n");
  }
  async clickOk() {
    this.getValue();
    if (this.shortDescription && this.shortDescription.trim()) {
      try {
        await this.onOk(() => createTicket(this.shortDescription, this.fullDescription));
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
    this.element.querySelector(".ok-btn").addEventListener("click", e => {
      e.preventDefault();
      this.clickOk();
    });
    this.element.querySelector(".cancel-btn").addEventListener("click", e => {
      e.preventDefault();
      this.onCancel();
    });
  }
}
;// CONCATENATED MODULE: ./src/js/Ticket.js
class Ticket {
  constructor(data) {
    this.data = data;
  }
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  add() {
    const {
      id,
      name,
      status,
      created
    } = this.data;
    return `
        <div class="new-task" data-id=${id}>
            <button type="button" class="tick circle tick-${status}"></button>
            <div class="task-text"><div>${name}</div><div class="description hidden"></div></div>
            <div class="date-box">${this.formatDate(created)}</div>
            <div class="editing"><button type="button" class="editing-btn circle"></button></div>
            <div class="deletion"><button type="button" class="delete-btn circle"></button></div>
        </div>
        `;
  }
}
;// CONCATENATED MODULE: ./src/js/DeleteTicketForm.js


class DeleteTicketForm extends Modal {
  constructor(id) {
    super();
    this.title = "Удалить тикет";
    this.body = `
        <div>Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
    `;
    this.id = id;
    this.callback = null;
  }
  clickOk() {
    this.onOk(() => deleteTicketById(this.id));
    if (this.callback) {
      this.callback();
    }
  }
  bindEvents() {
    this.element.querySelector(".ok-btn").addEventListener("click", e => {
      e.preventDefault();
      this.clickOk();
    });
    this.element.querySelector(".cancel-btn").addEventListener("click", e => {
      e.preventDefault();
      this.onCancel();
    });
  }
}
;// CONCATENATED MODULE: ./src/js/UpdateTicketForm.js


class UpdateTicketForm extends CreateTicketForm {
  constructor(id) {
    super();
    this.title = "Изменить тикет";
    this.id = id;
    this.callback = null;
  }
  async fillInput() {
    try {
      const {
        name,
        description
      } = await getTicketById(this.id);
      this.element.querySelector('input[name="short-description"]').value = name;
      this.element.querySelector('textarea[name="full-description"]').value = description;
    } catch (error) {
      console.error("Error fetching ticket:", error);
    }
  }
  async clickOk() {
    this.getValue();
    if (this.shortDescription && this.shortDescription.trim()) {
      try {
        await updateTicketById(this.id, {
          name: this.shortDescription,
          description: this.fullDescription
        });
        if (this.callback) {
          this.callback();
        }
        this.close();
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    } else {
      this.close();
    }
  }
  render(container) {
    super.render(container);
    this.fillInput();
  }
}
;// CONCATENATED MODULE: ./src/js/showDescription.js

async function showDescription(event, id) {
  if (window.getSelection().toString()) {
    return;
  }
  let ticket = event.target.closest(".new-task");
  if (event.target.closest("button")) {
    return;
  }
  try {
    const {
      description
    } = await getTicketById(id);
    const descBox = ticket.querySelector(".description");
    if (descBox) {
      if (descBox.classList.contains("hidden")) {
        descBox.innerText = description;
        descBox.classList.remove("hidden");
      } else {
        descBox.textContent = "";
        descBox.classList.add("hidden");
      }
    }
  } catch (error) {
    console.error("Error fetching ticket description:", error);
  }
}
;// CONCATENATED MODULE: ./src/js/HelpDesk.js






class HelpDesk {
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
    this.tickets.forEach(el => {
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
      cross.addEventListener("click", async e => this.deleteTicket(e, id));
    }
    const editBtn = ticketElement.querySelector(".editing-btn");
    if (editBtn) {
      editBtn.addEventListener("click", async e => this.editTicket(e, id));
    }
    const tick = ticketElement.querySelector(".tick");
    if (tick) {
      tick.addEventListener("click", e => this.changeStatus(e, id, status));
    }
    ticketElement.addEventListener("click", e => showDescription(e, id));
  }
  subscribeOnEvent() {
    this.btn.addEventListener("click", e => this.addTicket(e));
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
      await updateTicketById(id, {
        status: !status
      });
      this.updateAndRenderTickets();
    } catch (error) {
      console.error(`Error updating ticket status:`, error);
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const container = document.querySelector(".container");
const app_form = new HelpDesk(container);
app_form.bindToDOM();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;