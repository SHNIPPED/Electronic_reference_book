import React, { useState, useRef, useCallback, useEffect } from 'react';
import api from '../../api/axiosInstance.js'; 
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import SummaryExcelService from './summaryExcelService';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './summary.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(params.value);
};

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

function Summary() {
  const gridRef = useRef();
  const fileInputRef = useRef();
  const fileInputSummaryRef = useRef();
  const saveTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingRows, setSavingRows] = useState(new Set());
  const navigate = useNavigate();

  // Состояния для модального окна контракта
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [contractForm, setContractForm] = useState({
    doc_num: '',
    note: '',
    doc_status: 'Черновик',
    doc_date: new Date().toISOString().split('T')[0],
    reg_date: '',
    exec_date: '',
    total_sum: 0,
    counterparty: '',
    contract_sum: 0,
    curr_year_sum: 0,
    exec_curr_year: 0,
    exec_past_periods: 0,
    in_execution: 0,
    advance_sum: 0,
    balance: 0,
    total_balance: 0,
    base_doc_date: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    osnovanie: '',
    kcsr: '',
    kvr: '',
    kosgu: '',
    kvfo: '',
    Industry_code: '' ,
    is_service: false,
    approvals_2026: 0,
    obligations_2027: 0,
    approvals_2027: 0,
    service_id: null

  });
  const [columnDefs] = useState([
    { headerName: 'Примечание', field: 'note', width: 180, pinned: 'left', editable: true, resizable: true  },
    { headerName: 'Номер документа', field: 'doc_num', width: 180, pinned: 'left', editable: true, resizable: true },
    { headerName: 'Статус документа', field: 'doc_status', width: 150, editable: true, resizable: true },
    { headerName: 'Дата документа', field: 'doc_date', width: 140, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата регистрации', field: 'reg_date', width: 150, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата исполнения', field: 'exec_date', width: 150, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Общая сумма', field: 'total_sum', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Организация контрагента', field: 'counterparty', width: 350, editable: true, wrapText: true, autoHeight: true, resizable: true },
    { headerName: 'Сумма контракта', field: 'contract_sum', width: 160, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Сумма тек. года', field: 'curr_year_sum', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Исполнено в тек. году', field: 'exec_curr_year', width: 180, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Исполнено в прошлых периодах', field: 'exec_past_periods', width: 220, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'В исполнении', field: 'in_execution', width: 140, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    // 2-й год исп
    // 3-й год исп
    { headerName: 'Сумма аванса', field: 'advance_sum', width: 140, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Остаток', field: 'balance', width: 130, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Общий остаток', field: 'total_balance', width: 150, editable: true, valueFormatter: formatNumber, cellDataType: 'number', resizable: true },
    { headerName: 'Дата документа-основания', field: 'base_doc_date', width: 200, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата начала действия', field: 'start_date', width: 180, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Дата окончания действия', field: 'end_date', width: 190, editable: true, cellEditor: SimpleTextEditor, valueFormatter: (params) => formatDate(params.value), resizable: true },
    { headerName: 'Основание', field: 'osnovanie', width: 300, editable: true, wrapText: true, autoHeight: true, resizable: true },
    { headerName: 'КЦСР', field: 'kcsr', width: 120, editable: true, resizable: true },
    { headerName: 'КВР', field: 'kvr', width: 100, editable: true, resizable: true },
    { headerName: 'КОСГУ', field: 'kosgu', width: 100, editable: true, resizable: true },
    { headerName: 'КВФО', field: 'kvfo', width: 100, editable: true, resizable: true },
    { headerName: 'Отраслевой код', field: 'Industry_code', width: 100, editable: true, resizable: true },
    { headerName: 'Служебка', field: 'is_service', width: 100, cellRenderer: (params) => params.value ? '✅' : '❌', editable: false }
  ]);

  const [rowData, setRowData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('Summary');
      let contracts = response.data.contracts || response.data || [];
  
      // Теперь в каждом контракте уже есть поля:
      // service_id, approvals_2026, obligations_2027, approvals_2027
      const contractsWithService = contracts.map(contract => ({
        ...contract,
        is_service: !!contract.service_id, // если есть service_id – значит служебка существует
        service_id: contract.service_id || null,
        approvals_2026: contract.approvals_2026 || 0,
        obligations_2027: contract.obligations_2027 || 0,
        approvals_2027: contract.approvals_2027 || 0
      }));
  
      setRowData(contractsWithService);
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

  // ---- Функции для редактирования ячеек (из оригинального кода) ----
  const updateSingleRow = useCallback((updatedRow) => {
    if (!gridRef.current) return;
    const apiGrid = gridRef.current.api;
    apiGrid.applyTransaction({ update: [updatedRow] });
    const rowNode = apiGrid.getRowNode(String(updatedRow.id));
    if (rowNode) {
      rowNode.setData(updatedRow);
    } else {
      setRowData(prevData => prevData.map(item => item.id === updatedRow.id ? updatedRow : item));
    }
  }, []);

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
      let endDate = row.end_date;
      if (!endDate) {
        const defaultEndDate = new Date();
        defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
        endDate = defaultEndDate;
      }
      const toNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const str = String(val).replace(',', '.');
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
      };
      const dataToSend = {
        doc_num: row.doc_num || '',
        note: row.note || '',
        doc_status: row.doc_status || 'Черновик',
        doc_date: formatDateForMySQL(row.doc_date) || formatDateForMySQL(new Date()),
        reg_date: formatDateForMySQL(row.reg_date),
        exec_date: formatDateForMySQL(row.exec_date),
        total_sum: toNumber(row.total_sum),
        contract_type: row.contract_type || '',
        counterparty: row.counterparty || '',
        contract_sum: toNumber(row.contract_sum),
        curr_year_sum: toNumber(row.curr_year_sum),
        exec_curr_year: toNumber(row.exec_curr_year),
        exec_past_periods: toNumber(row.exec_past_periods),
        in_execution: toNumber(row.in_execution),
        advance_sum: toNumber(row.advance_sum),
        balance: toNumber(row.balance),
        total_balance: toNumber(row.total_balance),
        base_doc_date: formatDateForMySQL(row.base_doc_date),
        start_date: formatDateForMySQL(row.start_date),
        end_date: formatDateForMySQL(endDate),
        osnovanie: row.osnovanie || '',
        kcsr: row.kcsr || '',
        kvr: row.kvr || '',
        kosgu: row.kosgu || '',
        kvfo: row.kvfo || '',
        Industry_code: row.Industry_code || ''
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

  const onCellValueChanged = useCallback(async (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    const updatedRow = { ...data, [colDef.field]: newValue };
    updateSingleRow(updatedRow);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      const success = await saveToDatabase(updatedRow);
      if (!success) updateSingleRow(data);
      saveTimeoutRef.current = null;
    }, 300);
  }, [saveToDatabase, updateSingleRow]);

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

  const handleImportSummary = useCallback(async(event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const results = await SummaryExcelService.importSummaryFromExcel(file, api);
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
  },[fetchData])

  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedNodes.length} запись(ей)?`)) return;
    const selectedRows = selectedNodes.map(node => node.data);
    const existingRows = selectedRows.filter(row => !row.is_new);
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

  const openAddModal = () => {
    setEditingContract(null);
    setContractForm({
      doc_num: '',
      note: '',
      doc_status: 'Черновик',  
      doc_date: new Date().toISOString().split('T')[0],
      reg_date: '',
      exec_date: '',
      total_sum: 0,
      counterparty: '',
      contract_sum: 0,
      curr_year_sum: 0,
      exec_curr_year: 0,
      exec_past_periods: 0,
      in_execution: 0,
      advance_sum: 0,
      balance: 0,
      total_balance: 0,
      base_doc_date: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      osnovanie: '',
      kcsr: '',
      kvr: '',
      kosgu: '',
      kvfo: '',
      Industry_code: '',
      is_service: false,
      approvals_2026: 0,
      obligations_2027: 0,
      approvals_2027: 0,
      service_id: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (contract) => {
    setEditingContract(contract);
    setContractForm({
      doc_num: contract.doc_num || '',
      note: contract.note || '',
      doc_status: contract.doc_status || 'Черновик',
      doc_date: contract.doc_date ? contract.doc_date.split('T')[0] : new Date().toISOString().split('T')[0],
      reg_date: contract.reg_date ? contract.reg_date.split('T')[0] : '',
      exec_date: contract.exec_date ? contract.exec_date.split('T')[0] : '',
      total_sum: contract.total_sum || 0,
      counterparty: contract.counterparty || '',
      contract_sum: contract.contract_sum || 0,
      curr_year_sum: contract.curr_year_sum || 0,
      exec_curr_year: contract.exec_curr_year || 0,
      exec_past_periods: contract.exec_past_periods || 0,
      in_execution: contract.in_execution || 0,
      advance_sum: contract.advance_sum || 0,
      balance: contract.balance || 0,
      total_balance: contract.total_balance || 0,
      base_doc_date: contract.base_doc_date ? contract.base_doc_date.split('T')[0] : '',
      start_date: contract.start_date ? contract.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
      osnovanie: contract.osnovanie || '',
      kcsr: contract.kcsr || '',
      kvr: contract.kvr || '',
      kosgu: contract.kosgu || '',
      kvfo: contract.kvfo || '',
      Industry_code: contract.Industry_code || '',
      is_service: contract.is_service || false,
      approvals_2026: contract.approvals_2026 || 0,
      obligations_2027: contract.obligations_2027 || 0,
      approvals_2027: contract.approvals_2027 || 0,
      service_id: contract.service_id || null
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContractForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveContract = async () => {
    if (!contractForm.doc_num.trim()) {
      alert('Поле "Номер документа" обязательно');
      return;
    }
    if (!contractForm.counterparty.trim()) {
      alert('Поле "Организация контрагента" обязательно');
      return;
    }

    try {
      const formatDateForMySQL = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];
      };
      const toNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const str = String(val).replace(',', '.');
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
      };

      const contractPayload = {
        doc_num: contractForm.doc_num.trim(),
        note:contractForm.note.trim(),
        doc_status: contractForm.doc_status,
        doc_date: formatDateForMySQL(contractForm.doc_date) || formatDateForMySQL(new Date()),
        reg_date: formatDateForMySQL(contractForm.reg_date),
        exec_date: formatDateForMySQL(contractForm.exec_date),
        total_sum: toNumber(contractForm.total_sum),
        contract_type: contractForm.contract_type || '',
        counterparty: contractForm.counterparty.trim(),
        contract_sum: toNumber(contractForm.contract_sum),
        curr_year_sum: toNumber(contractForm.curr_year_sum),
        exec_curr_year: toNumber(contractForm.exec_curr_year),
        exec_past_periods: toNumber(contractForm.exec_past_periods),
        in_execution: toNumber(contractForm.in_execution),
        advance_sum: toNumber(contractForm.advance_sum),
        balance: toNumber(contractForm.balance),
        total_balance: toNumber(contractForm.total_balance),
        base_doc_date: formatDateForMySQL(contractForm.base_doc_date),
        start_date: formatDateForMySQL(contractForm.start_date) || formatDateForMySQL(new Date()),
        end_date: formatDateForMySQL(contractForm.end_date) || (() => {
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          return formatDateForMySQL(nextYear);
        })(),
        osnovanie: contractForm.osnovanie,
        kcsr: contractForm.kcsr,
        kvr: contractForm.kvr,
        kosgu: contractForm.kosgu,
        kvfo: contractForm.kvfo,
        Industry_code: contractForm.Industry_code
      };

      let savedContract;
      if (editingContract) {
        await api.post(`Summary/edit-single/${editingContract.id}`, contractPayload);
        savedContract = { ...editingContract, ...contractPayload, id: editingContract.id };
      } else {
        const res = await api.post('Summary/create', contractPayload);
        savedContract = { ...contractPayload, id: res.data.id };
      }
      
      if (contractForm.is_service) {
        const servicePayload = {
            contract_id: savedContract.id,
            approvals_2026: toNumber(contractForm.approvals_2026),
            obligations_2027: toNumber(contractForm.obligations_2027),
            approvals_2027: toNumber(contractForm.approvals_2027)
        };
        if (editingContract && editingContract.service_id) {
            await api.put(`/Summary/contract-additional/${editingContract.service_id}`, servicePayload);
        } else {
            await api.post(`/Summary/contract-additional`, servicePayload);
        }
    } else {
        if (editingContract && editingContract.service_id) {
            await api.delete(`/Summary/contract-additional/contract/${editingContract.id}`);
        }
    }

      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert(`Ошибка: ${err.response?.data?.message || err.message}`);
    }
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    wrapText: true,
    autoHeight: true,
    minWidth: 100,
  };

  if (loading) return <div className="summary-loading">Загрузка данных...</div>;
  if (error) return (
    <div className="summary-error">
      <div className="summary-error-message">Ошибка: {error}</div>
      <button onClick={fetchData} className="summary-error-btn">Повторить попытку</button>
    </div>
  );

  return (
    <div className="summary-container">
      <div className="summary-toolbar">
        <button onClick={openAddModal} className="summary-btn summary-btn-add">+ Добавить запись</button>
        <button onClick={handleDeleteRow} className="summary-btn summary-btn-delete">- Удалить выбранные</button>
        <button onClick={fetchData} className="summary-btn summary-btn-refresh">Обновить</button>
        <button onClick={() => fileInputRef.current.click()} className="summary-btn summary-btn-import">Загрузить из Excel</button>
        <button onClick={() => fileInputSummaryRef.current.click()} className="summary-btn summary-btn-import">Загрузить Сводную</button>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.xlt,.xltx" style={{ display: 'none' }} onChange={handleImport} />
        <input ref={fileInputSummaryRef} type="file" accept=".xlsx,.xls,.xlt,.xltx" style={{ display: 'none' }} onChange={handleImportSummary} />
        {savingRows.size > 0 && <span className="summary-saving-indicator">Сохранение...</span>}
        <button className="summary-btn summary-btn-nav" onClick={() => navigate("/execution")}>Перейти к ПФХД</button>
        <button className="summary-btn summary-btn-nav" onClick={() => navigate("/BudgetPlan")}>Перейти к отчетам</button>
      </div>

      <div className="summary-grid-container ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={{ mode: 'multiRow', headerCheckbox: true, enableClickSelection: true }}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={false}
          onRowDoubleClicked={(params) => openEditModal(params.data)}
          getRowId={(params) => String(params.data.id)}
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingContract ? 'Редактирование контракта' : 'Новый контракт'}</h2>
            <div className="modal-form">
              <label>Номер документа *</label>
              <input name="doc_num" value={contractForm.doc_num} onChange={handleFormChange} />

              <label>Примечание</label>
              <input name="note" value={contractForm.note} onChange={handleFormChange} />

              <label>Статус документа</label>
              <input type="text" name="doc_status" value={contractForm.doc_status} onChange={handleFormChange} placeholder="Введите статус" />

              <label>Дата документа *</label>
              <input type="date" name="doc_date" value={contractForm.doc_date} onChange={handleFormChange} />

              <label>Дата регистрации</label>
              <input type="date" name="reg_date" value={contractForm.reg_date || ''} onChange={handleFormChange} />

              <label>Дата исполнения</label>
              <input type="date" name="exec_date" value={contractForm.exec_date || ''} onChange={handleFormChange} />

              <label>Общая сумма</label>
              <input type="text" name="total_sum" value={contractForm.total_sum} onChange={handleFormChange} inputMode="numeric" />

              <label>Организация контрагента *</label>
              <input name="counterparty" value={contractForm.counterparty} onChange={handleFormChange} />

              <label>Сумма контракта</label>
              <input type="text" name="contract_sum" value={contractForm.contract_sum} onChange={handleFormChange} inputMode="numeric" />

              <label>Сумма тек. года</label>
              <input type="text" name="curr_year_sum" value={contractForm.curr_year_sum} onChange={handleFormChange} inputMode="numeric" />

              <label>Исполнено в тек. году</label>
              <input type="text" name="exec_curr_year" value={contractForm.exec_curr_year} onChange={handleFormChange} inputMode="numeric" />

              <label>Исполнено в прошлых периодах</label>
              <input type="text" name="exec_past_periods" value={contractForm.exec_past_periods} onChange={handleFormChange} inputMode="numeric" />

              <label>Сумма аванса</label>
              <input type="text" name="advance_sum" value={contractForm.advance_sum} onChange={handleFormChange} inputMode="numeric" />

              <label>Остаток</label>
              <input type="text" name="balance" value={contractForm.balance} onChange={handleFormChange} inputMode="numeric" />

              <label>Общий остаток</label>
              <input type="text" name="total_balance" value={contractForm.total_balance} onChange={handleFormChange} inputMode="numeric" />

              <label>Дата документа-основания</label>
              <input type="date" name="base_doc_date" value={contractForm.base_doc_date || ''} onChange={handleFormChange} />

              <label>Дата начала действия</label>
              <input type="date" name="start_date" value={contractForm.start_date || ''} onChange={handleFormChange} />

              <label>Дата окончания действия</label>
              <input type="date" name="end_date" value={contractForm.end_date || ''} onChange={handleFormChange} />

              <label>Основание</label>
              <input name="osnovanie" value={contractForm.osnovanie} onChange={handleFormChange} />

              <label>КЦСР</label>
              <input name="kcsr" value={contractForm.kcsr} onChange={handleFormChange} />

              <label>КВР</label>
              <input name="kvr" value={contractForm.kvr} onChange={handleFormChange} />

              <label>КОСГУ</label>
              <input name="kosgu" value={contractForm.kosgu} onChange={handleFormChange} />

              <label>КВФО</label>
              <input name="kvfo" value={contractForm.kvfo} onChange={handleFormChange} />

              <label>Отраслевой код</label>
              <input name="Industry_code" value={contractForm.Industry_code} onChange={handleFormChange} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <label style={{ margin: 0 }}>Служебка</label>
                <input type="checkbox" name="is_service" checked={contractForm.is_service} onChange={handleFormChange} />
              </div>

              {contractForm.is_service && (
                <>
                  <label>Согласование служебок 2026</label>
                  <input type="text" name="approvals_2026" value={contractForm.approvals_2026} onChange={handleFormChange} inputMode="numeric" />
                  <label>Обязательства 2027</label>
                  <input type="text" name="obligations_2027" value={contractForm.obligations_2027} onChange={handleFormChange} inputMode="numeric" />
                  <label>Согласование служебок 2027</label>
                  <input type="text" name="approvals_2027" value={contractForm.approvals_2027} onChange={handleFormChange} inputMode="numeric" />
                </>
              )}

              <div className="modal-buttons">
                <button onClick={saveContract} className="summary-btn summary-btn-add">Сохранить</button>
                <button onClick={() => setIsModalOpen(false)} className="summary-btn summary-btn-delete">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;