import * as XLSX from 'xlsx';

class ExcelService {
  
  static async importFromExcel(file, api) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          
          let workbook;
          try {
            workbook = XLSX.read(data, { type: 'array' });
          } catch (err) {
            workbook = XLSX.read(data, { 
              type: 'array',
              cellFormula: true,
              cellHTML: true,
              cellNF: true
            });
          }
          
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          const rows = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1, 
            defval: '',
            blankrows: false 
          });
          
          
          let startRow = -1;
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            
            for (let j = 0; j < row.length; j++) {
              const cell = row[j];
              if (cell && String(cell).trim() === 'КФСР') {
                startRow = i + 1;
                console.log('Найдена строка с заголовками КФСР на строке:', i);
                break;
              }
            }
            if (startRow !== -1) break;
          }
          
          if (startRow === -1) {
            reject(new Error('Не найдена строка с заголовками КФСР'));
            return;
          }
          
          const results = [];
          
          for (let i = startRow; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length < 5) continue;
            
            const kfsr = row[0] ? String(row[0]).trim() : '';
            const kcsr = row[1] ? String(row[1]).trim() : '';
            
            if (!kfsr || !kcsr || kfsr === 'Итого' || kcsr === 'Итого') {
              continue;
            }
            
            let payment2026 = row[6] ? this.parseNumber(row[6]) : 0;
            let payment2027 = row[7] ? this.parseNumber(row[7]) : 0;
            let payment2028 = row[8] ? this.parseNumber(row[8]) : 0;
            
            if (payment2026 === 0 && payment2027 === 0 && payment2028 === 0) {
              for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell && typeof cell === 'string') {
                  if (cell.includes('2026')) payment2026 = this.parseNumber(cell);
                  if (cell.includes('2027')) payment2027 = this.parseNumber(cell);
                  if (cell.includes('2028')) payment2028 = this.parseNumber(cell);
                }
              }
            }
            
            const record = {
              kfsr: kfsr,
              kcsr: kcsr,
              kvr: row[2] ? String(row[2]).trim() : '',
              kosgu: row[3] ? String(row[3]).trim() : '',
              kvfo: row[4] ? String(row[4]).trim() : '',
              Industry_code: row[5] ? String(row[5]).trim(): '',
              payment_plan_2026: payment2026,
              payment_plan_2027: payment2027,
              payment_plan_2028: payment2028
            };
            
            results.push(record);
          }
          
          console.log('Распарсено записей:', results.length);
          
          if (results.length === 0) {
            reject(new Error('Не найдено данных для импорта'));
            return;
          }
          
          const response = await api.get('execution/');
          const existingData = response.data.executions || [];
          const existingMap = new Map();
          
          existingData.forEach(item => {
            const key = `${item.kfsr}|${item.kcsr}|${item.kvr}|${item.kosgu}|${item.kvfo}|${item.Industry_code}`;
            existingMap.set(key, item);
          });
          
          let updated = 0;
          let added = 0;
          const errors = [];
          
          for (const record of results) {
            const key = `${record.kfsr}|${record.kcsr}|${record.kvr}|${record.kosgu}|${record.kvfo}|${record.Industry_code}`;
            
            try {
              if (existingMap.has(key)) {
                const existing = existingMap.get(key);
                await api.post(`execution/edit/${existing.id}`, record);
                updated++;
                console.log(`Обновлено: ${key}`);
              } else {
                await api.post('execution/create', record);
                added++;
                console.log(`Добавлено: ${key}`);
              }
            } catch (err) {
              console.error(`Ошибка при обработке ${key}:`, err.response?.data || err.message);
              errors.push({ record, error: err.message });
            }
          }
          
          resolve({ updated, added, errors });
          
        } catch (error) {
          console.error('Ошибка чтения файла:', error);
          reject(error);
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

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
}

export default ExcelService;