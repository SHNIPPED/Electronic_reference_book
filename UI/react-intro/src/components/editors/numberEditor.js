export class numberEditor {
    init(params) {
      this.params = params;
      this.input = document.createElement('input');
      this.input.type = 'text';
      const value = params.value;
      this.input.value = (value === undefined || value === null || value === '') ? '' : String(value);
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
    getGui() { return this.input; }
    afterGuiAttached() { this.input.focus(); this.input.select(); }
    getValue() {
      const value = this.input.value;
      if (!value) return 0;
      const cleaned = value.toString().replace(/\s/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    stopEditing() { this.params.stopEditing(); }
    cancelEditing() { this.params.stopEditing(true); }
}