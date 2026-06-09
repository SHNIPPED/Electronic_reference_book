export class textEditor {
    init(params) {
      this.params = params;
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.placeholder = 'ДД.ММ.ГГГГ';
      this.input.value = this.formatDateForInput(params.value);
      this.input.style.width = '100%';
      this.input.style.height = '100%';
      this.input.style.padding = '4px';
      this.input.style.boxSizing = 'border-box';
      this.input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') this.stopEditing();
        else if (event.key === 'Escape') this.cancelEditing();
      });
      this.input.addEventListener('blur', () => this.stopEditing());
    }
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    parseDateFromInput(dateString) {
      if (!dateString) return null;
      const parts = dateString.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date.toISOString();
      }
      return null;
    }
    getGui() { return this.input; }
    afterGuiAttached() { this.input.focus(); this.input.select(); }
    getValue() { return this.parseDateFromInput(this.input.value); }
    stopEditing() { this.params.stopEditing(); }
    cancelEditing() { this.params.stopEditing(true); }
}