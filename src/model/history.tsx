export interface HistoryItem {
  day: number
  date:   Date;
  value:  number;
}

export class History {

  items: HistoryItem[]
  
  constructor() {
    this.items = []
  }
  
  static fromJson(historyJson: string | null) {
    const newHistory = new History()
    if (historyJson != null) {
      try {
        const startDate = getStartDate(historyJson)
        if (startDate != null) {
          const history = JSON.parse(historyJson)
          for (const [key, value] of Object.entries(history)) {
            if (key !== "historyStartDate" && key !== "historyStart" && typeof value === 'string') {
              const day = parseInt(key.substring(7))
              const numValue = parseInt(value)
              if (!isNaN(day) && !isNaN(numValue)) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + day);
                const item = {day: day, date: date, value: numValue}
                newHistory.items.push(item)
              }
            }
          }
        }
      } catch(e){
      }
    }
    return newHistory
  }
}

export const epochStart = new Date("2023-01-01T00:00:00.000Z")

export function getStartDate(historyJson: string | null): Date | null {
  if (historyJson == null) {
    return null
  }
  const history = JSON.parse(historyJson)
  if (history.historyStart !== undefined) {
    const startDay = parseInt(history.historyStart)
    if (!isNaN(startDay)) {
      var startDate = new Date(epochStart)
      startDate.setDate(startDate.getDate() + startDay);
      return startDate
    }
  }
  if (history.historyStartDate !== undefined) {
    const startDate = new Date(history.historyStartDate)
    if (!isNaN(startDate.getTime())) {
      startDate.setTime(startDate.getTime() + (4*60*60*1000));
      return startDate
    }
  }
  return null
}

export function getDateFromDay(startDay: number): Date {
  var startDate = new Date(epochStart)
  startDate.setDate(startDate.getDate() + startDay);
  return startDate
}
