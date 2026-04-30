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

function Summary() {
  const gridRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [columnDefs] = useState([
    { 
      headerName: 'Номер документа', 
      field: 'doc_num', 
      width: 220, 
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    { headerName: 'Статус документа', field: 'doc_status', width: 150 },
    { 
      headerName: 'Дата документа', 
      field: 'doc_date', 
      width: 140,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Дата регистрации', 
      field: 'reg_date', 
      width: 150,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Дата принятия', 
      field: 'accept_date', 
      width: 140,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Дата исполнения', 
      field: 'exec_date', 
      width: 150,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Общая сумма', 
      field: 'total_sum', 
      width: 150, 
      valueFormatter: formatNumber 
    },
    { headerName: 'Признак договора', field: 'contract_type', width: 160 },
    { headerName: 'Организация контрагента', field: 'counterparty', width: 300 },
    { 
      headerName: 'Сумма контракта', 
      field: 'contract_sum', 
      width: 160, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Сумма тек. года', 
      field: 'curr_year_sum', 
      width: 150, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Исполнено в тек. году', 
      field: 'exec_curr_year', 
      width: 180, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Исполнено в прошлых периодах', 
      field: 'exec_past_periods', 
      width: 220, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'В исполнении', 
      field: 'in_execution', 
      width: 140, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Сумма аванса', 
      field: 'advance_sum', 
      width: 140, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Остаток', 
      field: 'balance', 
      width: 130, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Общий остаток', 
      field: 'total_balance', 
      width: 150, 
      valueFormatter: formatNumber 
    },
    { 
      headerName: 'Прикреплен документ', 
      field: 'is_attached', 
      width: 180,
      valueFormatter: (params) => params.value === 1 ? 'Да' : 'Нет'
    },
    { 
      headerName: 'Дата документа-основания', 
      field: 'base_doc_date', 
      width: 220,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Дата начала действия', 
      field: 'start_date', 
      width: 180,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      headerName: 'Дата окончания действия', 
      field: 'end_date', 
      width: 190,
      valueFormatter: (params) => formatDate(params.value)
    },
  ]);

  const [rowData, setRowData] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/';

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

  // Добавление новой пустой строки
  const handleAddRow = useCallback(() => {
    const tempId = -Date.now();
    const currentDate = new Date().toISOString();
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    
    const newRow = { 
      id: tempId,
      is_new: true,
      saving: false,
      // Основные поля
      doc_num: '',
      doc_status: 'Черновик',
      doc_date: currentDate,
      total_sum: 0,
      counterparty: '',
      end_date: nextYearDate.toISOString(),
      // Остальные поля с значениями по умолчанию
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
    
    // Прокручиваем и начинаем редактирование
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

  // Сохранение новой строки в БД
  const saveNewRowToDB = useCallback(async (row) => {
    try {
      
      if (!row.is_new) {
        return true;
      }
      
      // Проверяем обязательные поля
      if (!row.doc_num || !row.doc_num.trim()) {
        alert('Заполните номер документа');
        return false;
      }
      
      if (!row.counterparty || !row.counterparty.trim()) {
        alert('Заполните организацию контрагента');
        return false;
      }
      
      // Форматируем даты для MySQL (YYYY-MM-DD)
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };
      
      const currentDate = formatDate(new Date());
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYearStr = formatDate(nextYearDate);
      
      // Отправляем ВСЕ поля на сервер
      const dataToSend = {
        // Обязательные поля
        doc_num: row.doc_num?.trim(),
        doc_status: row.doc_status || 'Черновик',
        doc_date: formatDate(row.doc_date) || currentDate,
        total_sum: Number(row.total_sum) || 0,
        counterparty: row.counterparty?.trim(),
        end_date: formatDate(row.end_date) || nextYearStr,
        
        // Дополнительные поля
        reg_date: formatDate(row.reg_date),
        accept_date: formatDate(row.accept_date),
        exec_date: formatDate(row.exec_date),
        contract_type: row.contract_type || '',
        is_attached: row.is_attached !== undefined ? row.is_attached : 0,
        contract_sum: row.contract_sum !== undefined ? Number(row.contract_sum) : (Number(row.total_sum) || 0),
        curr_year_sum: row.curr_year_sum !== undefined ? Number(row.curr_year_sum) : (Number(row.total_sum) || 0),
        exec_curr_year: Number(row.exec_curr_year) || 0,
        exec_past_periods: Number(row.exec_past_periods) || 0,
        in_execution: Number(row.in_execution) || 0,
        advance_sum: Number(row.advance_sum) || 0,
        balance: row.balance !== undefined ? Number(row.balance) : (Number(row.total_sum) || 0),
        total_balance: row.total_balance !== undefined ? Number(row.total_balance) : (Number(row.total_sum) || 0),
        base_doc_date: formatDate(row.base_doc_date),
        start_date: formatDate(row.start_date) || currentDate
      };
          
      const response = await api.post('Summary/create', dataToSend);
      
      if (response.data && response.data.id) {
        // Обновляем строку, сохраняя ВСЕ заполненные пользователем данные
        setRowData(prevData => prevData.map(item => {
          if (item.id === row.id) {
            return { 
              ...row,                    // Сохраняем все текущие данные пользователя
              id: response.data.id,      // Обновляем временный ID на реальный из БД
              is_new: false,             // Убираем маркер новой строки
              saving: false              // Убираем флаг сохранения
            };
          }
          return item;
        }));
        alert('Запись успешно добавлена!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Ошибка:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Ошибка сервера: ${errorMsg}`);
      
      // Если ошибка, удаляем временную строку
      setRowData(prevData => prevData.filter(item => item.id !== row.id));
      return false;
    }
  }, []);

  // При завершении редактирования ячейки
  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    
    if (newValue === oldValue) return;
    
    // Обновляем данные в состоянии
    const updatedRow = { ...data, [colDef.field]: newValue };
    
    // Обновляем состояние
    setRowData(prevData => prevData.map(item => 
      item.id === data.id ? updatedRow : item
    ));
    
    // Если это новая строка, проверяем обязательные поля
    if (data.is_new && !data.saving) {
      // Проверяем, заполнены ли обязательные поля (doc_num и counterparty)
      const hasDocNum = updatedRow.doc_num && updatedRow.doc_num.trim() !== '';
      const hasCounterparty = updatedRow.counterparty && updatedRow.counterparty.trim() !== '';
      
      // Если оба обязательных поля заполнены
      if (hasDocNum && hasCounterparty) {
        // Помечаем, что начали сохранение
        setRowData(prevData => prevData.map(item => 
          item.id === data.id ? { ...item, saving: true } : item
        ));
        
        // Сохраняем в БД
        const success = await saveNewRowToDB(updatedRow);
        
        if (!success) {
          // Если сохранение не удалось, снимаем флаг
          setRowData(prevData => prevData.map(item => 
            item.id === data.id ? { ...item, saving: false } : item
          ));
        }
      }
    } else if (!data.is_new) {
      // Существующая строка - обновляем в БД
      try {
        await api.post(`Summary/edit/${data.id}`, updatedRow);
        console.log('Запись обновлена:', data.id);
      } catch (err) {
        console.error('Ошибка при обновлении:', err);
        alert('Ошибка при обновлении: ' + (err.response?.data?.message || err.message));
        // Откатываем изменение
        setRowData(prevData => prevData.map(item => 
          item.id === data.id ? data : item
        ));
      }
    }
  }, [saveNewRowToDB]);

  // Удаление выбранных строк
  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    
    const selectedRows = selectedNodes.map(node => node.data);
    const newRows = selectedRows.filter(row => row.is_new);
    const existingRows = selectedRows.filter(row => !row.is_new);
    
    // Удаляем новые строки из локального состояния
    if (newRows.length > 0) {
      setRowData(prevData => prevData.filter(row => !newRows.some(newRow => newRow.id === row.id)));
    }
    
    // Удаляем существующие строки из БД
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

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onRowDataUpdated = useCallback(() => {
    // Автоматически начинаем редактирование новой строки
    if (gridRef.current) {
      const newRow = rowData.find(row => row.is_new && row.doc_num === '');
      if (newRow) {
        const rowIndex = rowData.findIndex(row => row.id === newRow.id);
        if (rowIndex !== -1) {
          setTimeout(() => {
            gridRef.current.api.startEditingCell({
              rowIndex: rowIndex,
              colKey: 'doc_num'
            });
          }, 100);
        }
      }
    }
  }, [rowData]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
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
          🔄 Обновить
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
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          onRowDataUpdated={onRowDataUpdated}
          stopEditingWhenCellsLoseFocus={true}
        />
      </div>
    </div>
  );
}

export default Summary;