import { Console, Random } from '@woowacourse/mission-utils';
import Lotto from './Lotto';
import Input from './Input';

const LOTTO_COST = 1000;
const LOTTO_PRIZE = new Map([
  [5, 5000],
  [4, 50000],
  [3, 1500000],
  [2, 30000000],
  [1, 2000000000],
]);

class App {
  #winning;
  #bonus;
  #payment;
  #totalPrize;
  #rankedLotto;

  constructor() {
    this.lottos = [];
    this.#totalPrize = 0;
    this.#rankedLotto = new Map([
      [5, 0],
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 0],
    ]);
  }

  async play() {
    this.#payment = await Input.payment();
    const amount = this.#payment / LOTTO_COST;
    Console.print(`\n${amount}개를 구매했습니다.`);

    this.generateLottos(amount);

    this.#winning = await Input.winning();
    this.#bonus = await Input.bonusNumber(this.#winning);

    this.calculateResult();
    this.printResult();
  }

  generateLottos(amount) {
    for (let i = 0; i < amount; i += 1) {
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6);
      numbers.sort((a, b) => a - b);
      this.lottos.push(new Lotto(numbers));
      this.lottos[i].print();
    }
  }

  setRank(matched, matchedBonus) {
    if (matched < 3) return;

    let rank = 8 - matched;
    if (rank === 3 && matchedBonus) {
      rank = 2;
    }

    this.#rankedLotto.set(rank, this.#rankedLotto.get(rank) + 1);
    this.#totalPrize += LOTTO_PRIZE.get(rank);
  }

  calculateResult() {
    this.lottos.forEach((lotto) => {
      const matched = lotto.countMatched(this.#winning);
      const matchedBonus = lotto.includes(this.#bonus);
      this.setRank(matched, matchedBonus);
    });
  }

  printRankedLotto(rank, prize, count) {
    const formattedPrize = new Intl.NumberFormat().format(prize);
    const matched = rank > 2 ? 8 - rank : 7 - rank;

    if (rank === 2) {
      Console.print(
        `${matched}개 일치, 보너스 볼 일치 (${formattedPrize}원) - ${count}개`,
      );
    } else {
      Console.print(`${matched}개 일치 (${formattedPrize}원) - ${count}개`);
    }
  }

  printMarginRate() {
    const marginRate = (this.#totalPrize / this.#payment) * 100;
    Console.print(`총 수익률은 ${marginRate.toFixed(1)}%입니다.`);
  }

  printResult() {
    this.#rankedLotto.forEach((count, rank) => {
      this.printRankedLotto(rank, LOTTO_PRIZE.get(rank), count);
    });
    this.printMarginRate();
  }
}

export default App;
