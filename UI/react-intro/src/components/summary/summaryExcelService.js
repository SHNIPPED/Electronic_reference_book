import * as XLSX from 'xlsx';
import axios from 'axios';

class SummaryExcelService {
  
  static async importFromExcel(file, api) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Получаем все данные как массив массивов
          const rows = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1, 
            defval: '',
            blankrows: false 
          });
          
          console.log('Всего строк в файле:', rows.length);
          
          // Ищем строку с заголовками
          let startRow = -1;
          let headers = null;
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            
            // Ищем строку с заголовком "Номер документа"
            for (let j = 0; j < row.length; j++) {
              const cell = row[j];
              if (cell && String(cell).trim() === 'Номер документа') {
                startRow = i + 1;
                headers = row;
                console.log('Найдена строка с заголовками на строке:', i);
                break;
              }
            }
            if (startRow !== -1) break;
          }
          
          if (startRow === -1) {
            reject(new Error('Не найдена строка с заголовками'));
            return;
          }
          
          // Находим индексы колонок
          const colIndexes = this.getColumnIndexes(headers);
          console.log('Индексы колонок:', colIndexes);
          
          // Парсим данные
          const parsedData = this.parseTableData(rows, startRow, colIndexes);
          
          console.log('Распарсено записей:', parsedData.length);
          console.log('Первые 3 записи:', parsedData.slice(0, 3));
          
          if (parsedData.length === 0) {
            reject(new Error('Не найдено данных для импорта'));
            return;
          }
          
          // Синхронизация с БД
          const results = await this.syncData(parsedData, api);
          resolve(results);
          
        } catch (error) {
          console.error('Ошибка чтения файла:', error);
          reject(error);
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  // Получение индексов колонок
  static getColumnIndexes(headers) {
    const indexes = {
      doc_num: -1,        // Номер документа
      doc_status: -1,     // Статус документа
      doc_date: -1,       // Дата документа
      reg_date: -1,       // Дата регистрации
      exec_date: -1,      // Дата исполнения
      total_sum: -1,      // Общая сумма
      contract_type: -1,  // Признак договора
      counterparty: -1,   // Организация контрагента
      contract_sum: -1,   // Сумма контракта
      curr_year_sum: -1,  // Сумма тек. года
      exec_curr_year: -1, // Исполнено в тек. году
      exec_past_periods: -1, // Исполнено в прошлых периодах
      in_execution: -1,   // В исполнении
      advance_sum: -1,    // Сумма аванса
      balance: -1,        // Остаток
      total_balance: -1,  // Общий остаток
      base_doc_date: -1,  // Дата документа-основания
      start_date: -1,     // Дата начала действия
      end_date: -1,       // Дата окончания действия
      osnovanie: -1,      // Основание
      kcsr: -1,           // КЦСР
      kvr: -1,            // КВР
      kosgu: -1,          // КОСГУ (добавить)
      kvfo: -1            // КВФО
    };
    
    headers.forEach((header, idx) => {
      const headerStr = String(header || '').trim();
      
      if (headerStr === 'Номер документа') indexes.doc_num = idx;
      else if (headerStr === 'Статус документа') indexes.doc_status = idx;
      else if (headerStr === 'Дата документа') indexes.doc_date = idx;
      else if (headerStr === 'Дата регистрации') indexes.reg_date = idx;
      else if (headerStr === 'Дата исполнения') indexes.exec_date = idx;
      else if (headerStr === 'Общая сумма') indexes.total_sum = idx;
      else if (headerStr === 'Признак договора') indexes.contract_type = idx;
      else if (headerStr === 'Организация контрагента') indexes.counterparty = idx;
      else if (headerStr === 'Сумма контракта') indexes.contract_sum = idx;
      else if (headerStr === 'Сумма тек. года') indexes.curr_year_sum = idx;
      else if (headerStr === 'Исполнено в тек. году') indexes.exec_curr_year = idx;
      else if (headerStr === 'Исполнено в прошлых периодах') indexes.exec_past_periods = idx;
      else if (headerStr === 'В исполнении') indexes.in_execution = idx;
      else if (headerStr === 'Сумма аванса') indexes.advance_sum = idx;
      else if (headerStr === 'Остаток') indexes.balance = idx;
      else if (headerStr === 'Общий остаток') indexes.total_balance = idx;
      else if (headerStr === 'Дата документа-основания') indexes.base_doc_date = idx;
      else if (headerStr === 'Дата начала действия') indexes.start_date = idx;
      else if (headerStr === 'Дата окончания действия') indexes.end_date = idx;
      else if (headerStr === 'Основание') indexes.osnovanie = idx;
      else if (headerStr === 'КЦСР') indexes.kcsr = idx;
      else if (headerStr === 'КВР') indexes.kvr = idx;
      else if (headerStr === 'КОСГУ') indexes.kosgu = idx;  
      else if (headerStr === 'КВФО') indexes.kvfo = idx;
    });
    
    return indexes;
  }

  // Парсинг данных таблицы
  static parseTableData(rows, startRow, colIndexes) {
    const results = [];
    
    for (let i = startRow; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      
      const doc_num = row[colIndexes.doc_num] ? String(row[colIndexes.doc_num]).trim() : '';
      
      // Пропускаем итоговые строки и пустые
      if (!doc_num || doc_num === 'Итого:' || doc_num === 'Итого') {
        continue;
      }
      
      // Парсим даты
      const doc_date = this.parseDate(row[colIndexes.doc_date]);
      const reg_date = this.parseDate(row[colIndexes.reg_date]);
      const exec_date = this.parseDate(row[colIndexes.exec_date]);
      const base_doc_date = this.parseDate(row[colIndexes.base_doc_date]);
      const start_date = this.parseDate(row[colIndexes.start_date]);
      const end_date = this.parseDate(row[colIndexes.end_date]);
      
      const record = {
        doc_num: doc_num,
        doc_status: row[colIndexes.doc_status] ? String(row[colIndexes.doc_status]).trim() : '',
        doc_date: doc_date,
        reg_date: reg_date,
        exec_date: exec_date,
        total_sum: this.parseNumber(row[colIndexes.total_sum]),
        contract_type: row[colIndexes.contract_type] ? String(row[colIndexes.contract_type]).trim() : '',
        counterparty: row[colIndexes.counterparty] ? String(row[colIndexes.counterparty]).trim() : '',
        contract_sum: this.parseNumber(row[colIndexes.contract_sum]),
        curr_year_sum: this.parseNumber(row[colIndexes.curr_year_sum]),
        exec_curr_year: this.parseNumber(row[colIndexes.exec_curr_year]),
        exec_past_periods: this.parseNumber(row[colIndexes.exec_past_periods]),
        in_execution: this.parseNumber(row[colIndexes.in_execution]),
        advance_sum: this.parseNumber(row[colIndexes.advance_sum]),
        balance: this.parseNumber(row[colIndexes.balance]),
        total_balance: this.parseNumber(row[colIndexes.total_balance]),
        base_doc_date: base_doc_date,
        start_date: start_date,
        end_date: end_date,
        osnovanie: row[colIndexes.osnovanie] ? String(row[colIndexes.osnovanie]).trim() : '',
        kcsr: row[colIndexes.kcsr] ? String(row[colIndexes.kcsr]).trim() : '',
        kvr: row[colIndexes.kvr] ? String(row[colIndexes.kvr]).trim() : '',
        kosgu: row[colIndexes.kosgu] ? String(row[colIndexes.kosgu]).trim() : '',
        kvfo: row[colIndexes.kvfo] ? String(row[colIndexes.kvfo]).trim() : ''
      };
      
      results.push(record);
    }
    
    return results;
  }

  // Парсинг даты из Excel
  static parseDate(value) {
    if (!value) return null;
    
    // Если это число Excel
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
      }
    }
    
    // Если это строка
    if (typeof value === 'string') {
      const parts = value.split('.');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    return null;
  }

  // Парсинг числа
  static parseNumber(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/\s/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  // Синхронизация с БД
  static async syncData(newData, api) {
    const results = {
      updated: 0,
      added: 0,
      errors: []
    };

    // Получаем существующие данные
    const response = await api.get('Summary');
    let existingData = [];
    if (response.data && response.data.contracts) {
      existingData = response.data.contracts;
    }
    
    console.log('Существующих записей:', existingData.length);

    // Создаем карту существующих записей по номеру документа
    const existingMap = new Map();
    existingData.forEach(item => {
      existingMap.set(item.doc_num, item);
    });

    // Обрабатываем каждую запись
    for (const record of newData) {
      try {
        if (existingMap.has(record.doc_num)) {
          // Обновляем существующую запись
          const existingRecord = existingMap.get(record.doc_num);
          await api.post(`Summary/edit/${existingRecord.id}`, record);
          results.updated++;
          console.log(`Обновлено: ${record.doc_num}`);
        } else {
          // Добавляем новую запись
          await api.post('Summary/create', record);
          results.added++;
          console.log(`Добавлено: ${record.doc_num}`);
        }
      } catch (error) {
        console.error(`Ошибка при обработке ${record.doc_num}:`, error.response?.data || error.message);
        results.errors.push({ record, error: error.message });
      }
    }

    return results;
  }
}

export default SummaryExcelService;