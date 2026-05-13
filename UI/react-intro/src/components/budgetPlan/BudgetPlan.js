// components/ReportPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const formatNumber = (params) => {
  if (params.value == null) return '';
  return params.value.toLocaleString('ru-RU');
};

function ReportPage() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/';
  const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/budget-report/consolidated');
      setRowData(res.data.report || []);
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
    window.open(`${baseURL}api/report/export-excel`, '_blank');
  };

  const columnDefs = [
    { field: 'kfsr', headerName: 'КФСР', width: 100 },
    { field: 'kcsr', headerName: 'КЦСР', width: 150 },
    { field: 'kvr', headerName: 'КВР', width: 100 },
    { field: 'kosgu', headerName: 'КОСГУ', width: 100 },
    { field: 'kvfo', headerName: 'КВФО', width: 100 },
    { field: 'doc_num', headerName: 'Номер документа', width: 180 },
    { field: 'counterparty', headerName: 'Организация контрагента', width: 300, wrapText: true },
    { field: 'total_sum', headerName: 'Общая сумма', width: 150, valueFormatter: formatNumber },
    { field: 'contract_sum', headerName: 'Сумма контракта', width: 150, valueFormatter: formatNumber },
    { field: 'payment_plan_2026', headerName: 'План 2026', width: 140, valueFormatter: formatNumber },
    { field: 'payment_plan_2027', headerName: 'План 2027', width: 140, valueFormatter: formatNumber },
    { field: 'payment_plan_2028', headerName: 'План 2028', width: 140, valueFormatter: formatNumber },
    { field: 'curr_year_sum', headerName: 'Сумма тек. года', width: 150, valueFormatter: formatNumber },
    { field: 'exec_curr_year', headerName: 'Исполнено в тек. году', width: 180, valueFormatter: formatNumber },
    { field: 'balance', headerName: 'Остаток', width: 130, valueFormatter: formatNumber }
    // При необходимости добавьте остальные поля из контракта
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
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
          defaultColDef={defaultColDef}
          animateRows
        />
      </div>
    </div>
  );
}

export default ReportPage;