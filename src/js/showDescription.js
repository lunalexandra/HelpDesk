import { getTicketById } from "./api";

export async function showDescription(event, id) {
  if (window.getSelection().toString()) {
    return;
  }

  let ticket = event.target.closest(".new-task");

  if (event.target.closest("button")) {
    return;
  }

  try {
    const { description } = await getTicketById(id);

    const descBox = ticket.querySelector(".description");

    if (descBox) {
      if (descBox.classList.contains("hidden")) {
        descBox.textContent = description;
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
