import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const formatNumber = (params) => {
  if (params.value === undefined || params.value === null || params.value === 0) return '';
  return Number(params.value).toLocaleString('ru-RU');
};

const formatDate = (params) => {
  if (!params.value) return '';
  const d = new Date(params.value);
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
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/';
  const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/budget-report/hierarchical');
      const data = res.data.report || [];
      const flattened = [];
      data.forEach(parent => {
        const parentCopy = { ...parent, children: undefined };
        flattened.push(parentCopy);
        if (parent.children && parent.children.length) {
          parent.children.forEach(child => {
            flattened.push({ ...child, parentId: parent.id });
          });
        }
      });
      setRowData(flattened);
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
    { field: 'kcsr_name', headerName: 'Наименование КЦСР', width: 250 },
    { field: 'kvr', headerName: 'КВР', width: 100 },
    { field: 'kosgu', headerName: 'КОСГУ', width: 100 },
    { field: 'kvfo', headerName: 'КВФО', width: 100 },
    { field: 'counterparty', headerName: 'Организация контрагента', width: 300, wrapText: true },
    { field: 'doc_date', headerName: 'дата договора', width: 120, valueFormatter: formatDate },
    { field: 'start_date', headerName: 'начало оказания услуг', width: 150, valueFormatter: formatDate },
    { 
        field: 'manual_end_date', 
        headerName: 'окончание оказания услуг (руками)', 
        width: 200, 
        valueFormatter: formatDate,
        editable: true,   // пользователь может ввести дату
    },
    { field: 'end_date', headerName: 'дата окончания договора', width: 150, valueFormatter: formatDate },
    { field: 'plan_2026', headerName: 'План 2026 год', width: 140 , valueFormatter:formatNumber },
    { field: 'obligations_2026', headerName: 'Обязательства - Принято обязательств по расходам 2026', width: 280, valueFormatter:formatNumber},
    { field: 'invoices', headerName: 'Выставлено счетов', width: 160 },
    { field: 'paid_total', headerName: 'Оплачено всего, в т.ч.', width: 200 },
    { field: 'balance_remain', headerName: 'Остаток для исполнения', width: 180 },
    { field: 'approvals_2026', headerName: 'Согласование служебок 2026 год', width: 250 },
    { field: 'plan_2027', headerName: 'План 2027', width: 140 , valueFormatter:formatNumber },
    { field: 'obligations_2027', headerName: 'Обязательства - Принято обязательств по расходам 2027', width: 280 , valueFormatter:formatNumber },
    { field: 'approvals_2027', headerName: 'Согласование служебок 2027 год', width: 250 }
];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const getDataPath = (data) => {
    if (data.type === 'parent') return [data.id];
    if (data.type === 'child') return [data.parentId, data.id];
    return [];
  };

  if (loading) return <div>Загрузка отчёта...</div>;

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={exportToExcel} style={{ padding: '8px 16px' }}>📎 Экспорт в Excel</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 'calc(100% - 50px)', width: '100%' }}>
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
            // Здесь можно добавить сохранение manual_end_date в БД
            console.log('Изменено поле', params.colDef.field, params.newValue, params.data);
          }}
        />
      </div>
    </div>
  );
}

export default ReportPage;