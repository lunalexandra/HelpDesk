const API_URL = "http://localhost:7070/api/tickets";

export async function getAllTickets() {
  const response = await fetch(`${API_URL}?method=allTickets`);
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
}

export async function getTicketById(id) {
  const response = await fetch(`${API_URL}?method=ticketById&id=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with id ${id}`);
  }
  return response.json();
}

export async function createTicket(name, description) {
  const response = await fetch(`${API_URL}?method=createTicket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }
  return response.json();
}

export async function deleteTicketById(id) {
  const response = await fetch(`${API_URL}?method=deleteById&id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ticket with id ${id}`);
  }
}

export async function updateTicketById(id, updates) {
  const response = await fetch(`${API_URL}?method=updateById&id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ticket with id ${id}`);
  }
  return response.json();
}
