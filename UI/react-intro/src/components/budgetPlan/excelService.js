import ExcelJS from 'exceljs';

class ExcelExportService {
  static async exportReportToExcel(rowData, filename = 'budget_report') {
    if (!rowData || rowData.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const formatNumber = (value) => {
      if (value === undefined || value === null || value === '' || value === 0) return null;
      const num = Number(value);
      if (isNaN(num)) return null;
      return num;
    };

    const formatDate = (dateString) => {
      if (!dateString) return null;
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      return d;
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Бюджетный отчет');

    // Колонки (21 штука)
    const columns = [
      { header: 'КФСР', key: 'kfsr', width: 8 },
      { header: 'КЦСР', key: 'kcsr', width: 18 },
      { header: 'Наименование КЦСР', key: 'name', width: 45 },
      { header: 'КВР', key: 'kvr', width: 8 },
      { header: 'КОСГУ', key: 'kosgu', width: 8 },
      { header: 'КВФО', key: 'kvfo', width: 8 },
      { header: 'Организация контрагента', key: 'counterparty', width: 40 },
      { header: 'дата договора', key: 'doc_date', width: 12 },
      { header: 'начало оказания услуг', key: 'start_date', width: 15 },
      { header: 'окончание оказания услуг', key: 'exec_date', width: 15 },
      { header: 'дата окончания договора', key: 'end_date', width: 15 },
      { header: 'План 2026 год', key: 'plan2026', width: 15 },
      { header: 'Обязательства - Принято обязательств по расходам 2026', key: 'obligations2026', width: 28 },
      { header: 'Выставлено счетов', key: 'invoices', width: 15 },
      { header: 'Оплачено всего, в т.ч.', key: 'paid', width: 18 },
      { header: 'Остаток для исполнения', key: 'balance', width: 18 },
      { header: 'Согласование служебок 2026 год', key: 'approvals2026', width: 22 },
      { header: 'План 2027', key: 'plan2027', width: 15 },
      { header: 'Обязательства - Принято обязательств по расходам 2027', key: 'obligations2027', width: 28 },
      { header: 'Согласование служебок 2027 год', key: 'approvals2027', width: 22 },
    ];
    worksheet.columns = columns;

    // Стиль для заголовков (первая строка)
    const headerRow = worksheet.getRow(1);
    for (let i = 1; i <= columns.length; i++) {
      const cell = headerRow.getCell(i);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1a56db' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      };
    }

    // Заполняем данные и применяем границы ко всем ячейкам
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const rowNumber = i + 2; 
      const values = [
        row.kfsr || '',
        row.type === 'total' ? 'Остаток:' : (row.type === 'child' ? (row.kcsr || '') : (row.kcsr || '')),
        row.type === 'parent' ? '' : (row.kcsr_name || ''),
        row.kvr || '',
        row.kosgu || '',
        row.kvfo || '',
        row.counterparty || '',
        formatDate(row.doc_date),
        formatDate(row.start_date),
        formatDate(row.exec_date),
        formatDate(row.end_date),
        formatNumber(row.plan_2026),
        formatNumber(row.obligations_2026),
        row.invoices || '',
        formatNumber(row.paid_total),
        formatNumber(row.balance_remain),
        formatNumber(row.approvals_2026),
        formatNumber(row.plan_2027),
        formatNumber(row.obligations_2027),
        formatNumber(row.approvals_2027),
      ];

      // Заполняем значения и сразу ставим границы
      for (let col = 1; col <= columns.length; col++) {
        const cell = worksheet.getCell(rowNumber, col);
        cell.value = values[col - 1];
        // Границы для каждой ячейки
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
        };
        // Выравнивание
        if (col === 1 || col === 2 || col === 3 || col === 7) {
          cell.alignment = { horizontal: 'left', vertical: 'center' };
        } else {
          cell.alignment = { horizontal: 'right', vertical: 'center' };
        }
        // Цвет фона и жирность для особых строк
        if (row.type === 'parent') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F7FF' } };
        } else if (row.type === 'total') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
          cell.font = { bold: true, italic: true };
        }
      }
    }

    // Формат дат для колонок 8,9,10,11
    for (let col of [8, 9, 10, 11]) {
      worksheet.getColumn(col).numFmt = 'dd.mm.yyyy';
    }

    // Сохраняем файл
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `${filename}_${date}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default ExcelExportService;