import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import api from '../../api/axiosInstance.js'
import ExcelService from './excelService.js';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './execution.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(params.value);
};

const parseNumber = (value) => {
  if (!value) return 0;
  if (typeof value === 'string') {
    return parseFloat(value.replace(/\s/g, '').replace(',', '.')) || 0;
  }
  return parseFloat(value) || 0;
};

function Execution() {
  const gridRef = useRef();
  const fileInputRef = useRef();
  const saveTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingRows, setSavingRows] = useState(new Set());
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [selectedSummary, setSelectedSummary] = useState({
    payment_plan_2026: 0,
    payment_plan_2027: 0,
    payment_plan_2028: 0
  });
  const navigate = useNavigate();

  const [columnDefs] = useState([
    { headerName: 'КФСР', field: 'kfsr', width: 120, pinned: 'left', editable: true, resizable: true },
    { headerName: 'КЦСР', field: 'kcsr', width: 150, pinned: 'left', editable: true, resizable: true },
    { headerName: 'КВР', field: 'kvr', width: 100, editable: true, resizable: true },
    { headerName: 'КОСГУ', field: 'kosgu', width: 100, editable: true, resizable: true },
    { headerName: 'КВФО', field: 'kvfo', width: 100, editable: true, resizable: true },
    { headerName: 'Отраслевой код', field: 'Industry_code', width: 320, editable: true, resizable: true },
    { 
      headerName: 'Выплаты - План с изменениями 2026', 
      field: 'payment_plan_2026', 
      width: 320,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      cellDataType: 'number',
      resizable: true 
    },
    { 
      headerName: 'Выплаты - План с изменениями 2027', 
      field: 'payment_plan_2027', 
      width: 320,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      cellDataType: 'number',
      resizable: true 
    },
    { 
      headerName: 'Выплаты - План с изменениями 2028', 
      field: 'payment_plan_2028', 
      width: 320,
      editable: true,
      valueFormatter: formatNumber,
      valueSetter: (params) => {
        params.data[params.colDef.field] = parseNumber(params.newValue);
        return true;
      },
      cellDataType: 'number',
      resizable: true 
    }
  ]);

  const [rowData, setRowData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('execution/');
      let data = [];
      if (response.data && response.data.executions && Array.isArray(response.data.executions)) {
        data = response.data.executions;
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

  const updateSingleRow = useCallback((updatedRow) => {
    if (!gridRef.current) return;
    gridRef.current.api.applyTransaction({ update: [updatedRow] });
  }, []);

  const updateSelectedSummary = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      setSelectedRowsCount(0);
      setSelectedSummary({ payment_plan_2026: 0, payment_plan_2027: 0, payment_plan_2028: 0 });
      return;
    }

    let sum2026 = 0;
    let sum2027 = 0;
    let sum2028 = 0;

    selectedNodes.forEach(node => {
      const data = node.data;
      sum2026 += parseNumber(data.payment_plan_2026);
      sum2027 += parseNumber(data.payment_plan_2027);
      sum2028 += parseNumber(data.payment_plan_2028);
    });

    setSelectedRowsCount(selectedNodes.length);
    setSelectedSummary({
      payment_plan_2026: sum2026,
      payment_plan_2027: sum2027,
      payment_plan_2028: sum2028
    });
  }, []);

  const onSelectionChanged = useCallback(() => {
    updateSelectedSummary();
  }, [updateSelectedSummary]);

  const handleImport = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.match(/\.(xlsx)$/i)) {
      alert('Пожалуйста, выберите файл Excel (.xlt)');
      return;
    }
    setLoading(true);
    try {
      const results = await ExcelService.importFromExcel(file, api);
      await fetchData();
      let message = `Импорт завершен!\n`;
      message += `Добавлено: ${results.added}\n`;
      message += `Обновлено: ${results.updated}\n`;
      if (results.errors.length > 0) message += `Ошибок: ${results.errors.length}`;
      alert(message);
    } catch (error) {
      console.error('Ошибка импорта:', error);
      alert(`Ошибка при импорте: ${error.message}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [fetchData]);

  const saveToDatabase = useCallback(async (row) => {
    if (savingRows.has(row.id)) return false;
    setSavingRows(prev => new Set(prev).add(row.id));
    try {
      const dataToSend = {
        kfsr: row.kfsr || '',
        kcsr: row.kcsr || '',
        kvr: row.kvr || '',
        kosgu: row.kosgu || '',
        kvfo: row.kvfo || '',
        payment_plan_2026: parseNumber(row.payment_plan_2026),
        payment_plan_2027: parseNumber(row.payment_plan_2027),
        payment_plan_2028: parseNumber(row.payment_plan_2028)
      };
      await api.post(`execution/edit/${row.id}`, dataToSend);
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
    try {
      const dataToSend = {
        kfsr: row.kfsr || '',
        kcsr: row.kcsr || '',
        kvr: row.kvr || '',
        kosgu: row.kosgu || '',
        kvfo: row.kvfo || '',
        payment_plan_2026: parseNumber(row.payment_plan_2026),
        payment_plan_2027: parseNumber(row.payment_plan_2027),
        payment_plan_2028: parseNumber(row.payment_plan_2028)
      };
      const response = await api.post('execution/create', dataToSend);
      if (response.data && response.data.id) {
        const savedRow = { ...row, id: response.data.id, is_new: false };
        updateSingleRow(savedRow);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Ошибка создания:', err);
      alert(`Ошибка сервера: ${err.response?.data?.message || err.message}`);
      setRowData(prevData => prevData.filter(item => item.id !== row.id));
      return false;
    }
  }, [updateSingleRow]);

  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    
    const updatedRow = { ...data, [colDef.field]: newValue };
    updateSingleRow(updatedRow);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    if (data.is_new) {
      const hasAllRequired = 
        updatedRow.kfsr && updatedRow.kfsr.trim() !== '' &&
        updatedRow.kcsr && updatedRow.kcsr.trim() !== '' &&
        updatedRow.kvr && updatedRow.kvr.trim() !== '' &&
        updatedRow.kosgu && updatedRow.kosgu.trim() !== '' &&
        updatedRow.kvfo && updatedRow.kvfo.trim() !== '';
      
      if (hasAllRequired) {
        saveTimeoutRef.current = setTimeout(async () => {
          await saveNewRowToDB(updatedRow);
          saveTimeoutRef.current = null;
        }, 300);
      }
      return;
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      const success = await saveToDatabase(updatedRow);
      if (!success) {
        updateSingleRow(data);
      }
      saveTimeoutRef.current = null;
    }, 300);
  }, [saveToDatabase, saveNewRowToDB, updateSingleRow]);

  const handleAddRow = useCallback(() => {
    const tempId = -Date.now();
    const newRow = { 
      id: tempId,
      is_new: true,
      kfsr: '',
      kcsr: '',
      kvr: '',
      kosgu: '',
      kvfo: '',
      payment_plan_2026: 0,
      payment_plan_2027: 0,
      payment_plan_2028: 0
    };
    setRowData(prevData => [...prevData, newRow]);
    setTimeout(() => {
      if (gridRef.current) {
        const newRowIndex = rowData.length;
        gridRef.current.api.ensureIndexVisible(newRowIndex, 'bottom');
        setTimeout(() => {
          gridRef.current.api.startEditingCell({ rowIndex: newRowIndex, colKey: 'kfsr' });
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
    const existingRows = selectedRows.filter(row => !row.is_new);
    const newRows = selectedRows.filter(row => row.is_new);
    
    if (newRows.length > 0) {
      setRowData(prevData => prevData.filter(row => !newRows.some(r => r.id === row.id)));
    }
    if (existingRows.length > 0) {
      try {
        const deletePromises = existingRows.map(row => api.delete(`execution/delete/${row.id}`));
        await Promise.all(deletePromises);
        await fetchData();
        alert(`Удалено ${existingRows.length} записей`);
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert(`Ошибка при удалении: ${err.response?.data?.message || err.message}`);
      }
    }
    updateSelectedSummary();
  }, [fetchData, updateSelectedSummary]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    wrapText: true,
    autoHeight: true,
    minWidth: 100,
  };

  if (loading) return <div className="execution-loading"><div>Загрузка данных...</div></div>;
  if (error) return (
    <div className="execution-error">
      <div className="execution-error-message">Ошибка: {error}</div>
      <button onClick={fetchData} className="execution-error-btn">Повторить попытку</button>
    </div>
  );

  return (
    <div className="execution-container">
      <div className="execution-toolbar">
        <button onClick={handleAddRow} className="execution-btn execution-btn-add">Добавить строку</button>
        <button onClick={handleDeleteRow} className="execution-btn execution-btn-delete">Удалить выбранные</button>
        <button onClick={fetchData} className="execution-btn execution-btn-refresh">Обновить</button>
        <button onClick={() => fileInputRef.current.click()} className="execution-btn execution-btn-import">Загрузить из Excel</button>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.xlt,.xltx" style={{ display: 'none' }} onChange={handleImport} />
        {savingRows.size > 0 && <span className="execution-saving-indicator">Сохранение...</span>}
        <button className="execution-btn execution-btn-nav" onClick={() => navigate("/summary")}>Перейти к договорам</button>
        <button className="execution-btn execution-btn-nav" onClick={() => navigate("/BudgetPlan")}>Перейти к отчетам</button>
      </div>
      <div className="execution-grid-container ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={{
            mode: 'multiRow',
            headerCheckbox: true,
            enableClickSelection: true,
          }}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          onSelectionChanged={onSelectionChanged}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={false}
          suppressHorizontalScroll={false}
          immutableData={true}
          getRowId={(params) => String(params.data.id)}
        />
      </div>
      
      {selectedRowsCount > 0 && (
        <div className="execution-selection-summary">
          <div className="execution-selection-summary-title">
            Выделено строк: <strong>{selectedRowsCount}</strong>
          </div>
          <div className="execution-selection-summary-values">
            <div className="summary-item">
              <span className="summary-label">Выплаты 2026:</span>
              <span className="summary-value">{formatNumber({ value: selectedSummary.payment_plan_2026 })}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Выплаты 2027:</span>
              <span className="summary-value">{formatNumber({ value: selectedSummary.payment_plan_2027 })}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Выплаты 2028:</span>
              <span className="summary-value">{formatNumber({ value: selectedSummary.payment_plan_2028 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Execution;