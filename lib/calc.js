class Averages {
  /* Get average */
  average(values) {
    let total = 0;

    for (let i = 0; i < values.length; i += 1) {
      total += values[i];
    }

    return total / values.length;
  }

  /* Get Median */
  median(values) {
    const half = Math.floor(values.length / 2);

    values.sort((a, b) => a - b);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2;
  }
  /* Get quartile */
  quartile(values, percentile) {
    values.sort((a, b) => a - b);
    const pos = (values.length - 1) * percentile;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (values[base + 1] !== undefined) {
      return values[base] + rest * (values[base + 1] - values[base]);
    }

    return values[base];
  }
}

const calc = new Averages();
module.exports = calc;
