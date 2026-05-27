import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './BudgetPlan.css';

const formatNumber = (params) => {
  const value = params.value;
  if (value === undefined || value === null || value === '') return '';
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
  if (params.data.type === 'parent') {
    return { background: '#e6f7ff' };
  }
  return null;
};

function ReportPage() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || 'http://192.168.19.101:3001/';
  const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/budget-report/hierarchical');
      const data = res.data.report || [];
      setRowData(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки отчёта');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportToExcel = () => {
    window.open(`${baseURL}/budget-report/export-excel`, '_blank');
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
    { 
      field: 'manual_end_date', 
      headerName: 'окончание оказания услуг', 
      width: 200, 
      valueFormatter: formatDate,
      editable: true,
    },
    { field: 'end_date', headerName: 'дата окончания договора', width: 150, valueFormatter: formatDate },
    { field: 'plan_2026', headerName: 'План 2026 год', width: 140, valueFormatter: formatNumber },
    { field: 'obligations_2026', headerName: 'Обязательства - Принято обязательств по расходам 2026', width: 280, valueFormatter: formatNumber },
    { field: 'invoices', headerName: 'Выставлено счетов', width: 160 },
    { field: 'paid_total', headerName: 'Оплачено всего, в т.ч.', width: 200, valueFormatter: formatNumber },
    { field: 'balance_remain', headerName: 'Остаток для исполнения', width: 180 },
    { field: 'approvals_2026', headerName: 'Согласование служебок 2026 год', width: 250 },
    { field: 'plan_2027', headerName: 'План 2027', width: 140, valueFormatter: formatNumber },
    { field: 'obligations_2027', headerName: 'Обязательства - Принято обязательств по расходам 2027', width: 280, valueFormatter: formatNumber },
    { field: 'approvals_2027', headerName: 'Согласование служебок 2027 год', width: 250 }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
    wrapText: true,
    autoHeight: true,
    minWidth: 100,
  };

  const getDataPath = (data) => {
    if (data.type === 'parent') return [data.id];
    if (data.type === 'child' && data.parentId) return [data.parentId, data.id];
    return [];
  };

  if (loading) return <div className="report-loading">Загрузка отчёта...</div>;

  return (
    <div className="report-container">
      <div className="report-toolbar">
        <button className="report-btn report-btn-primary" onClick={exportToExcel}>
          📎 Экспорт в Excel
        </button>
        <button className="report-btn report-btn-nav" onClick={() => navigate("/execution")}>
          Перейти к ПФХД
        </button>
        <button className="report-btn report-btn-nav" onClick={() => navigate("/summary")}>
          Перейти к договорам
        </button>
      </div>
      <div className="report-grid-container ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          getRowStyle={getRowStyle}
          defaultColDef={defaultColDef}
          treeData={true}
          animateRows={true}
          getDataPath={getDataPath}
          autoGroupColumnDef={{
            headerName: 'Группировка',
            cellRendererParams: { suppressCount: true },
          }}
          onCellValueChanged={(params) => {
            console.log('Изменено поле', params.colDef.field, params.newValue, params.data);
          }}
        />
      </div>
    </div>
  );
}

export default ReportPage;