
import XLSX from 'xlsx'

const downloadJsonToSheet = (datas, header, filePath, sheetName) => {
  // console.log({ filePath, sheetName })
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(datas, header)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  return XLSX.writeFile(wb, filePath)
}

export default {
  downloadJsonToSheet
}