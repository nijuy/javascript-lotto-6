import { Console, Random } from '@woowacourse/mission-utils';
import ERROR_MESSAGE from './ErrorMessage';
import Lotto from './Lotto';

const LOTTO_PRICE = 1000;

class App {
  #winning;

  constructor() {
    this.lottos = [];
  }

  static validatePayment(input) {
    const payment = Number(input);

    if (Number.isNaN(payment)) {
      throw new Error(ERROR_MESSAGE.nonNumeric);
    }
    if (payment <= 0 || !Number.isInteger(payment / LOTTO_PRICE)) {
      throw new Error(ERROR_MESSAGE.invalidAmount);
    }
  }

  validateBonusNumber(input) {
    const bonus = Number(input);

    if (Number.isNaN(bonus)) {
      throw new Error(ERROR_MESSAGE.nonNumeric);
    }
    if (!Number.isInteger(bonus) || bonus < 1 || bonus > 45) {
      throw new Error(ERROR_MESSAGE.outOfRange);
    }
    if (this.#winning.includes(bonus)) {
      throw new Error(ERROR_MESSAGE.duplicateWinningNumber);
    }
  }

  generateLottos(amount) {
    for (let i = 0; i < amount; i += 1) {
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6);
      numbers.sort((a, b) => a - b);
      this.lottos.push(new Lotto(numbers));
      this.lottos[i].print();
    }
  }

  async play() {
    const payment = await Console.readLineAsync('구입금액을 입력해 주세요.\n');
    App.validatePayment(payment);
    const amount = payment / LOTTO_PRICE;
    Console.print(`\n${amount}개를 구매했습니다.`);

    this.generateLottos(amount);

    const userSelected = await Console.readLineAsync(
      '\n당첨 번호를 입력해 주세요.\n',
    );
    this.#winning = new Lotto(
      userSelected.split(',').map((string) => Number(string)),
    );

    const bonusNumber = await Console.readLineAsync(
      '\n보너스 번호를 입력해 주세요.\n',
    );
    this.validateBonusNumber(bonusNumber);
  }
}

export default App;
