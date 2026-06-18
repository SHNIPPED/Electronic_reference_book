import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import api from '../../api/axiosInstance.js'
import excelService from './excelService.js';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './BudgetPlan.css';
import { textEditor } from '../editors/textEditor.js';
import { numberEditor } from '../editors/numberEditor.js'

ModuleRegistry.registerModules([AllCommunityModule]);

const formatNumber = (params) => {
  const value = params.value;
  if (value === undefined || value === null || value === '' || value === 0) return '';
  const num = Number(value);
  if (isNaN(num)) return '';
  return num.toLocaleString('ru-RU');
};

const formatDate = (params) => {
  if (!params.value) return '';
  const d = new Date(params.value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU');
};

const getRowStyle = (params) => {
  if (params.data.type === 'parent') return { background: '#e6f7ff' };
  if (params.data.type === 'total') return { background: '#f5f5f5', fontWeight: 'bold', fontStyle: 'italic' };
  return null;
};

function BudgetPlan() {
  const gridRef = useRef();
  const [fullData, setFullData] = useState([]);
  const [rowData, setRowData] = useState([]);
  
  // Состояния для фильтров
  const [filterKfsr, setFilterKfsr] = useState('');
  const [filterKcsr, setFilterKcsr] = useState('');
  const [filterKcsrName, setFilterKcsrName] = useState('');
  const [filterContract, setFilterContract] = useState(''); 
  
  const [loading, setLoading] = useState(false);
  const [savingRows, setSavingRows] = useState(new Set());
  const saveTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Уникальные значения КЦСР для выпадающего списка (из родителей)
  const uniqueKcsrOptions = useMemo(() => {
    if (!fullData.length) return [];
    const parents = fullData.filter(item => item.type === 'parent');
    const values = new Set();
    parents.forEach(p => {
      if (p.kcsr && p.kcsr.trim()) values.add(p.kcsr);
    });
    return Array.from(values).sort();
  }, [fullData]);

  const calculateTotalRow = (parent, children) => {
    const totalPlan2026 = parent.plan_2026 || 0;
    const totalPlan2027 = parent.plan_2027 || 0;
    let totalObligations2026 = 0, totalApprovals2026 = 0, totalObligations2027 = 0, totalApprovals2027 = 0;
    children.forEach(child => {
      totalObligations2026 += Number(child.obligations_2026) || 0;
      totalApprovals2026 += Number(child.approvals_2026) || 0;
      totalObligations2027 += Number(child.obligations_2027) || 0;
      totalApprovals2027 += Number(child.approvals_2027) || 0;
    });
    const balanceRemain2026 = totalPlan2026 - totalObligations2026 - totalApprovals2026;
    const balanceRemain2027 = totalPlan2027 - totalObligations2027 - totalApprovals2027;
    return {
      id: `total_${parent.id}`,
      type: 'total',
      parentId: parent.id,
      kfsr: '', kcsr: 'ОСТАТОК:', kcsr_name: '', kvr: '', kosgu: '', kvfo: '', counterparty: '',
      doc_date: null, start_date: null, exec_date: null, end_date: null,
      plan_2026: balanceRemain2026, plan_2027: balanceRemain2027,
      obligations_2026: '', invoices: '', paid_total: '', balance_remain: '',
      approvals_2026: '', obligations_2027: '', approvals_2027: '', advance_sum: '',
    };
  };

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('budget-report/hierarchical');
      const data = res.data.report || [];

      const normalized = data.map(item => ({
        ...item,
        id: String(item.id),
        parentId: item.parentId ? String(item.parentId) : null
      }));
      
      const parents = normalized.filter(item => item.type === 'parent');
      const children = normalized.filter(item => item.type === 'child');

      const childrenByParent = new Map();
      children.forEach(child => {
        const pid = child.parentId;
        if (pid) {
          if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
          childrenByParent.get(pid).push(child);
        }
      });

      const flat = [];
      for (const parent of parents) {
        flat.push(parent);
        const kids = childrenByParent.get(parent.id) || [];
        if (kids.length) {
          flat.push(...kids);
          flat.push(calculateTotalRow(parent, kids));
        }
      }
      setFullData(flat);
      setRowData(flat);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки отчёта');
    } finally {
      setLoading(false);
    }
  }, []);

  // Фильтрация по всем четырём условиям
  const applyFilters = useCallback(() => {
    if (!fullData.length) return;
    
    const hasAnyFilter = filterKfsr || filterKcsr || filterKcsrName || filterContract;
    if (!hasAnyFilter) {
      setRowData(fullData);
      return;
    }
    
    const result = [];
    let i = 0;
    while (i < fullData.length) {
      const item = fullData[i];
      if (item.type === 'parent') {
        const parent = item;
        // Собираем детей этого родителя
        const children = [];
        let j = i + 1;
        while (j < fullData.length && fullData[j].type !== 'parent') {
          if (fullData[j].type === 'child') children.push(fullData[j]);
          j++;
        }
        
        let ok = true;
        // 1. Фильтр по КФСР (родитель, подстрока)
        if (filterKfsr) {
          const parentKfsr = parent.kfsr ? parent.kfsr.toLowerCase() : '';
          if (!parentKfsr.includes(filterKfsr.toLowerCase())) ok = false;
        }
        // 2. Фильтр по КЦСР (родитель, точное совпадение)
        if (ok && filterKcsr) {
          if (parent.kcsr !== filterKcsr) ok = false;
        }
        // 3. Фильтр по наименованию КЦСР (дети, подстрока в kcsr_name)
        if (ok && filterKcsrName) {
          const lowerName = filterKcsrName.toLowerCase();
          const hasChildWithName = children.some(child => 
            child.kcsr_name && child.kcsr_name.toLowerCase().includes(lowerName)
          );
          if (!hasChildWithName) ok = false;
        }
        // 4. Фильтр по номеру договора (дети, поле kcsr, подстрока)
        if (ok && filterContract) {
          const lowerContract = filterContract.toLowerCase();
          const hasChildWithContract = children.some(child => 
            child.kcsr && child.kcsr.toLowerCase().includes(lowerContract)
          );
          if (!hasChildWithContract) ok = false;
        }
        
        if (ok) {
          result.push(parent);
          i++;
          while (i < fullData.length && fullData[i].type !== 'parent') {
            result.push(fullData[i]);
            i++;
          }
        } else {
          i++;
          while (i < fullData.length && fullData[i].type !== 'parent') i++;
        }
      } else {
        i++;
      }
    }
    setRowData(result);
  }, [fullData, filterKfsr, filterKcsr, filterKcsrName, filterContract]);

  const resetFilters = () => {
    setFilterKfsr('');
    setFilterKcsr('');
    setFilterKcsrName('');
    setFilterContract('');
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (!gridRef.current || !gridRef.current.api) return;
    const timer = setTimeout(() => {
      gridRef.current.api.forEachNode(node => node.setExpanded(true));
    }, 50);
    return () => clearTimeout(timer);
  }, [rowData]);

  const updateSingleRow = useCallback((updatedRow) => {
    if (!gridRef.current) return;
    const rowNode = gridRef.current.api.getRowNode(String(updatedRow.id));
    if (rowNode) rowNode.setData(updatedRow);
  }, []);

  const updateParentAndTotal = useCallback((childId) => {
    if (!gridRef.current) return;
    const apiGrid = gridRef.current.api;
    const childNode = apiGrid.getRowNode(String(childId));
    if (!childNode || !childNode.data.parentId) return;
    const parentId = childNode.data.parentId;
    const parentNode = apiGrid.getRowNode(String(parentId));
    if (!parentNode) return;
    const totalId = `total_${parentId}`;
    const totalNode = apiGrid.getRowNode(totalId);
    
    const allNodes = [];
    apiGrid.forEachNode(node => allNodes.push(node));
    const childNodes = allNodes.filter(node => node.data.parentId === parentId && node.data.type === 'child');
    
    let totalObligations2026 = 0, totalApprovals2026 = 0, totalObligations2027 = 0, totalApprovals2027 = 0;
    childNodes.forEach(node => {
      totalObligations2026 += Number(node.data.obligations_2026) || 0;
      totalApprovals2026 += Number(node.data.approvals_2026) || 0;
      totalObligations2027 += Number(node.data.obligations_2027) || 0;
      totalApprovals2027 += Number(node.data.approvals_2027) || 0;
    });
    
    const updatedParent = { ...parentNode.data, obligations_2026: totalObligations2026, approvals_2026: totalApprovals2026, obligations_2027: totalObligations2027, approvals_2027: totalApprovals2027 };
    parentNode.setData(updatedParent);
    
    if (totalNode) {
      const totalPlan2026 = parentNode.data.plan_2026 || 0;
      const totalPlan2027 = parentNode.data.plan_2027 || 0;
      const balanceRemain2026 = totalPlan2026 - totalObligations2026 - totalApprovals2026;
      const balanceRemain2027 = totalPlan2027 - totalObligations2027 - totalApprovals2027;
      const updatedTotal = { ...totalNode.data, plan_2026: balanceRemain2026, plan_2027: balanceRemain2027 };
      totalNode.setData(updatedTotal);
    }
  }, []);

  const saveFieldToDB = useCallback(async (row, fieldName, newValue) => {
    if (savingRows.has(row.id)) return false;
    setSavingRows(prev => new Set(prev).add(row.id));
    try {
      const dataToSend = {};
      if (fieldName === 'exec_date') {
        const formatDateForMySQL = (date) => date ? new Date(date).toISOString().split('T')[0] : null;
        dataToSend.exec_date = formatDateForMySQL(newValue);
      } else if (fieldName === 'approvals_2026') dataToSend.approvals_2026 = Number(newValue) || 0;
      else if (fieldName === 'obligations_2027') dataToSend.obligations_2027 = Number(newValue) || 0;
      else if (fieldName === 'approvals_2027') dataToSend.approvals_2027 = Number(newValue) || 0;
      await api.post(`budget-report/update-contract-field/${row.id}`, dataToSend);
      return true;
    } catch (err) {
      console.error(`Ошибка сохранения ${fieldName}:`, err);
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
    if (data.type === 'child') {
      const editableFields = ['approvals_2026', 'obligations_2027', 'approvals_2027', 'exec_date'];
      if (editableFields.includes(colDef.field)) {
        updateParentAndTotal(data.id);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(async () => {
          await saveFieldToDB(data, colDef.field, newValue);
          saveTimeoutRef.current = null;
        }, 500);
      }
    }
  }, [saveFieldToDB, updateSingleRow, updateParentAndTotal]);

  const getDataPath = (data) => {
    if (data.type === 'parent') return [String(data.id)];
    if (data.type === 'child' || data.type === 'total') return [String(data.parentId), String(data.id)];
    return [];
  };

  const columnDefs = [
    { field: 'kfsr', headerName: 'КФСР', width: 100 },
    { field: 'kcsr', headerName: 'КЦСР', width: 150 },
    { field: 'kcsr_name', headerName: 'Наименование КЦСР', width: 250, wrapText: true, autoHeight: true },
    { field: 'kvr', headerName: 'КВР', width: 100 },
    { field: 'kosgu', headerName: 'КОСГУ', width: 100 },
    { field: 'kvfo', headerName: 'КВФО', width: 100 },
    { field: 'counterparty', headerName: 'Организация контрагента', width: 300, wrapText: true, autoHeight: true },
    { field: 'doc_date', headerName: 'дата договора', width: 120, valueFormatter: formatDate },
    { field: 'start_date', headerName: 'начало оказания услуг', width: 150, valueFormatter: formatDate },
    { field: 'exec_date', headerName: 'окончание оказания услуг', width: 200, valueFormatter: formatDate, editable: true, cellEditor: textEditor },
    { field: 'end_date', headerName: 'дата окончания договора', width: 150, valueFormatter: formatDate },
    { field: 'plan_2026', headerName: 'План 2026 год', width: 140, valueFormatter: formatNumber },
    { field: 'obligations_2026', headerName: 'Обязательства - Принято обязательств по расходам 2026', width: 280, valueFormatter: formatNumber },
    { field: 'invoices', headerName: 'Выставлено счетов', width: 160 },
    { field: 'paid_total', headerName: 'Оплачено всего, в т.ч.', width: 200, valueFormatter: formatNumber },
    { field: 'balance_remain', headerName: 'Остаток для исполнения', width: 180, valueFormatter: formatNumber },
    { field: 'approvals_2026', headerName: 'Согласование служебок 2026 год', width: 250, editable: true, cellEditor: numberEditor, valueFormatter: formatNumber },
    { field: 'plan_2027', headerName: 'План 2027', width: 140, valueFormatter: formatNumber },
    { field: 'obligations_2027', headerName: 'Обязательства - Принято обязательств по расходам 2027', width: 280, editable: true, cellEditor: numberEditor, valueFormatter: formatNumber },
    { field: 'approvals_2027', headerName: 'Согласование служебок 2027 год', width: 250, editable: true, cellEditor: numberEditor, valueFormatter: formatNumber },
  ];

  const defaultColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
    wrapText: true,
    autoHeight: true,
    minWidth: 100,
  };

  const handleExportToExcel = () => {
    excelService.exportReportToExcel(rowData);
  };

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) return <div className="report-loading">Загрузка отчёта...</div>;

  return (
    <div className="report-container">
        <div className="report-toolbar" >
          <button className="report-btn report-btn-primary" onClick={handleExportToExcel}>📎 Экспорт в Excel</button>
          <button className="report-btn report-btn-nav" onClick={() => navigate("/execution")}>Перейти к ПФХД</button>
          <button className="report-btn report-btn-nav" onClick={() => navigate("/summary")}>Перейти к договорам</button>
        </div>
      <div className="report-toolbar">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Фильтр по КФСР"
            value={filterKfsr}
            onChange={(e) => setFilterKfsr(e.target.value)}
            style={{ padding: '8px', width: '150px' }}
          />
          <select
            value={filterKcsr}
            onChange={(e) => setFilterKcsr(e.target.value)}
            style={{ padding: '8px', width: '200px' }}
          >
            <option value="">Все КЦСР</option>
            {uniqueKcsrOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Наименование КЦСР"
            value={filterKcsrName}
            onChange={(e) => setFilterKcsrName(e.target.value)}
            style={{ padding: '8px', width: '250px' }}
          />
          <input
            type="text"
            placeholder="Номер договора"
            value={filterContract}
            onChange={(e) => setFilterContract(e.target.value)}
            style={{ padding: '8px', width: '200px' }}
          />
          <button className="report-btn" onClick={resetFilters}>Сбросить фильтры</button>
        </div>
      </div>
      <div className="report-grid-container ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          getRowStyle={getRowStyle}
          defaultColDef={defaultColDef}
          treeData={true}
          animateRows={true}
          getDataPath={getDataPath}
          groupDefaultExpanded={-1}
          autoGroupColumnDef={{ headerName: 'Группировка', cellRendererParams: { suppressCount: true } }}
          onCellValueChanged={onCellValueChanged}
          getRowId={(params) => String(params.data.id)}
        />
      </div>
    </div>
  );
}

export default BudgetPlan;