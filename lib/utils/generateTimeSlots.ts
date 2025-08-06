import { ITimeSlot } from '../models/Field';

export interface TimeSlotOptions {
  startHour?: number;
  endHour?: number;
  daysAhead?: number;
  basePrice?: number;
  priceVariation?: number;
  availabilityRate?: number;
}

export function generateTimeSlots(options: TimeSlotOptions = {}): ITimeSlot[] {
  const {
    startHour = 8,
    endHour = 22,
    daysAhead = 14,
    basePrice = 100000,
    priceVariation = 50000,
    availabilityRate = 0.7,
  } = options;

  const slots: ITimeSlot[] = [];
  const today = new Date();

  for (let day = 0; day < daysAhead; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

      // Generate price with some variation
      const priceVariationAmount = Math.floor(Math.random() * priceVariation);
      const price = basePrice + priceVariationAmount;

      // Determine availability based on rate
      const isAvailable = Math.random() < availabilityRate;

      slots.push({
        date: dateStr,
        startTime,
        endTime,
        isAvailable,
        price,
      });
    }
  }

  return slots;
}

export function generateTimeSlotsForField(
  fieldId: string,
  options: TimeSlotOptions = {}
): ITimeSlot[] {
  return generateTimeSlots(options);
}

export function updateTimeSlotAvailability(
  slots: ITimeSlot[],
  date: string,
  startTime: string,
  endTime: string,
  isAvailable: boolean
): ITimeSlot[] {
  return slots.map(slot => {
    if (slot.date === date && 
        slot.startTime >= startTime && 
        slot.endTime <= endTime) {
      return { ...slot, isAvailable };
    }
    return slot;
  });
} 