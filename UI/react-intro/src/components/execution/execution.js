import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './execution.css';

ModuleRegistry.registerModules([AllCommunityModule]);

// Форматирование чисел
const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Парсинг числа
const parseNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/\s/g, '')) || 0;
};

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

function Execution() {
  const gridRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowData, setRowData] = useState([]);

  // Столбцы по требованиям
  const [columnDefs] = useState([
    { 
      headerName: 'Бюджет', 
      field: 'budget', 
      width: 150,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: true,
    },
    { 
      headerName: 'Статус документа', 
      field: 'document_status', 
      width: 150,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Черновик', 'На согласовании', 'Утвержден', 'Отклонен', 'В архиве']
      }
    },
    { 
      headerName: 'Номер документа', 
      field: 'document_number', 
      width: 180,
      editable: true,
    },
    { 
      headerName: 'Дата документа', 
      field: 'document_date', 
      width: 140,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      headerName: 'Тип', 
      field: 'type', 
      width: 120,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['План', 'Факт', 'Корректировка']
      }
    },
    { 
      headerName: 'Дата утверждения', 
      field: 'approval_date', 
      width: 150,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      headerName: 'Дата регистрации', 
      field: 'registration_date', 
      width: 150,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      headerName: 'Дата регистрации изменения', 
      field: 'change_registration_date', 
      width: 200,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      headerName: 'Дата отправки в архив', 
      field: 'archive_send_date', 
      width: 180,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      headerName: 'Учреждение', 
      field: 'institution', 
      width: 200,
      editable: true,
      rowGroup: true,
      hide: true,
    },
    { 
      headerName: 'Учредитель', 
      field: 'founder', 
      width: 200,
      editable: true,
      rowGroup: true,
      hide: true,
    },
    { 
      headerName: 'Структура', 
      field: 'structure', 
      width: 200,
      editable: true,
    },
    { 
      headerName: 'Остаток на начало периода 1 год', 
      field: 'balance_start_year1', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Остаток на начало периода 2 год', 
      field: 'balance_start_year2', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Остаток на начало периода 3 год', 
      field: 'balance_start_year3', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Остаток на конец периода 1 год', 
      field: 'balance_end_year1', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Остаток на конец периода 2 год', 
      field: 'balance_end_year2', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Остаток на конец периода 3 год', 
      field: 'balance_end_year3', 
      width: 220,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Поступления 1 год', 
      field: 'income_year1', 
      width: 180,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Поступления 2 год', 
      field: 'income_year2', 
      width: 180,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Поступления 3 год', 
      field: 'income_year3', 
      width: 180,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Выплаты 1 год', 
      field: 'payment_year1', 
      width: 160,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Выплаты 2 год', 
      field: 'payment_year2', 
      width: 160,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Выплаты 3 год', 
      field: 'payment_year3', 
      width: 160,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Поступления за пределами планирования', 
      field: 'income_beyond_planning', 
      width: 260,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      aggFunc: 'sum',
    },
    { 
      headerName: 'Комментарий', 
      field: 'comment', 
      width: 250,
      editable: true,
      wrapText: true,
      autoHeight: true,
    },
    { 
      headerName: 'Количество ЭП ЭД', 
      field: 'ep_ed_count', 
      width: 160,
      editable: true,
      cellDataType: 'number',
    },
    { 
      headerName: 'Количество ЭП Вложенный', 
      field: 'ep_attached_count', 
      width: 180,
      editable: true,
      cellDataType: 'number',
    },
  ]);

  // Колонки для группировки
  const [autoGroupColumnDef] = useState({
    headerName: 'Группировка',
    field: 'group',
    width: 250,
    pinned: 'left',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
    editable: false,
  });

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
      const response = await api.get('Execution');
      
      let data = [];
      if (response.data && response.data.documents && Array.isArray(response.data.documents)) {
        data = response.data.documents;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      setRowData(data);
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

  // Сохранение при изменении ячейки
  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    
    if (newValue === oldValue) return;
    if (data.__node_type === 'group') return;
    
    const updatedRow = { ...data, [colDef.field]: newValue };
    
    setRowData(prevData => prevData.map(item => 
      item.id === data.id ? updatedRow : item
    ));
    
    try {
      await api.post(`Execution/edit/${data.id}`, updatedRow);
      console.log(`Строка ${data.id} сохранена`);
    } catch (err) {
      console.error('Ошибка:', err);
      alert(`Ошибка: ${err.response?.data?.message || err.message}`);
      setRowData(prevData => prevData.map(item => 
        item.id === data.id ? data : item
      ));
    }
  }, []);

  // Добавление строки
  const handleAddRow = useCallback(() => {
    const tempId = -Date.now();
    const currentDate = new Date().toISOString();
    
    const newRow = { 
      id: tempId,
      is_new: true,
      budget: '',
      document_status: 'Черновик',
      document_number: '',
      document_date: currentDate,
      type: '',
      approval_date: null,
      registration_date: null,
      change_registration_date: null,
      archive_send_date: null,
      institution: '',
      founder: '',
      structure: '',
      balance_start_year1: 0,
      balance_start_year2: 0,
      balance_start_year3: 0,
      balance_end_year1: 0,
      balance_end_year2: 0,
      balance_end_year3: 0,
      income_year1: 0,
      income_year2: 0,
      income_year3: 0,
      payment_year1: 0,
      payment_year2: 0,
      payment_year3: 0,
      income_beyond_planning: 0,
      comment: '',
      ep_ed_count: 0,
      ep_attached_count: 0
    };
    
    setRowData(prevData => [...prevData, newRow]);
    
    setTimeout(() => {
      if (gridRef.current) {
        const newRowIndex = rowData.length;
        gridRef.current.api.ensureIndexVisible(newRowIndex, 'bottom');
        setTimeout(() => {
          gridRef.current.api.startEditingCell({
            rowIndex: newRowIndex,
            colKey: 'document_number'
          });
        }, 100);
      }
    }, 100);
  }, [rowData.length]);

  // Удаление строк
  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Удалить ${selectedNodes.length} запись(ей)?`)) {
      return;
    }
    
    const selectedRows = selectedNodes.map(node => node.data);
    const existingRows = selectedRows.filter(row => !row.is_new && !row.__node_type);
    const newRows = selectedRows.filter(row => row.is_new);
    
    if (newRows.length > 0) {
      setRowData(prevData => prevData.filter(row => !newRows.some(r => r.id === row.id)));
    }
    
    if (existingRows.length > 0) {
      try {
        const deletePromises = existingRows.map(row => api.delete(`Execution/delete/${row.id}`));
        await Promise.all(deletePromises);
        await fetchData();
        alert(`Удалено ${existingRows.length} записей`);
      } catch (err) {
        console.error('Ошибка:', err);
        alert('Ошибка при удалении');
      }
    }
  }, [fetchData]);

  const onGridReady = useCallback((params) => {
    params.api.expandAll();
  }, []);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  if (loading) {
    return <div className="execution-loading">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="execution-error">
        <div>Ошибка: {error}</div>
        <button onClick={fetchData}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="execution-container">
      <div className="execution-toolbar">
        <button onClick={handleAddRow} className="execution-btn-add">+ Добавить строку</button>
        <button onClick={handleDeleteRow} className="execution-btn-delete">- Удалить выбранные</button>
        <button onClick={fetchData} className="execution-btn-refresh">🔄 Обновить</button>
      </div>

      <div className="execution-grid-container ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          groupDisplayType="singleColumn"
          groupDefaultExpanded={-1}
          groupIncludeFooter={true}
        />
      </div>
    </div>
  );
}

export default Execution;