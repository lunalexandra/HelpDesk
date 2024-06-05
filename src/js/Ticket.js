export class Ticket {
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
    const { id, name, status, created } = this.data;
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
