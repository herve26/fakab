export const materialWithStockQuery = `SELECT
m.materialId,
m.materialName,
m.materialCode,
m.materialDesc,
mu.unitCode,
mu.unitName,
SUM(od.orderQuantity) AS inStock
FROM Material m
JOIN MaterialUnit mu ON m.materialUnitCode = mu.unitCode
LEFT JOIN OrderDetail od ON m.materialId = od.materialId
GROUP BY m.materialId, m.materialName, m.materialCode, m.materialDesc, mu.unitCode, mu.unitName
ORDER BY m.materialName;`