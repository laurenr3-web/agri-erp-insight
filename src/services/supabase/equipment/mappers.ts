
import { Equipment } from './types';

/**
 * Convertit un objet de la base de données en modèle Equipment
 */
export function mapEquipmentFromDatabase(dbEquipment: any): Equipment {
  return {
    id: dbEquipment.id,
    name: dbEquipment.name,
    model: dbEquipment.model,
    manufacturer: dbEquipment.manufacturer,
    year: dbEquipment.year,
    serialNumber: dbEquipment.serial_number,
    purchaseDate: dbEquipment.purchase_date 
      ? new Date(dbEquipment.purchase_date) 
      : undefined,
    location: dbEquipment.location,
    status: dbEquipment.status,
    type: dbEquipment.type,
    category: dbEquipment.category,
    image: dbEquipment.image,
    notes: dbEquipment.notes,
    owner_id: dbEquipment.owner_id
  };
}

/**
 * Convertit un modèle Equipment en objet pour la base de données
 */
export function mapEquipmentToDatabase(equipment: Omit<Equipment, 'id'> | Equipment): any {
  // Convertir les dates en ISO string pour Supabase
  let purchaseDate = equipment.purchaseDate 
    ? (equipment.purchaseDate instanceof Date 
      ? equipment.purchaseDate.toISOString() 
      : new Date(equipment.purchaseDate).toISOString())
    : null;
  
  const dbEquipment = {
    name: equipment.name,
    model: equipment.model,
    manufacturer: equipment.manufacturer,
    year: equipment.year,
    serial_number: equipment.serialNumber,
    purchase_date: purchaseDate,
    location: equipment.location,
    status: equipment.status,
    type: equipment.type,
    category: equipment.category,
    image: equipment.image,
    notes: equipment.notes
  };

  // Add id only if it exists
  if ('id' in equipment) {
    return { ...dbEquipment, id: equipment.id };
  }

  return dbEquipment;
}
