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
        const history = JSON.parse(historyJson)
        if (history.historyStartDate !== undefined) {
          const startDate = new Date(history.historyStartDate)
          for (const [key, value] of Object.entries(history)) {
            if (key !== "historyStartDate" && typeof value === 'string') {
              const day = parseInt(key.substring(7))
              const numValue = parseInt(value)
              if (!isNaN(day) && !isNaN(numValue)) {
                const date = new Date();
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