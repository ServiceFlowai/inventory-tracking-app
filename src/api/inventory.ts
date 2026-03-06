import { InventoryItem } from '../pages/Inventory';

let inventoryData: InventoryItem[] = [
  {
    sku: '12345',
    name: 'Widget A',
    description: 'A useful widget',
    category: 'Widgets',
    unitOfMeasure: 'pcs',
    unitCost: 2.5,
    supplier: 'Supplier X',
    quantity: 100
  },
  {
    sku: '67890',
    name: 'Gadget B',
    description: 'A handy gadget',
    category: 'Gadgets',
    unitOfMeasure: 'pcs',
    unitCost: 5.0,
    supplier: 'Supplier Y',
    quantity: 50
  }
];

export const getInventory = () => {
  return new Promise<InventoryItem[]>((resolve) => {
    setTimeout(() => resolve(inventoryData), 500);
  });
};

export const addInventoryItem = (item: InventoryItem) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      inventoryData.push(item);
      resolve();
    }, 500);
  });
};

export const updateInventoryItem = (sku: string, updatedItem: Partial<InventoryItem>) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const index = inventoryData.findIndex(item => item.sku === sku);
      if (index !== -1) {
        inventoryData[index] = { ...inventoryData[index], ...updatedItem };
        resolve();
      } else {
        reject('Item not found');
      }
    }, 500);
  });
};

export const deleteInventoryItem = (sku: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const index = inventoryData.findIndex(item => item.sku === sku);
      if (index !== -1) {
        inventoryData.splice(index, 1);
        resolve();
      } else {
        reject('Item not found');
      }
    }, 500);
  });
};