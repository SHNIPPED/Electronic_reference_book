import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import SummaryExcelService from './summaryExcelService';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './summary.css';

ModuleRegistry.registerModules([AllCommunityModule]);

// Форматирование чисел
const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(params.value);
};

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Редактор дат
class SimpleTextEditor {
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
      if (event.key === 'Enter') {
        this.stopEditing();
      } else if (event.key === 'Escape') {
        this.cancelEditing();
      }
    });
    
    this.input.addEventListener('blur', () => {
      this.stopEditing();
    });
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
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return null;
  }
  
  getGui() {
    return this.input;
  }
  
  afterGuiAttached() {
    this.input.focus();
    this.input.select();
  }
  
  getValue() {
    const parsedDate = this.parseDateFromInput(this.input.value);
    return parsedDate;
  }
  
  stopEditing() {
    this.params.stopEditing();
  }
  
  cancelEditing() {
    this.params.stopEditing(true);
  }
}

function Summary() {
  const gridRef = useRef();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingRows, setSavingRows] = useState(new Set());
  const navigate = useNavigate();

  const [columnDefs] = useState([
    { headerName: 'Номер документа', field: 'doc_num', width: 180, pinned: 'left', checkboxSelection: true, headerCheckboxSelection: true, editable: true, resizable: true },
    { headerName: 'Статус документа', field: 'doc_status', width: 150, editable: true, resizable: true },
    { headerName: 'Дата документа', field: 'doc_date', width: 140, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата регистрации', field: 'reg_date', width: 150, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата исполнения', field: 'exec_date', width: 150, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Общая сумма', field: 'total_sum', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Признак договора', field: 'contract_type', width: 160, editable: true, resizable: true },
    { headerName: 'Организация контрагента', field: 'counterparty', width: 350, editable: true, wrapText: true, autoHeight: true, resizable: true },
    { headerName: 'Сумма контракта', field: 'contract_sum', width: 160, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Сумма тек. года', field: 'curr_year_sum', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Исполнено в тек. году', field: 'exec_curr_year', width: 180, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Исполнено в прошлых периодах', field: 'exec_past_periods', width: 220, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'В исполнении', field: 'in_execution', width: 140, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Сумма аванса', field: 'advance_sum', width: 140, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Остаток', field: 'balance', width: 130, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Общий остаток', field: 'total_balance', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Дата документа-основания', field: 'base_doc_date', width: 200, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата начала действия', field: 'start_date', width: 180, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата окончания действия', field: 'end_date', width: 190, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Основание', field: 'osnovanie', width: 300, editable: true, wrapText: true, autoHeight: true, resizable: true },
    { headerName: 'КЦСР', field: 'kcsr', width: 120, editable: true, resizable: true },
    { headerName: 'КВР', field: 'kvr', width: 100, editable: true, resizable: true },
    { headerName: 'КОСГУ', field: 'kosgu', width: 100, editable: true, resizable: true },  // Новая колонка
    { headerName: 'КВФО', field: 'kvfo', width: 100, editable: true, resizable: true }
]);

  const [rowData, setRowData] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || 'http://192.168.19.101:3001/';

  const api = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('Summary');
      if (response.data && response.data.contracts && Array.isArray(response.data.contracts)) {
        setRowData(response.data.contracts);
      } else if (Array.isArray(response.data)) {
        setRowData(response.data);
      } else {
        setRowData([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err.response?.data?.message || err.message);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Импорт из Excel
  const handleImport = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const results = await SummaryExcelService.importFromExcel(file, api);
      
      await fetchData();

      let message = `Импорт завершен!\n`;
      message += `Добавлено: ${results.added}\n`;
      message += `Обновлено: ${results.updated}\n`;
      if (results.errors.length > 0) {
        message += `Ошибок: ${results.errors.length}`;
      }
      alert(message);

    } catch (error) {
      console.error('Ошибка импорта:', error);
      alert(`Ошибка при импорте: ${error.message}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [fetchData]);

  const saveToDatabase = useCallback(async (row) => {
    if (savingRows.has(row.id)) return false;
    setSavingRows(prev => new Set(prev).add(row.id));
    
    try {
        const formatDateForMySQL = (date) => {
            if (!date) return null;
            const d = new Date(date);
            if (isNaN(d.getTime())) return null;
            return d.toISOString().split('T')[0];
        };
        
        const dataToSend = {
            doc_num: row.doc_num,
            doc_status: row.doc_status,
            doc_date: formatDateForMySQL(row.doc_date),
            reg_date: formatDateForMySQL(row.reg_date),
            exec_date: formatDateForMySQL(row.exec_date),
            total_sum: Number(row.total_sum) || 0,
            contract_type: row.contract_type || '',
            counterparty: row.counterparty || '',
            contract_sum: Number(row.contract_sum) || 0,
            curr_year_sum: Number(row.curr_year_sum) || 0,
            exec_curr_year: Number(row.exec_curr_year) || 0,
            exec_past_periods: Number(row.exec_past_periods) || 0,
            in_execution: Number(row.in_execution) || 0,
            advance_sum: Number(row.advance_sum) || 0,
            balance: Number(row.balance) || 0,
            total_balance: Number(row.total_balance) || 0,
            base_doc_date: formatDateForMySQL(row.base_doc_date),
            start_date: formatDateForMySQL(row.start_date),
            end_date: formatDateForMySQL(row.end_date),
            osnovanie: row.osnovanie || '',
            kcsr: row.kcsr || '',
            kvr: row.kvr || '',
            kosgu: row.kosgu || '',  // Добавлено
            kvfo: row.kvfo || ''
        };
        
        await api.post(`Summary/edit/${row.id}`, dataToSend);
        return true;
    } catch (err) {
        console.error('Ошибка сохранения:', err);
        alert(`Ошибка: ${err.response?.data?.message || err.message}`);
        return false;
    } finally {
        setSavingRows(prev => { const newSet = new Set(prev); newSet.delete(row.id); return newSet; });
    }
}, []);

const saveNewRowToDB = useCallback(async (row) => {
  if (!row.is_new) return true;
  
  if (!row.doc_num || !row.doc_num.trim()) {
      alert('Заполните номер документа');
      return false;
  }
  
  try {
      const formatDateForMySQL = (date) => {
          if (!date) return null;
          const d = new Date(date);
          if (isNaN(d.getTime())) return null;
          return d.toISOString().split('T')[0];
      };
      
      const currentDate = formatDateForMySQL(new Date());
      
      const dataToSend = {
          doc_num: row.doc_num?.trim(),
          doc_status: row.doc_status || 'Черновик',
          doc_date: formatDateForMySQL(row.doc_date) || currentDate,
          reg_date: formatDateForMySQL(row.reg_date),
          exec_date: formatDateForMySQL(row.exec_date),
          total_sum: Number(row.total_sum) || 0,
          contract_type: row.contract_type || '',
          counterparty: row.counterparty || '',
          contract_sum: Number(row.contract_sum) || 0,
          curr_year_sum: Number(row.curr_year_sum) || 0,
          exec_curr_year: Number(row.exec_curr_year) || 0,
          exec_past_periods: Number(row.exec_past_periods) || 0,
          in_execution: Number(row.in_execution) || 0,
          advance_sum: Number(row.advance_sum) || 0,
          balance: Number(row.balance) || 0,
          total_balance: Number(row.total_balance) || 0,
          base_doc_date: formatDateForMySQL(row.base_doc_date),
          start_date: formatDateForMySQL(row.start_date) || currentDate,
          end_date: formatDateForMySQL(row.end_date),
          osnovanie: row.osnovanie || '',
          kcsr: row.kcsr || '',
          kvr: row.kvr || '',
          kosgu: row.kosgu || '',  // Добавлено
          kvfo: row.kvfo || ''
      };
          
      const response = await api.post('Summary/create', dataToSend);
      
      if (response.data && response.data.id) {
          setRowData(prevData => prevData.map(item => {
              if (item.id === row.id) {
                  return { ...row, id: response.data.id, is_new: false };
              }
              return item;
          }));
          return true;
      }
      return false;
  } catch (err) {
      console.error('Ошибка:', err);
      alert(`Ошибка сервера: ${err.response?.data?.message || err.message}`);
      setRowData(prevData => prevData.filter(item => item.id !== row.id));
      return false;
  }
}, []);

  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    
    const updatedRow = { ...data, [colDef.field]: newValue };
    setRowData(prevData => prevData.map(item => item.id === data.id ? updatedRow : item));
    
    if (data.is_new) {
      const hasDocNum = updatedRow.doc_num && updatedRow.doc_num.trim() !== '';
      if (hasDocNum) {
        await saveNewRowToDB(updatedRow);
      }
      return;
    }
    
    const success = await saveToDatabase(updatedRow);
    if (!success) {
      setRowData(prevData => prevData.map(item => item.id === data.id ? data : item));
    }
  }, [saveToDatabase, saveNewRowToDB]);

  const handleAddRow = useCallback(() => {
    const tempId = -Date.now();
    const currentDate = new Date().toISOString();
    
    const newRow = { 
        id: tempId,
        is_new: true,
        doc_num: '',
        doc_status: 'Черновик',
        doc_date: currentDate,
        reg_date: null,
        exec_date: null,
        total_sum: 0,
        contract_type: '',
        counterparty: '',
        contract_sum: 0,
        curr_year_sum: 0,
        exec_curr_year: 0,
        exec_past_periods: 0,
        in_execution: 0,
        advance_sum: 0,
        balance: 0,
        total_balance: 0,
        base_doc_date: null,
        start_date: currentDate,
        end_date: null,
        osnovanie: '',
        kcsr: '',
        kvr: '',
        kosgu: '', 
        kvfo: ''
    };
    
    setRowData(prevData => [...prevData, newRow]);
    
    setTimeout(() => {
        if (gridRef.current) {
            const newRowIndex = rowData.length;
            gridRef.current.api.ensureIndexVisible(newRowIndex, 'bottom');
            setTimeout(() => {
                gridRef.current.api.startEditingCell({ rowIndex: newRowIndex, colKey: 'doc_num' });
            }, 100);
        }
    }, 100);
}, [rowData.length]);

  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    
    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedNodes.length} запись(ей)?`)) {
      return;
    }
    
    const selectedRows = selectedNodes.map(node => node.data);
    const newRows = selectedRows.filter(row => row.is_new);
    const existingRows = selectedRows.filter(row => !row.is_new);
    
    if (newRows.length > 0) {
      setRowData(prevData => prevData.filter(row => !newRows.some(newRow => newRow.id === row.id)));
    }
    
    if (existingRows.length > 0) {
      try {
        const deletePromises = existingRows.map(row => api.delete(`Summary/delete/${row.id}`));
        await Promise.all(deletePromises);
        await fetchData();
        alert(`Удалено ${existingRows.length} записей`);
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Ошибка при удалении записей: ' + (err.response?.data?.message || err.message));
      }
    }
  }, [fetchData]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  if (loading) {
    return <div className="summary-loading"><div>Загрузка данных...</div></div>;
  }

  if (error) {
    return (
      <div className="summary-error">
        <div className="summary-error-message">Ошибка: {error}</div>
        <button onClick={fetchData} className="summary-error-btn">Повторить попытку</button>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-toolbar">
        <button onClick={handleAddRow} className="summary-btn summary-btn-add">+ Добавить строку</button>
        <button onClick={handleDeleteRow} className="summary-btn summary-btn-delete">- Удалить выбранные</button>
        <button onClick={fetchData} className="summary-btn summary-btn-refresh">Обновить</button>
        <button onClick={() => fileInputRef.current.click()} className="summary-btn summary-btn-import">
          Загрузить из Excel
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.xlt,.xltx"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        {savingRows.size > 0 && <span className="summary-saving-indicator">Сохранение...</span>}
        <button className="summary-btn summary-btn-nav" onClick={() => navigate("/execution")}>
          Перейти к ПФХД
        </button>
      </div>

      <div className="summary-grid-container ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={false}
        />
      </div>
    </div>
  );
}

export default Summary;