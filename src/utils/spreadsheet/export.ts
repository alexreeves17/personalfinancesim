import type { SpreadsheetData } from '../../types/spreadsheet';

export function exportToExcel(data: SpreadsheetData) {
  // Convert data to CSV format
  const csv = convertToCSV(data);
  
  // Create Excel file with proper MIME type
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  
  // Trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'financial-projection.xlsx';
  a.click();
  
  window.URL.revokeObjectURL(url);
}

export function exportToCSV(data: SpreadsheetData) {
  const csv = convertToCSV(data);
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'financial-projection.csv';
  a.click();
  
  window.URL.revokeObjectURL(url);
}

function convertToCSV(data: SpreadsheetData): string {
  const rows: string[] = [];
  
  // Headers
  rows.push(['Category', 'Metric', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'].join(','));
  
  // Data rows
  Object.entries(data).forEach(([category, fields]) => {
    Object.entries(fields).forEach(([field, { label, values }]) => {
      rows.push([
        category,
        label,
        ...values.map(v => v.toString())
      ].join(','));
    });
  });
  
  return rows.join('\n');
}