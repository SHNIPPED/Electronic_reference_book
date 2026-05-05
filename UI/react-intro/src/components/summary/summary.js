import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './summary.css';

ModuleRegistry.registerModules([AllCommunityModule]);

// Для форматирования чисел
const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(params.value);
};

// Функция для форматирования даты из ISO в локальный формат
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Простой текстовый редактор для дат
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingRows, setSavingRows] = useState(new Set());

  const [columnDefs] = useState([
    { 
      headerName: 'Номер документа', 
      field: 'doc_num', 
      width: 220, 
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      editable: true,
      resizable: true, // Позволяет пользователю вручную изменять размер
    },
    { 
      headerName: 'Статус документа', 
      field: 'doc_status', 
      width: 150,
      editable: true,
      resizable: true,
    },
    { 
      headerName: 'Дата документа', 
      field: 'doc_date', 
      width: 140,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Дата регистрации', 
      field: 'reg_date', 
      width: 150,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Дата принятия', 
      field: 'accept_date', 
      width: 140,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Дата исполнения', 
      field: 'exec_date', 
      width: 150,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Общая сумма', 
      field: 'total_sum', 
      width: 150, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Признак договора', 
      field: 'contract_type', 
      width: 160,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Однолетний', 'Многолетний']
      },
      resizable: true,
    },
    { 
      headerName: 'Организация контрагента', 
      field: 'counterparty', 
      width: 350,
      editable: true,
      wrapText: true,
      autoHeight: true,
      resizable: true,
    },
    { 
      headerName: 'Сумма контракта', 
      field: 'contract_sum', 
      width: 160, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Сумма тек. года', 
      field: 'curr_year_sum', 
      width: 150, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Исполнено в тек. году', 
      field: 'exec_curr_year', 
      width: 180, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Исполнено в прошлых периодах', 
      field: 'exec_past_periods', 
      width: 220, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'В исполнении', 
      field: 'in_execution', 
      width: 140, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Сумма аванса', 
      field: 'advance_sum', 
      width: 140, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Остаток', 
      field: 'balance', 
      width: 130, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Общий остаток', 
      field: 'total_balance', 
      width: 150, 
      editable: true,
      valueFormatter: formatNumber,
      cellDataType: 'number',
      resizable: true,
    },
    { 
      headerName: 'Прикреплен документ', 
      field: 'is_attached', 
      width: 180,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [0, 1]
      },
      valueFormatter: (params) => params.value === 1 ? 'Да' : 'Нет',
      resizable: true,
    },
    { 
      headerName: 'Дата документа-основания', 
      field: 'base_doc_date', 
      width: 220,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Дата начала действия', 
      field: 'start_date', 
      width: 180,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
    { 
      headerName: 'Дата окончания действия', 
      field: 'end_date', 
      width: 190,
      editable: true,
      cellEditor: SimpleTextEditor,
      valueFormatter: (params) => formatDate(params.value),
      resizable: true,
    },
  ]);

  const [rowData, setRowData] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || 'http://192.168.19.101:3001/';

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Загрузка данных
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
      console.error('Ошибка при загрузке данных:', err);
      setError(err.response?.data?.message || err.message);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Функция для сохранения изменений в БД
  const saveToDatabase = useCallback(async (row, changedFields) => {
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
        accept_date: formatDateForMySQL(row.accept_date),
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
        is_attached: row.is_attached ? 1 : 0,
        base_doc_date: formatDateForMySQL(row.base_doc_date),
        start_date: formatDateForMySQL(row.start_date),
        end_date: formatDateForMySQL(row.end_date)
      };
      
      await api.post(`Summary/edit/${row.id}`, dataToSend);
      
      console.log(`Строка ${row.id} успешно сохранена`);
      
      return true;
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Ошибка при сохранении: ${errorMsg}`);
      return false;
    } finally {
      setSavingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(row.id);
        return newSet;
      });
    }
  }, [savingRows]);

  // Функция при завершении редактирования ячейки
  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    
    if (newValue === oldValue) return;
    
    const updatedRow = { ...data, [colDef.field]: newValue };
    
    setRowData(prevData => prevData.map(item => 
      item.id === data.id ? updatedRow : item
    ));
    
    if (data.is_new) {
      const hasDocNum = updatedRow.doc_num && updatedRow.doc_num.trim() !== '';
      const hasCounterparty = updatedRow.counterparty && updatedRow.counterparty.trim() !== '';
      
      if (hasDocNum && hasCounterparty) {
        await saveNewRowToDB(updatedRow);
      }
      return;
    }
    
    console.log(`Сохранение изменений для строки ${data.id}, поле ${colDef.field}`);
    
    const success = await saveToDatabase(updatedRow);
    
    if (!success) {
      setRowData(prevData => prevData.map(item => 
        item.id === data.id ? data : item
      ));
    }
  }, [saveToDatabase]);

  // Сохранение новой строки в БД
  const saveNewRowToDB = useCallback(async (row) => {
    if (!row.is_new) return true;
    
    if (!row.doc_num || !row.doc_num.trim()) {
      alert('Заполните номер документа');
      return false;
    }
    
    if (!row.counterparty || !row.counterparty.trim()) {
      alert('Заполните организацию контрагента');
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
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYearStr = formatDateForMySQL(nextYearDate);
      
      const dataToSend = {
        doc_num: row.doc_num?.trim(),
        doc_status: row.doc_status || 'Черновик',
        doc_date: formatDateForMySQL(row.doc_date) || currentDate,
        total_sum: Number(row.total_sum) || 0,
        counterparty: row.counterparty?.trim(),
        end_date: formatDateForMySQL(row.end_date) || nextYearStr,
        reg_date: formatDateForMySQL(row.reg_date),
        accept_date: formatDateForMySQL(row.accept_date),
        exec_date: formatDateForMySQL(row.exec_date),
        contract_type: row.contract_type || '',
        is_attached: row.is_attached ? 1 : 0,
        contract_sum: row.contract_sum !== undefined ? Number(row.contract_sum) : (Number(row.total_sum) || 0),
        curr_year_sum: row.curr_year_sum !== undefined ? Number(row.curr_year_sum) : (Number(row.total_sum) || 0),
        exec_curr_year: Number(row.exec_curr_year) || 0,
        exec_past_periods: Number(row.exec_past_periods) || 0,
        in_execution: Number(row.in_execution) || 0,
        advance_sum: Number(row.advance_sum) || 0,
        balance: row.balance !== undefined ? Number(row.balance) : (Number(row.total_sum) || 0),
        total_balance: row.total_balance !== undefined ? Number(row.total_balance) : (Number(row.total_sum) || 0),
        base_doc_date: formatDateForMySQL(row.base_doc_date),
        start_date: formatDateForMySQL(row.start_date) || currentDate
      };
          
      const response = await api.post('Summary/create', dataToSend);
      
      if (response.data && response.data.id) {
        setRowData(prevData => prevData.map(item => {
          if (item.id === row.id) {
            return { 
              ...row,
              id: response.data.id,
              is_new: false,
            };
          }
          return item;
        }));
        console.log('Новая запись добавлена, ID:', response.data.id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Ошибка:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Ошибка сервера: ${errorMsg}`);
      
      setRowData(prevData => prevData.filter(item => item.id !== row.id));
      return false;
    }
  }, []);

  // Добавление новой пустой строки
  const handleAddRow = useCallback(() => {
    const tempId = -Date.now();
    const currentDate = new Date().toISOString();
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    
    const newRow = { 
      id: tempId,
      is_new: true,
      doc_num: '',
      doc_status: 'Черновик',
      doc_date: currentDate,
      total_sum: 0,
      counterparty: '',
      end_date: nextYearDate.toISOString(),
      reg_date: null,
      accept_date: null,
      exec_date: null,
      is_attached: 0,
      contract_sum: 0,
      curr_year_sum: 0,
      exec_curr_year: 0,
      exec_past_periods: 0,
      in_execution: 0,
      advance_sum: 0,
      balance: 0,
      total_balance: 0,
      contract_type: '',
      base_doc_date: null,
      start_date: currentDate
    };
    
    setRowData(prevData => [...prevData, newRow]);
    
    setTimeout(() => {
      if (gridRef.current) {
        const newRowIndex = rowData.length;
        gridRef.current.api.ensureIndexVisible(newRowIndex, 'bottom');
        setTimeout(() => {
          gridRef.current.api.startEditingCell({
            rowIndex: newRowIndex,
            colKey: 'doc_num'
          });
        }, 100);
      }
    }, 100);
  }, [rowData.length]);

  // Удаление выбранных строк
  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Вы уверены, что хотите удалить ${selectedNodes.length} запись(ей)?`)) {
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
        console.error('Ошибка при удалении записей:', err);
        alert('Ошибка при удалении записей: ' + (err.response?.data?.message || err.message));
      }
    } else if (newRows.length > 0) {
      alert(`Удалено ${newRows.length} новых записей`);
    }
  }, [fetchData]);


  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true, // Пользователь может вручную изменять размер
    editable: true,
  };

  if (loading) {
    return (
      <div className="summary-loading">
        <div>Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-error">
        <div className="summary-error-message">Ошибка: {error}</div>
        <button onClick={fetchData} className="summary-error-btn">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-toolbar">
        <button onClick={handleAddRow} className="summary-btn summary-btn-add">
          + Добавить строку
        </button>
        <button onClick={handleDeleteRow} className="summary-btn summary-btn-delete">
          - Удалить выбранные
        </button>
        <button onClick={fetchData} className="summary-btn summary-btn-refresh">
          Обновить
        </button>
        {savingRows.size > 0 && (
          <span className="summary-saving-indicator">
            Сохранение...
          </span>
        )}
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