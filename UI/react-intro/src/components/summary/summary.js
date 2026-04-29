import React, { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

//Для форматирования чисел
const formatNumber = (params) => {
  if (params.value == null || params.value === '') return '';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(params.value);
};

function Summary() {
  const gridRef = useRef();

  const [columnDefs] = useState([
    { 
      headerName: 'Номер документа', 
      field: 'docNum', 
      width: 220, 
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    { headerName: 'Статус документа', field: 'docStatus', width: 150 },
    { headerName: 'Дата документа', field: 'docDate', width: 140 },
    { headerName: 'Дата регистрации', field: 'regDate', width: 150 },
    { headerName: 'Дата принятия', field: 'acceptDate', width: 140 },
    { headerName: 'Дата исполнения', field: 'execDate', width: 150 },
    { headerName: 'Общая сумма', field: 'totalSum', width: 150, valueFormatter: formatNumber },
    { headerName: 'Признак договора', field: 'contractType', width: 160 },
    { headerName: 'Организация контрагента', field: 'counterparty', width: 300 },
    { headerName: 'Сумма контракта', field: 'contractSum', width: 160, valueFormatter: formatNumber },
    { headerName: 'Сумма тек. года', field: 'currYearSum', width: 150, valueFormatter: formatNumber },
    { headerName: 'Исполнено в тек. году', field: 'execCurrYear', width: 180, valueFormatter: formatNumber },
    { headerName: 'Исполнено в прошлых периодах', field: 'execPastPeriods', width: 220, valueFormatter: formatNumber },
    { headerName: 'В исполнении', field: 'inExecution', width: 140, valueFormatter: formatNumber },
    { headerName: 'Сумма аванса', field: 'advanceSum', width: 140, valueFormatter: formatNumber },
    { headerName: 'Остаток', field: 'balance', width: 130, valueFormatter: formatNumber },
    { headerName: 'Общий остаток', field: 'totalBalance', width: 150, valueFormatter: formatNumber },
    { headerName: 'Прикреплен документ', field: 'isAttached', width: 180 },
    { headerName: 'Дата документа-основания', field: 'baseDocDate', width: 220 },
    { headerName: 'Дата начала действия', field: 'startDate', width: 180 },
    { headerName: 'Дата окончания действия', field: 'endDate', width: 190 },
  ]);

  const [rowData, setRowData] = useState([
    {
      id: 1, docNum: '25-25-О', docStatus: 'Обработан', docDate: '13.03.2025', regDate: '19.03.2025',
      acceptDate: '17.03.2025', execDate: '18.12.2025', totalSum: 300000, contractType: 'Однолетний',
      counterparty: 'Общество с ограниченной ответственностью "Асфальтобетонный завод №1"',
      contractSum: 300000, currYearSum: 300000, execCurrYear: 296800, execPastPeriods: 0,
      inExecution: 0, advanceSum: 0, balance: 3200, totalBalance: 3200, isAttached: true,
      baseDocDate: '13.03.2025', startDate: '13.03.2025', endDate: '31.12.2025'
    },
    {
      id: 2, docNum: '26-25-РЕГ', docStatus: 'Отказан', docDate: '24.03.2025', regDate: '', acceptDate: '',
      execDate: '', totalSum: 61422000, contractType: 'Многолетний',
      counterparty: 'ФЕДЕРАЛЬНОЕ КАЗЕННОЕ ПРЕДПРИЯТИЕ "ПЕРМСКИЙ ПОРОХОВОЙ ЗАВОД"',
      contractSum: 61422000, currYearSum: 27030000, execCurrYear: 0, execPastPeriods: 0,
      inExecution: 0, advanceSum: 0, balance: 27030000, totalBalance: 61422000, isAttached: true,
      baseDocDate: '24.03.2025', startDate: '24.03.2025', endDate: '31.12.2026'
    }
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  const handleAddRow = useCallback(() => {
    const newRow = { 
      id: Date.now(), docNum: 'Новый документ', docStatus: 'Черновик', isAttached: false, totalSum: 0,
      contractSum: 0, currYearSum: 0, execCurrYear: 0, execPastPeriods: 0, inExecution: 0,
      advanceSum: 0, balance: 0, totalBalance: 0, counterparty: ''
    };
    setRowData(prevData => [...prevData, newRow]);
  }, []);

  const handleDeleteRow = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes?.length) {
      alert('Сначала отметьте галочкой строки для удаления');
      return;
    }
    const selectedIds = selectedNodes.map(node => node.data.id);
    setRowData(prevData => prevData.filter(row => !selectedIds.includes(row.id)));
  }, []);

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #ccc' }}>
        <button onClick={handleAddRow} style={{ padding: '6px 12px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          + Добавить строку
        </button>
        <button onClick={handleDeleteRow} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          - Удалить выбранные
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ flex: 1, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default Summary;