import XLSX from "xlsx";

export async function parseSalesData(file) {
  const { buffer, originalname } = file;
  const ext = originalname.toLowerCase();

  let rows = [];

  if (ext.endsWith(".csv")) {
    const text = buffer.toString("utf-8");
    rows = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.split(","));
  } else if (ext.endsWith(".xlsx")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  } else {
    throw new Error("Unsupported file format");
  }

  if (rows.length < 2) {
    throw new Error("File appears to be empty or missing data rows.");
  }

  const [header, ...dataRows] = rows;
  const headerIndex = (name) => header.indexOf(name);

  const idxDate = headerIndex("Date");
  const idxCategory = headerIndex("Product_Category");
  const idxRegion = headerIndex("Region");
  const idxUnits = headerIndex("Units_Sold");
  const idxUnitPrice = headerIndex("Unit_Price");
  const idxRevenue = headerIndex("Revenue");

  if ([idxDate, idxCategory, idxRegion, idxUnits, idxUnitPrice, idxRevenue].some((i) => i === -1)) {
    throw new Error("Missing required columns in file.");
  }

  let totalRevenue = 0;
  const revenueByCategory = {};
  const revenueByRegion = {};
  const unitsByRegion = {};
  let totalUnits = 0;
  let totalUnitPrice = 0;
  let countUnitPrice = 0;

  dataRows.forEach((row) => {
    const category = row[idxCategory];
    const region = row[idxRegion];
    const units = Number(row[idxUnits]) || 0;
    const unitPrice = Number(row[idxUnitPrice]) || 0;
    const revenue = Number(row[idxRevenue]) || units * unitPrice;

    totalRevenue += revenue;
    totalUnits += units;
    totalUnitPrice += unitPrice;
    countUnitPrice += 1;

    if (!revenueByCategory[category]) revenueByCategory[category] = 0;
    if (!revenueByRegion[region]) revenueByRegion[region] = 0;
    if (!unitsByRegion[region]) unitsByRegion[region] = 0;

    revenueByCategory[category] += revenue;
    revenueByRegion[region] += revenue;
    unitsByRegion[region] += units;
  });

  const topProductCategory = Object.entries(revenueByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const topRegion = Object.entries(revenueByRegion).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const averageUnitPrice = countUnitPrice ? totalUnitPrice / countUnitPrice : 0;

  return {
    totalRevenue,
    topProductCategory,
    topRegion,
    averageUnitPrice,
    unitsByRegion,
  };
}

