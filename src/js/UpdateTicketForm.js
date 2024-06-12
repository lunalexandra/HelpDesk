import { CreateTicketForm } from "./CreateTicketForm";
import { getTicketById, updateTicketById } from "./api";

export class UpdateTicketForm extends CreateTicketForm {
  constructor(id) {
    super();
    this.title = "Изменить тикет";
    this.id = id;
    this.callback = null;
  }

  async fillInput() {
    try {
      const { name, description } = await getTicketById(this.id);

      this.element.querySelector('input[name="short-description"]').value =
        name;
      this.element.querySelector('textarea[name="full-description"]').value =
        description;
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
          description: this.fullDescription,
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
