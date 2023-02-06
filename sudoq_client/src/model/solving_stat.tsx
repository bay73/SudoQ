export interface SingleResult {
  size: number;
  solved: boolean;
  time: number;
  medianTime: number;
}


export class SolvingStat{

  results: { [id: number]: SingleResult}

  constructor() {
    this.results = {}
  }

  correct(size: number, time: number, medianTime: number): SolvingStat {
    const newStat = new SolvingStat()
    newStat.results = this.results
    newStat.results[size] = {size: size, solved: true, time: time, medianTime: medianTime}
    return newStat;
  }

  wrong(size: number, time: number, medianTime: number): SolvingStat {
    const newStat = new SolvingStat()
    newStat.results = this.results
    newStat.results[size] = {size: size, solved: false, time: time, medianTime: medianTime}
    return newStat
  }

  static fromJson(solvingStatJson: string | null) {
    if (solvingStatJson !== null) {
      try {
        const stat = JSON.parse(solvingStatJson)
        const newStat = new SolvingStat()
        if (typeof stat.results === 'object') {
          for (const result of Object.values(stat.results)) {
            const item = result as SingleResult
            newStat.results[item.size] = item
          }
        }
        return newStat
      } catch(e){
      }
    }
    return new SolvingStat()
  }
}
