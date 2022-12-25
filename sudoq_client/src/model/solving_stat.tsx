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
    newStat.results[size] = {size: size, solved: true, time: time, medianTime: medianTime};
    return newStat;
  }

  wrong(size: number, time: number, medianTime: number): SolvingStat {
    const newStat = new SolvingStat()
    newStat.results = this.results
    newStat.results[size] = {size: size, solved: false, time: time, medianTime: medianTime};
    return newStat;
  }
}